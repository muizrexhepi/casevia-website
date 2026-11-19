import { applyDelivery } from "./delivery";
import { v, ConvexError } from "convex/values";
import { Workpool } from "@convex-dev/workpool";
import {
  query as importedQuery,
  mutation,
  internalQuery,
  internalMutation,
} from "./_generated/server";
import { components, internal } from "./_generated/api";
import type { MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { requireOwner } from "./users";
import { settings, audit, notify, cancelFollowups } from "./helpers";
import { draftDoc, leadDoc, settingsFields } from "./validators";
import { sendBlock, sendingWindow } from "../lib/crm/policy";
const pool = new Workpool(components.emailPool, {
  maxParallelism: 1,
  retryActionsByDefault: false,
});
export const createDraft = mutation({
  args: {
    leadId: v.id("leads"),
    kind: v.union(
      v.literal("outreach"),
      v.literal("reply"),
      v.literal("followup"),
      v.literal("proposal"),
    ),
    subject: v.string(),
    body: v.string(),
  },
  returns: v.id("drafts"),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    const lead = await ctx.db.get(args.leadId);
    if (!lead) throw new ConvexError("Lead not found");
    return ctx.db.insert("drafts", {
      ...args,
      language: lead.language,
      provider: ["requested", "opted_in"].includes(lead.eligibility)
        ? "resend"
        : "prospecting",
      revision: 1,
      status: "draft",
      price: 0,
      currency: lead.currency,
      scope: "",
      exclusions: "",
      nextSteps: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
export const editDraft = mutation({
  args: {
    id: v.id("drafts"),
    subject: v.string(),
    body: v.string(),
    price: v.number(),
    currency: v.string(),
    scope: v.string(),
    exclusions: v.string(),
    nextSteps: v.string(),
    provider: v.union(v.literal("resend"), v.literal("prospecting")),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...values }) => {
    await requireOwner(ctx);
    const d = await ctx.db.get(id);
    if (!d || !["draft", "approved", "rejected"].includes(d.status))
      throw new ConvexError("Draft cannot be edited in this state");
    if (
      values.subject.length > 180 ||
      values.body.length > 16000 ||
      values.price < 0 ||
      !Number.isFinite(values.price)
    )
      throw new ConvexError("Invalid draft");
    await ctx.db.patch(id, {
      ...values,
      revision: d.revision + 1,
      status: "draft",
      approvedRevision: undefined,
      approvedBy: undefined,
      approvedAt: undefined,
      updatedAt: Date.now(),
    });
    await audit(ctx, "draft.edited", "Previous approval invalidated", d.leadId);
    return null;
  },
});
export const decide = mutation({
  args: { id: v.id("drafts"), approve: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { id, approve }) => {
    const owner = await requireOwner(ctx);
    const d = await ctx.db.get(id);
    if (!d || !["draft", "approved", "rejected"].includes(d.status))
      throw new ConvexError("Draft cannot be approved in this state");
    if (
      approve &&
      d.kind === "proposal" &&
      (d.price <= 0 ||
        !d.scope.trim() ||
        !d.exclusions.trim() ||
        !d.nextSteps.trim())
    )
      throw new ConvexError(
        "Set the proposal price, scope, exclusions and next steps before approval",
      );
    if (approve && (!d.subject.trim() || !d.body.trim()))
      throw new ConvexError("Subject and body are required");
    await ctx.db.patch(id, {
      status: approve ? "approved" : "rejected",
      approvedRevision: approve ? d.revision : undefined,
      approvedBy: approve ? owner._id : undefined,
      approvedAt: approve ? Date.now() : undefined,
      updatedAt: Date.now(),
    });
    await audit(
      ctx,
      approve ? "draft.approved" : "draft.rejected",
      `Revision ${d.revision}${d.kind === "proposal" ? `; price ${d.price} ${d.currency}` : ""}`,
      d.leadId,
    );
    return null;
  },
});
async function check(ctx: MutationCtx, d: Doc<"drafts">) {
  const lead = await ctx.db.get(d.leadId);
  if (!lead) throw new ConvexError("Lead not found");
  const s = await settings(ctx);
  const suppressed =
    lead.suppressed ||
    !!(
      lead.email &&
      (await ctx.db
        .query("suppressions")
        .withIndex("by_email", (q) => q.eq("email", lead.email))
        .unique())
    );
  const blocked = sendBlock({
    paused: s.paused,
    approved:
      !!d.approvedBy &&
      d.approvedRevision === d.revision &&
      ["approved", "queued"].includes(d.status),
    suppressed,
    eligibility: lead.eligibility,
    provider: d.provider,
    configured:
      d.provider === "resend"
        ? !!process.env.RESEND_API_KEY
        : !!(
            s.prospectingProvider &&
            process.env.PROSPECTING_API_URL &&
            process.env.PROSPECTING_API_KEY
          ),
    authorized: s.prospectingAuthorized,
    replied: !!lead.repliedAt,
    followup: d.kind === "followup",
  });
  if (blocked) throw new ConvexError(blocked);
  if (!lead.email) throw new ConvexError("No verified recipient email");
  if (!sendingWindow(Date.now(), s.timezone, s.sendStart, s.sendEnd))
    throw new ConvexError("Outside configured sending hours");
  return { lead, s };
}
export async function queueApproved(
  ctx: MutationCtx,
  id: import("./_generated/dataModel").Id<"drafts">,
) {
  const d = await ctx.db.get(id);
  if (!d) throw new ConvexError("Draft not found");
  const key = `crm/${d._id}/${d.revision}`;
  const existing = await ctx.db
    .query("sendIntents")
    .withIndex("by_key", (q) => q.eq("key", key))
    .unique();
  if (existing) {
    if (existing.state === "cancelled" || existing.state === "failed")
      throw new ConvexError("Save a new revision for a new send intent");
    return existing._id;
  }
  await check(ctx, d);
  const intent = await ctx.db.insert("sendIntents", {
    draftId: id,
    leadId: d.leadId,
    revision: d.revision,
    key,
    state: "queued",
    provider: d.provider,
    providerId: "",
    error: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  await ctx.db.patch(id, { status: "queued" });
  await pool.enqueueAction(
    ctx,
    internal.email.send,
    { intentId: intent },
    { retry: false },
  );
  await audit(ctx, "send.queued", key, d.leadId);
  return intent;
}
export const queueSend = mutation({
  args: { id: v.id("drafts") },
  returns: v.id("sendIntents"),
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    return queueApproved(ctx, id);
  },
});
export const claim = internalMutation({
  args: { intentId: v.id("sendIntents") },
  returns: v.union(
    v.object({
      draft: draftDoc,
      lead: leadDoc,
      key: v.string(),
      settings: v.object(settingsFields),
    }),
    v.null(),
  ),
  handler: async (ctx, { intentId }) => {
    const intent = await ctx.db.get(intentId);
    if (!intent || intent.state !== "queued") return null;
    const draft = await ctx.db.get(intent.draftId);
    try {
      if (!draft || draft.revision !== intent.revision)
        throw new ConvexError("Draft revision changed");
      const { lead, s } = await check(ctx, draft);
      const {
        _id: ignored,
        _creationTime: ignored2,
        ...clean
      } = s as typeof s & { _id?: string; _creationTime?: number };
      void ignored;
      void ignored2;
      await ctx.db.patch(intentId, { state: "sending", updatedAt: Date.now() });
      return { draft, lead, key: intent.key, settings: clean };
    } catch (error) {
      await ctx.db.patch(intentId, {
        state: "cancelled",
        error:
          error instanceof Error ? error.message : "Permission recheck failed",
        updatedAt: Date.now(),
      });
      if (draft) await ctx.db.patch(draft._id, { status: "cancelled" });
      return null;
    }
  },
});
export const result = internalMutation({
  args: {
    intentId: v.id("sendIntents"),
    state: v.union(
      v.literal("sent"),
      v.literal("failed"),
      v.literal("uncertain"),
    ),
    providerId: v.string(),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { intentId, state, providerId, error }) => {
    const intent = await ctx.db.get(intentId);
    if (!intent || intent.state === "sent") return null;
    const d = await ctx.db.get(intent.draftId),
      lead = await ctx.db.get(intent.leadId);
    await ctx.db.patch(intentId, {
      state,
      providerId,
      error,
      updatedAt: Date.now(),
    });
    if (state === "sent" && d && lead) {
      await ctx.db.patch(d._id, { status: "sent" });
      const prior = await ctx.db
        .query("messages")
        .withIndex("by_provider_and_providerId", (q) =>
          q.eq("provider", d.provider).eq("providerId", providerId),
        )
        .unique();
      const messageId = prior
        ? prior._id
        : await ctx.db.insert("messages", {
            leadId: lead._id,
            direction: "outbound",
            subject: d.subject,
            body: [
              d.body,
              ...(d.kind === "proposal"
                ? [
                    `Scope: ${d.scope}`,
                    `Price: ${d.price} ${d.currency}`,
                    `Exclusions: ${d.exclusions}`,
                    `Next steps: ${d.nextSteps}`,
                  ]
                : []),
            ].join("\n\n"),
            from: process.env.CRM_FROM_EMAIL ?? "mail@muizrexhepi.com",
            to: lead.email,
            provider: d.provider,
            providerId,
            threadId: `lead:${lead._id}`,
            internetMessageId: "",
            inReplyTo: "",
            classification: d.kind,
            summary: d.subject,
            receivedAt: Date.now(),
            delivery: "sent",
          });
      for (const event of await ctx.db
        .query("events")
        .withIndex("by_providerMessageId", (q) =>
          q.eq("providerMessageId", providerId),
        )
        .take(25)) {
        const message = await ctx.db.get(messageId);
        if (message) await applyDelivery(ctx, message, event.kind);
      }
      const freshLead = await ctx.db.get(lead._id);
      if (["new", "researching", "qualified"].includes(lead.stage))
        await ctx.db.patch(lead._id, {
          stage: "contacted",
          nextAction: "Wait for reply",
          updatedAt: Date.now(),
        });
      const s = await settings(ctx);
      const history = await ctx.db
        .query("tasks")
        .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
        .take(200);
      const attempt = Math.max(
        0,
        ...history.filter((t) => t.kind === "followup").map((t) => t.attempt),
      );
      if (
        !freshLead?.repliedAt &&
        !freshLead?.suppressed &&
        attempt < s.maxFollowups
      )
        await ctx.db.insert("tasks", {
          leadId: lead._id,
          title: "Review follow-up",
          dueAt: Date.now() + s.followupDays * 86400000,
          done: false,
          cancelled: false,
          kind: "followup",
          attempt: attempt + 1,
          createdAt: Date.now(),
        });
    } else if (state === "failed" && d) {
      await ctx.db.patch(d._id, {
        status: "draft",
        revision: d.revision + 1,
        approvedBy: undefined,
        approvedRevision: undefined,
        approvedAt: undefined,
        updatedAt: Date.now(),
      });
      await notify(
        ctx,
        "Send was not delivered",
        "Review and approve the new draft revision before retrying.",
        "/crm/inbox",
        "failure",
      );
    } else if (state !== "sent")
      await notify(
        ctx,
        "Send needs reconciliation",
        error || "Check the provider before retrying.",
        "/crm/automation",
        "failure",
      );
    await audit(
      ctx,
      `send.${state}`,
      error || providerId,
      intent.leadId,
      "system",
    );
    return null;
  },
});
export const cancel = mutation({
  args: { leadId: v.id("leads") },
  returns: v.null(),
  handler: async (ctx, { leadId }) => {
    await requireOwner(ctx);
    await cancelFollowups(ctx, leadId);
    await audit(ctx, "followups.cancelled", "Manual cancellation", leadId);
    return null;
  },
});
export const reconcile = mutation({
  args: {
    id: v.id("sendIntents"),
    outcome: v.union(v.literal("not_sent"), v.literal("sent")),
    providerId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, { id, outcome, providerId }) => {
    await requireOwner(ctx);
    const intent = await ctx.db.get(id);
    if (!intent || !["uncertain", "sending"].includes(intent.state))
      throw new ConvexError("Only uncertain sends can be reconciled");
    if (outcome === "sent" && !providerId.trim())
      throw new ConvexError("Provider message identifier required");
    await ctx.scheduler.runAfter(0, internal.outbound.result, {
      intentId: id,
      state: outcome === "sent" ? "sent" : "failed",
      providerId,
      error: outcome === "sent" ? "" : "Owner verified provider did not send",
    });
    await audit(ctx, "send.reconciled", outcome, intent.leadId);
    return null;
  },
});
export const pending = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("sendIntents"),
      providerId: v.string(),
      provider: v.string(),
    }),
  ),
  handler: async (ctx) =>
    (
      await ctx.db
        .query("sendIntents")
        .withIndex("by_state", (q) => q.eq("state", "uncertain"))
        .take(25)
    ).map((x) => ({
      id: x._id,
      providerId: x.providerId,
      provider: x.provider,
    })),
});
export const sendHistory = importedQuery({
  args: {},
  returns: v.array(
    v.object({
      id: v.id("sendIntents"),
      draftId: v.id("drafts"),
      leadId: v.id("leads"),
      state: v.string(),
      provider: v.string(),
      providerId: v.string(),
      error: v.string(),
      createdAt: v.number(),
    }),
  ),
  handler: async (ctx) => {
    await requireOwner(ctx);
    return (await ctx.db.query("sendIntents").order("desc").take(100)).map(
      (x) => ({
        id: x._id,
        draftId: x.draftId,
        leadId: x.leadId,
        state: x.state,
        provider: x.provider,
        providerId: x.providerId,
        error: x.error,
        createdAt: x.createdAt,
      }),
    );
  },
});
