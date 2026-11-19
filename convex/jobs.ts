import { v, ConvexError } from "convex/values";
import { Workpool } from "@convex-dev/workpool";
import {
  query,
  mutation,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { components, internal } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireOwner } from "./users";
import { settings, audit, notify } from "./helpers";
import {
  canReserve,
  reservationUsd,
  modelRates,
  type CrmModel,
} from "../lib/crm/policy";
import {
  jobDoc,
  leadDoc,
  settingsFields,
  draftFields,
  source,
  observation,
  fitAssessment,
} from "./validators";
import { upsertLead } from "./crm";
import { coldProspect, knownEnterprise } from "../lib/crm/targeting";
import { cancelFollowups } from "./helpers";
export const aiPool = new Workpool(components.aiPool, {
  maxParallelism: 2,
  retryActionsByDefault: false,
});
const kind = v.union(
  v.literal("discovery"),
  v.literal("research"),
  v.literal("draft"),
  v.literal("proposal"),
  v.literal("classify"),
);
export async function scheduleJob(
  ctx: MutationCtx,
  args: {
    kind: "discovery" | "research" | "draft" | "proposal" | "classify";
    leadId?: Id<"leads">;
    query?: string;
  },
) {
  const s = await settings(ctx);
  if (s.model === "gpt-6.2-astra")
    throw new ConvexError(
      "Astra is disabled for this CRM. Choose Luna or Sol.",
    );
  if (!process.env.OPENAI_API_KEY)
    throw new ConvexError(
      "Connect a server-side OpenAI key first. Lead management remains available.",
    );
  if (!process.env.OPENAI_ORG_ID)
    throw new ConvexError("Verify and configure the OpenAI organization first");
  if (args.kind !== "discovery" && !args.leadId)
    throw new ConvexError("Select a lead");
  if (args.leadId && !(await ctx.db.get(args.leadId)))
    throw new ConvexError("Lead not found");
  if (args.leadId) {
    const lead = await ctx.db.get(args.leadId);
    if (
      lead &&
      coldProspect(lead) &&
      ["research", "draft"].includes(args.kind)
    ) {
      if (
        knownEnterprise(lead.name, lead.website) ||
        lead.targetFit?.status === "excluded"
      )
        throw new ConvexError(
          "This enterprise or excluded prospect is outside your target profile",
        );
      if (
        args.kind === "draft" &&
        (lead.excluded ||
          lead.targetFit?.status !== "matched" ||
          (lead.opportunityScore ?? 0) < 20)
      )
        throw new ConvexError(
          "Verify small-business fit and the service opportunity before drafting outreach",
        );
    }
    const active = await ctx.db
      .query("jobs")
      .withIndex("by_leadId", (q) => q.eq("leadId", args.leadId))
      .order("desc")
      .take(20);
    if (
      active.some(
        (j) =>
          j.kind === args.kind &&
          ["queued", "running", "uncertain"].includes(j.state),
      )
    )
      throw new ConvexError("This lead already has active or uncertain work");
  }
  const now = Date.now(),
    day = new Date(now).toISOString().slice(0, 10),
    month = day.slice(0, 7);
  const today = await ctx.db
    .query("usage")
    .withIndex("by_day", (q) => q.eq("day", day))
    .take(1000);
  // Definite provider rejections with no response or usage do not consume the
  // research allowance. Pending/uncertain work still counts before enqueueing.
  const acceptedOrPending = today.filter(
    (u) =>
      !(
        u.status === "settled" &&
        !u.responseId &&
        u.inputTokens === 0 &&
        u.outputTokens === 0 &&
        u.searchCalls === 0
      ),
  );
  if (acceptedOrPending.length >= s.dailyVolume)
    throw new ConvexError("Daily AI research/job volume reached");
  const reserved = reservationUsd(
    s.model,
    ["discovery", "research"].includes(args.kind),
  );
  const daily = await ctx.db
      .query("budgets")
      .withIndex("by_period", (q) => q.eq("period", day))
      .unique(),
    monthly = await ctx.db
      .query("budgets")
      .withIndex("by_period", (q) => q.eq("period", month))
      .unique();
  if (
    !canReserve(
      (daily?.spent ?? 0) + (daily?.reserved ?? 0),
      (monthly?.spent ?? 0) + (monthly?.reserved ?? 0),
      reserved,
      s.dailyLimit,
      s.monthlyLimit,
    )
  )
    throw new ConvexError(
      `Spending limit: this request needs a conservative $${reserved.toFixed(2)} reservation including search`,
    );
  for (const [period, bucket] of [
    [day, daily],
    [month, monthly],
  ] as const) {
    if (bucket)
      await ctx.db.patch(bucket._id, { reserved: bucket.reserved + reserved });
    else await ctx.db.insert("budgets", { period, spent: 0, reserved });
  }
  if (args.kind === "research" && args.leadId) {
    const lead = await ctx.db.get(args.leadId);
    if (lead?.stage === "new")
      await ctx.db.patch(lead._id, { stage: "researching", updatedAt: now });
  }
  const id = await ctx.db.insert("jobs", {
    kind: args.kind,
    ...(args.leadId ? { leadId: args.leadId } : {}),
    state: "queued",
    error: "",
    attempt: 1,
    query: (args.query ?? "").slice(0, 500),
    reservation: reserved,
    createdAt: now,
  });
  const usageId = await ctx.db.insert("usage", {
    jobId: id,
    model: s.model,
    day,
    month,
    reserved,
    estimated: 0,
    inputTokens: 0,
    outputTokens: 0,
    searchCalls: 0,
    status: "reserved",
    responseId: "",
    createdAt: now,
  });
  await ctx.db.patch(id, { usageId });
  await aiPool.enqueueAction(
    ctx,
    internal.ai.run,
    { jobId: id },
    { retry: false },
  );
  await audit(
    ctx,
    "job.queued",
    `${args.kind}; reserved $${reserved.toFixed(2)}`,
    args.leadId,
    "system",
  );
  return id;
}
export const enqueue = mutation({
  args: {
    kind,
    leadId: v.optional(v.id("leads")),
    query: v.optional(v.string()),
  },
  returns: v.id("jobs"),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    return scheduleJob(ctx, args);
  },
});
export const retry = mutation({
  args: { id: v.id("jobs") },
  returns: v.id("jobs"),
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    const job = await ctx.db.get(id);
    if (!job || job.state !== "failed")
      throw new ConvexError(
        "Only confirmed failed work can be retried. Reconcile uncertain requests first.",
      );
    const replacement = await scheduleJob(ctx, {
      kind: job.kind,
      leadId: job.leadId,
      query: job.query,
    });
    await ctx.db.patch(job._id, {
      resolvedAt: Date.now(),
      retriedByJobId: replacement,
    });
    return replacement;
  },
});
// One controlled recovery pass for the old 200 KB fetch limit. No uncertain
// request is retried, and each new attempt uses normal atomic budget controls.
export const retryOversizedSources = internalMutation({
  args: {},
  returns: v.object({ queued: v.number(), excluded: v.number() }),
  handler: async (ctx) => {
    let queued = 0,
      excluded = 0;
    const failed = await ctx.db
      .query("jobs")
      .withIndex("by_state", (q) => q.eq("state", "failed"))
      .take(50);
    for (const job of failed) {
      if (
        job.kind !== "research" ||
        job.error !== "Original source is too large" ||
        job.resolvedAt ||
        !job.leadId
      )
        continue;
      const lead = await ctx.db.get(job.leadId);
      if (!lead) continue;
      if (
        coldProspect(lead) &&
        (lead.excluded || knownEnterprise(lead.name, lead.website))
      ) {
        await ctx.db.patch(job._id, { resolvedAt: Date.now() });
        excluded++;
        continue;
      }
      try {
        const replacement = await scheduleJob(ctx, {
          kind: "research",
          leadId: job.leadId,
          query: job.query,
        });
        await ctx.db.patch(job._id, {
          resolvedAt: Date.now(),
          retriedByJobId: replacement,
        });
        queued++;
      } catch {
        /* Active work or budgets remain authoritative; no unbounded retries. */
      }
    }
    return { queued, excluded };
  },
});
export const context = internalQuery({
  args: { jobId: v.id("jobs") },
  returns: v.object({
    job: jobDoc,
    lead: v.union(leadDoc, v.null()),
    settings: v.object(settingsFields),
    existingDomains: v.array(v.string()),
    messages: v.array(
      v.object({
        body: v.string(),
        direction: v.string(),
        subject: v.string(),
      }),
    ),
  }),
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job) throw new ConvexError("Job not found");
    const s = await settings(ctx);
    const usage = job.usageId ? await ctx.db.get(job.usageId) : null;
    const reservedModel = usage?.model ?? s.model;
    if (!Object.hasOwn(modelRates, reservedModel))
      throw new ConvexError(
        "Unknown reserved model; reconcile this job before retrying",
      );
    const {
      _id: ignored,
      _creationTime: ignored2,
      ...clean
    } = s as typeof s & { _id?: string; _creationTime?: number };
    void ignored;
    void ignored2;
    return {
      job,
      lead: job.leadId ? await ctx.db.get(job.leadId) : null,
      settings: { ...clean, model: reservedModel as CrmModel },
      existingDomains:
        job.kind === "discovery"
          ? (await ctx.db.query("leads").order("desc").take(250))
              .map((lead) => lead.domain)
              .filter(Boolean)
          : [],
      messages: job.leadId
        ? (
            await ctx.db
              .query("messages")
              .withIndex("by_leadId", (q) => q.eq("leadId", job.leadId!))
              .order("desc")
              .take(12)
          ).map((m) => ({
            body: m.body.slice(0, 2500),
            subject: m.subject,
            direction: m.direction,
          }))
        : [],
    };
  },
});
export const start = internalMutation({
  args: { jobId: v.id("jobs") },
  returns: v.boolean(),
  handler: async (ctx, { jobId }) => {
    const job = await ctx.db.get(jobId);
    if (!job || job.state !== "queued") return false;
    await ctx.db.patch(jobId, { state: "running" });
    return true;
  },
});
export const settle = internalMutation({
  args: {
    jobId: v.id("jobs"),
    estimated: v.number(),
    inputTokens: v.number(),
    outputTokens: v.number(),
    searchCalls: v.number(),
    responseId: v.string(),
    uncertain: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job?.usageId) return null;
    const usage = await ctx.db.get(job.usageId);
    if (!usage || usage.status === "settled") return null;
    if (args.uncertain) {
      await ctx.db.patch(usage._id, { status: "uncertain" });
      return null;
    }
    for (const period of [usage.day, usage.month]) {
      const b = await ctx.db
        .query("budgets")
        .withIndex("by_period", (q) => q.eq("period", period))
        .unique();
      if (b)
        await ctx.db.patch(b._id, {
          reserved: Math.max(0, b.reserved - usage.reserved),
          spent: b.spent + args.estimated,
        });
    }
    await ctx.db.patch(usage._id, {
      status: "settled",
      estimated: args.estimated,
      inputTokens: args.inputTokens,
      outputTokens: args.outputTokens,
      searchCalls: args.searchCalls,
      responseId: args.responseId,
    });
    const s = await settings(ctx);
    if (args.estimated > usage.reserved) {
      const current = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", "owner"))
        .unique();
      if (current)
        await ctx.db.patch(current._id, {
          autoDiscovery: false,
          autoResearch: false,
          autoDraft: false,
        });
      await notify(
        ctx,
        "Usage exceeded reservation",
        "Review provider pricing before more work runs.",
        "/crm/settings",
        "budget",
      );
    }
    const daily = await ctx.db
      .query("budgets")
      .withIndex("by_period", (q) => q.eq("period", usage.day))
      .unique();
    if (daily && daily.spent + daily.reserved >= s.dailyLimit * 0.8)
      await notify(
        ctx,
        "Daily AI budget nearly reached",
        "Estimated usage and reservations reached 80% of your daily limit.",
        "/crm/automation",
        "budget",
      );
    return null;
  },
});
export const finish = internalMutation({
  args: {
    jobId: v.id("jobs"),
    state: v.union(
      v.literal("complete"),
      v.literal("failed"),
      v.literal("uncertain"),
    ),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { jobId, state, error }) => {
    const job = await ctx.db.get(jobId);
    if (!job) return null;
    await ctx.db.patch(jobId, {
      state,
      error: error.slice(0, 500),
      finishedAt: Date.now(),
    });
    await audit(ctx, `job.${state}`, error || job.kind, job.leadId, "system");
    if (state !== "complete")
      await notify(
        ctx,
        "Workflow needs attention",
        `${job.kind}: ${error.slice(0, 160)}`,
        "/crm/automation",
        "failure",
      );
    return null;
  },
});
export const saveResearch = internalMutation({
  args: {
    leadId: v.id("leads"),
    hash: v.string(),
    contacts: v.array(v.object({ email: v.string(), sourceUrl: v.string() })),
    targetFit: v.optional(fitAssessment),
    sources: v.array(source),
    observations: v.array(observation),
    score: v.number(),
    opportunityScore: v.optional(v.number()),
    reasons: v.array(v.string()),
    service: v.string(),
    nextAction: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;
    for (const { email, sourceUrl } of args.contacts.slice(0, 8)) {
      if (!args.sources.some((s) => s.verified && s.url === sourceUrl))
        continue;
      const prior = await ctx.db
        .query("contacts")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique();
      if (!prior)
        await ctx.db.insert("contacts", {
          email,
          leadId: lead._id,
          name: "",
          verified: true,
          sourceUrl,
        });
    }
    if (!lead.email && args.contacts[0]) {
      const contact = await ctx.db
        .query("contacts")
        .withIndex("by_email", (q) => q.eq("email", args.contacts[0].email))
        .unique();
      if (contact?.leadId === lead._id)
        await ctx.db.patch(lead._id, { email: args.contacts[0].email });
    }
    const s = await settings(ctx);
    const enterprise = coldProspect(lead)
      ? knownEnterprise(lead.name, lead.website)
      : null;
    let targetFit = enterprise
      ? {
          status: "excluded" as const,
          reason: enterprise,
          evidenceUrl: lead.website,
          sizeQuote: "",
          opportunityQuote: "",
        }
      : args.targetFit;
    const weakOpportunity =
      coldProspect(lead) &&
      targetFit?.status === "matched" &&
      (args.opportunityScore ?? 0) < 20;
    if (weakOpportunity && targetFit)
      targetFit = {
        ...targetFit,
        status: "review",
        reason:
          "Small-business scale is verified, but no sufficiently specific service opportunity is evidenced yet. Review before outreach.",
      };
    const fits =
      !coldProspect(lead) ||
      (targetFit?.status === "matched" && (args.opportunityScore ?? 0) >= 20);
    const score = Math.max(
      0,
      Math.min(fits ? 100 : weakOpportunity ? 60 : 45, args.score),
    );
    await ctx.db.patch(lead._id, {
      researchHash: args.hash,
      researchAt: Date.now(),
      sources: args.sources,
      observations: args.observations,
      score,
      ...(args.opportunityScore !== undefined
        ? { opportunityScore: args.opportunityScore }
        : {}),
      ...(targetFit
        ? {
            targetFit,
            excluded:
              coldProspect(lead) && targetFit.status !== "matched"
                ? true
                : undefined,
          }
        : {}),
      scoreReasons: args.reasons,
      suggestedService: args.service,
      nextAction: args.nextAction,
      stage: ["new", "researching", "qualified"].includes(lead.stage)
        ? fits && score >= s.qualificationThreshold
          ? "qualified"
          : "researching"
        : lead.stage,
      updatedAt: Date.now(),
    });
    if (!fits) await cancelFollowups(ctx, lead._id);
    if (fits && score >= s.qualificationThreshold)
      await notify(
        ctx,
        "Qualified lead",
        `${lead.name} scored ${args.score}/100. Review the evidence.`,
        `/crm/leads?id=${lead._id}`,
        "lead",
      );
    return null;
  },
});
export const saveDraft = internalMutation({
  args: { draft: v.object(draftFields) },
  returns: v.id("drafts"),
  handler: async (ctx, { draft }) => {
    const lead = await ctx.db.get(draft.leadId);
    if (!lead) throw new ConvexError("Lead not found");
    if (
      coldProspect(lead) &&
      (lead.excluded ||
        lead.targetFit?.status !== "matched" ||
        (lead.opportunityScore ?? 0) < 20 ||
        knownEnterprise(lead.name, lead.website))
    )
      throw new ConvexError("Outreach requires verified small-business fit");
    const id = await ctx.db.insert("drafts", draft);
    await notify(
      ctx,
      "Draft ready for review",
      draft.subject,
      `/crm/inbox?draft=${id}`,
      "approval",
    );
    await audit(ctx, "draft.created", draft.kind, draft.leadId, "system");
    return id;
  },
});
export const saveDiscovered = internalMutation({
  args: {
    rows: v.array(
      v.object({
        name: v.string(),
        website: v.string(),
        location: v.string(),
        industry: v.string(),
        sourceUrl: v.string(),
        targetFit: fitAssessment,
      }),
    ),
  },
  returns: v.number(),
  handler: async (ctx, { rows }) => {
    let count = 0;
    for (const row of rows.slice(0, 10)) {
      if (
        knownEnterprise(row.name, row.website) ||
        row.targetFit.status === "excluded"
      )
        continue;
      try {
        const result = await upsertLead(
          ctx,
          {
            ...row,
            email: "",
            contactName: "",
            language: "en",
            notes:
              "Discovered by OpenAI web search. Business and contact details require original-source verification.",
          },
          "discovery",
          row.sourceUrl,
        );
        if (result.created) count++;
        if (result.created)
          await ctx.db.patch(result.id, {
            targetFit: row.targetFit,
            excluded:
              row.targetFit.status === "matched" || row.targetFit.sizeQuote
                ? undefined
                : true,
            nextAction:
              row.targetFit.status === "matched" || row.targetFit.sizeQuote
                ? "Research service fit for this verified small business"
                : row.targetFit.reason,
          });
      } catch {
        /* Invalid business URLs are discarded; no contact eligibility is inferred. */
      }
    }
    return count;
  },
});
export const budget = query({
  args: { day: v.string(), month: v.string() },
  returns: v.object({
    dailySpent: v.number(),
    dailyReserved: v.number(),
    monthlySpent: v.number(),
    monthlyReserved: v.number(),
  }),
  handler: async (ctx, { day, month }) => {
    await requireOwner(ctx);
    const d = await ctx.db
        .query("budgets")
        .withIndex("by_period", (q) => q.eq("period", day))
        .unique(),
      m = await ctx.db
        .query("budgets")
        .withIndex("by_period", (q) => q.eq("period", month))
        .unique();
    return {
      dailySpent: d?.spent ?? 0,
      dailyReserved: d?.reserved ?? 0,
      monthlySpent: m?.spent ?? 0,
      monthlyReserved: m?.reserved ?? 0,
    };
  },
});
export const reconcileUsage = mutation({
  args: {
    id: v.id("jobs"),
    estimated: v.number(),
    responseId: v.string(),
    evidence: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    const job = await ctx.db.get(args.id);
    if (!job || job.state !== "uncertain" || !job.usageId)
      throw new ConvexError("Only uncertain requests need reconciliation");
    if (
      args.estimated < 0 ||
      !Number.isFinite(args.estimated) ||
      args.evidence.trim().length < 12
    )
      throw new ConvexError(
        "Enter verified provider cost and reconciliation evidence",
      );
    const usage = await ctx.db.get(job.usageId);
    if (!usage || usage.status === "settled")
      throw new ConvexError("Usage is already settled");
    for (const period of [usage.day, usage.month]) {
      const bucket = await ctx.db
        .query("budgets")
        .withIndex("by_period", (q) => q.eq("period", period))
        .unique();
      if (bucket)
        await ctx.db.patch(bucket._id, {
          reserved: Math.max(0, bucket.reserved - usage.reserved),
          spent: bucket.spent + args.estimated,
        });
    }
    await ctx.db.patch(usage._id, {
      estimated: args.estimated,
      responseId: args.responseId,
      status: "settled",
    });
    await ctx.db.patch(job._id, {
      state: "failed",
      error:
        "Provider usage reconciled by owner. A new explicit retry is available.",
    });
    await audit(
      ctx,
      "usage.reconciled",
      `$${args.estimated}: ${args.evidence.slice(0, 500)}`,
      job.leadId,
    );
    return null;
  },
});
