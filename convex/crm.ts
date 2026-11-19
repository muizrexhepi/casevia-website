import { v, ConvexError } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query, mutation, internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { requireOwner } from "./users";
import { settings, audit, notify, cancelFollowups } from "./helpers";
import { defaultSettings } from "./defaults";
import {
  stage,
  eligibility,
  language,
  leadDoc,
  draftDoc,
  messageDoc,
  jobDoc,
  settingsDoc,
  settingsFields,
  notificationDoc,
  activityDoc,
  taskDoc,
  usageDoc,
} from "./validators";
import {
  domainKey,
  businessKey,
  emailKey,
  classifyReply,
} from "../lib/crm/policy";
const leadInput = {
  name: v.string(),
  website: v.string(),
  location: v.string(),
  industry: v.string(),
  email: v.string(),
  contactName: v.string(),
  language,
  notes: v.string(),
};
export const snapshot = query({
  args: { month: v.string() },
  returns: v.object({
    leads: v.array(leadDoc),
    drafts: v.array(draftDoc),
    messages: v.array(messageDoc),
    jobs: v.array(jobDoc),
    settings: v.union(settingsDoc, v.object(settingsFields)),
    notifications: v.array(notificationDoc),
    activity: v.array(activityDoc),
    tasks: v.array(taskDoc),
    usage: v.array(usageDoc),
    integrations: v.object({
      openai: v.boolean(),
      github: v.boolean(),
      resend: v.boolean(),
      zoho: v.boolean(),
      push: v.boolean(),
      prospecting: v.boolean(),
    }),
  }),
  handler: async (ctx, { month }) => {
    await requireOwner(ctx);
    return {
      leads: await ctx.db
        .query("leads")
        .withIndex("by_excluded", (q) => q.lt("excluded", true))
        .order("desc")
        .take(250),
      drafts: await ctx.db.query("drafts").order("desc").take(150),
      messages: await ctx.db.query("messages").order("desc").take(150),
      jobs: await ctx.db.query("jobs").order("desc").take(100),
      settings: await settings(ctx),
      notifications: await ctx.db.query("notifications").order("desc").take(40),
      activity: await ctx.db.query("activity").order("desc").take(60),
      tasks: await ctx.db
        .query("tasks")
        .withIndex("by_done_and_dueAt", (q) => q.eq("done", false))
        .take(100),
      usage: await ctx.db
        .query("usage")
        .withIndex("by_month", (q) => q.eq("month", month))
        .take(1000),
      integrations: {
        openai: !!process.env.OPENAI_API_KEY,
        github:
          !!process.env.AUTH_GITHUB_SECRET &&
          process.env.AUTH_GITHUB_SECRET !== "disconnected",
        resend: !!process.env.RESEND_API_KEY,
        zoho: !!(
          process.env.ZOHO_REFRESH_TOKEN &&
          process.env.ZOHO_CLIENT_ID &&
          process.env.ZOHO_CLIENT_SECRET &&
          process.env.ZOHO_ACCOUNT_ID
        ),
        push: !!process.env.VAPID_PRIVATE_KEY,
        prospecting: !!(
          process.env.PROSPECTING_API_URL && process.env.PROSPECTING_API_KEY
        ),
      },
    };
  },
});
export const listLeads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    stage: v.optional(stage),
    includeExcluded: v.optional(v.boolean()),
  },
  returns: v.object({
    page: v.array(leadDoc),
    isDone: v.boolean(),
    continueCursor: v.string(),
    splitCursor: v.optional(v.union(v.string(), v.null())),
    pageStatus: v.optional(
      v.union(
        v.literal("SplitRecommended"),
        v.literal("SplitRequired"),
        v.null(),
      ),
    ),
  }),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    if (args.search?.trim())
      return ctx.db
        .query("leads")
        .withSearchIndex("search_name", (q) => {
          let search = q.search("name", args.search!.slice(0, 100));
          if (args.stage) search = search.eq("stage", args.stage);
          if (!args.includeExcluded) search = search.eq("excluded", undefined);
          return search;
        })
        .paginate(args.paginationOpts);
    if (args.stage)
      return ctx.db
        .query("leads")
        .withIndex("by_stage_and_excluded", (q) =>
          args.includeExcluded
            ? q.eq("stage", args.stage!)
            : q.eq("stage", args.stage!).lt("excluded", true),
        )
        .order("desc")
        .paginate(args.paginationOpts);
    if (args.includeExcluded)
      return ctx.db.query("leads").order("desc").paginate(args.paginationOpts);
    return ctx.db
      .query("leads")
      .withIndex("by_excluded", (q) => q.lt("excluded", true))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
export const detail = query({
  args: { id: v.id("leads") },
  returns: v.object({
    lead: leadDoc,
    drafts: v.array(draftDoc),
    messages: v.array(messageDoc),
    tasks: v.array(taskDoc),
    activity: v.array(activityDoc),
  }),
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    const lead = await ctx.db.get(id);
    if (!lead) throw new ConvexError("Lead not found");
    return {
      lead,
      drafts: await ctx.db
        .query("drafts")
        .withIndex("by_leadId", (q) => q.eq("leadId", id))
        .order("desc")
        .take(100),
      messages: await ctx.db
        .query("messages")
        .withIndex("by_leadId", (q) => q.eq("leadId", id))
        .order("desc")
        .take(100),
      tasks: await ctx.db
        .query("tasks")
        .withIndex("by_leadId", (q) => q.eq("leadId", id))
        .take(100),
      activity: await ctx.db
        .query("activity")
        .withIndex("by_leadId", (q) => q.eq("leadId", id))
        .order("desc")
        .take(80),
    };
  },
});
type LeadInput = {
  name: string;
  website: string;
  location: string;
  industry: string;
  email: string;
  contactName: string;
  language: "en" | "sq" | "mk" | "de";
  notes: string;
};
export async function upsertLead(
  ctx: MutationCtx,
  input: LeadInput,
  origin: "manual" | "csv" | "website" | "discovery",
  sourceUrl = "",
) {
  const name = input.name.trim().slice(0, 200),
    email = emailKey(input.email),
    domain = domainKey(input.website),
    key = businessKey(name, input.location);
  if (!name) throw new ConvexError("Business name is required");
  if (email && !/^[^\s@,<>;]+@[^\s@,<>;]+\.[^\s@,<>;]+$/.test(email))
    throw new ConvexError("Invalid email");
  const contact = email
    ? await ctx.db
        .query("contacts")
        .withIndex("by_email", (q) => q.eq("email", email))
        .unique()
    : null;
  const existing =
    (domain
      ? await ctx.db
          .query("leads")
          .withIndex("by_domain", (q) => q.eq("domain", domain))
          .first()
      : null) ??
    (contact ? await ctx.db.get(contact.leadId) : null) ??
    (await ctx.db
      .query("leads")
      .withIndex("by_businessKey", (q) => q.eq("businessKey", key))
      .first());
  if (existing) return { id: existing._id, created: false };
  const suppressed = !!(
    email &&
    (await ctx.db
      .query("suppressions")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique())
  );
  const now = Date.now();
  const id = await ctx.db.insert("leads", {
    name,
    domain,
    businessKey: key,
    website: domain
      ? new URL(
          input.website.includes("://")
            ? input.website
            : `https://${input.website}`,
        ).href
      : "",
    location: input.location.slice(0, 200),
    industry: input.industry.slice(0, 120),
    email,
    contactName: input.contactName.slice(0, 120),
    language: input.language,
    origin,
    stage: "new",
    eligibility: suppressed
      ? "suppressed"
      : origin === "website"
        ? "requested"
        : "unknown",
    permissionEvidence:
      origin === "website"
        ? "Recipient submitted the portfolio contact form requesting a project conversation."
        : "",
    suppressed,
    sources: sourceUrl
      ? [
          {
            url: sourceUrl,
            title: "Discovery source",
            verified: false,
            excerpt: "Unverified discovery result",
            checkedAt: now,
          },
        ]
      : [],
    observations: [],
    score: 0,
    scoreReasons: [],
    suggestedService: "",
    nextAction:
      origin === "website" ? "Respond to project inquiry" : "Research business",
    notes: input.notes.slice(0, 12000),
    dealValue: 0,
    currency: "EUR",
    collectedRevenue: 0,
    outcomeReason: "",
    createdAt: now,
    updatedAt: now,
  });
  if (email)
    await ctx.db.insert("contacts", {
      email,
      leadId: id,
      name: input.contactName,
      verified: origin === "website",
      sourceUrl,
    });
  await audit(
    ctx,
    "lead.created",
    `${name} · ${origin}`,
    id,
    origin === "manual" ? "owner" : "system",
  );
  return { id, created: true };
}
export const createLead = mutation({
  args: leadInput,
  returns: v.object({ id: v.id("leads"), created: v.boolean() }),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    return upsertLead(ctx, args, "manual");
  },
});
export const importLeads = mutation({
  args: { rows: v.array(v.object(leadInput)) },
  returns: v.object({ created: v.number(), duplicates: v.number() }),
  handler: async (ctx, { rows }) => {
    await requireOwner(ctx);
    if (rows.length > 100)
      throw new ConvexError("Import up to 100 rows at a time");
    let created = 0;
    for (const row of rows)
      if ((await upsertLead(ctx, row, "csv")).created) created++;
    await audit(
      ctx,
      "leads.imported",
      `${created} created, ${rows.length - created} duplicates`,
    );
    return { created, duplicates: rows.length - created };
  },
});
export const updateLead = mutation({
  args: {
    id: v.id("leads"),
    stage: v.optional(stage),
    notes: v.optional(v.string()),
    nextAction: v.optional(v.string()),
    eligibility: v.optional(eligibility),
    permissionEvidence: v.optional(v.string()),
    dealValue: v.optional(v.number()),
    currency: v.optional(
      v.union(v.literal("EUR"), v.literal("CHF"), v.literal("MKD")),
    ),
    collectedRevenue: v.optional(v.number()),
    outcomeReason: v.optional(v.string()),
    language: v.optional(language),
  },
  returns: v.null(),
  handler: async (ctx, { id, ...patch }) => {
    await requireOwner(ctx);
    const lead = await ctx.db.get(id);
    if (!lead) throw new ConvexError("Lead not found");
    if (
      patch.eligibility &&
      !["unknown", "suppressed"].includes(patch.eligibility) &&
      !(patch.permissionEvidence ?? lead.permissionEvidence).trim()
    )
      throw new ConvexError("Record the permission basis and evidence first");
    if (
      ["won", "lost"].includes(patch.stage ?? "") &&
      !(patch.outcomeReason ?? lead.outcomeReason).trim()
    )
      throw new ConvexError("Record the evidence of a won deal");
    for (const value of [patch.dealValue, patch.collectedRevenue])
      if (value !== undefined && (!Number.isFinite(value) || value < 0))
        throw new ConvexError("Amounts must be nonnegative");
    const clean = Object.fromEntries(
      Object.entries(patch).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, {
      ...clean,
      ...(["requested", "opted_in"].includes(patch.eligibility ?? "")
        ? { excluded: undefined }
        : {}),
      updatedAt: Date.now(),
    });
    await audit(ctx, "lead.updated", Object.keys(clean).join(", "), id);
    return null;
  },
});
export const suppress = mutation({
  args: { id: v.id("leads"), reason: v.string() },
  returns: v.null(),
  handler: async (ctx, { id, reason }) => {
    await requireOwner(ctx);
    const lead = await ctx.db.get(id);
    if (!lead) throw new ConvexError("Lead not found");
    if (
      lead.email &&
      !(await ctx.db
        .query("suppressions")
        .withIndex("by_email", (q) => q.eq("email", lead.email))
        .unique())
    )
      await ctx.db.insert("suppressions", {
        email: lead.email,
        reason: reason.slice(0, 300),
        createdAt: Date.now(),
      });
    await ctx.db.patch(id, {
      suppressed: true,
      eligibility: "suppressed",
      nextAction: "Do not contact",
      updatedAt: Date.now(),
    });
    await cancelFollowups(ctx, id);
    await audit(ctx, "lead.suppressed", reason, id);
    return null;
  },
});
export const saveSettings = mutation({
  args: { settings: v.object(settingsFields) },
  returns: v.null(),
  handler: async (ctx, { settings: s }) => {
    await requireOwner(ctx);
    if (s.model === "gpt-6.2-astra")
      throw new ConvexError(
        "Astra is disabled for this CRM. Choose Luna or Sol.",
      );
    if (
      s.dailyLimit < 0 ||
      s.monthlyLimit < 0 ||
      s.dailyLimit > s.monthlyLimit ||
      s.dailyLimit > 1000 ||
      s.monthlyLimit > 10000
    )
      throw new ConvexError("Invalid spending limits");
    if (
      !Number.isInteger(s.dailyVolume) ||
      s.dailyVolume < 1 ||
      s.dailyVolume > 50 ||
      s.followupDays < 1 ||
      s.maxFollowups < 0 ||
      s.maxFollowups > 5 ||
      s.sendStart < 0 ||
      s.sendEnd > 24 ||
      s.sendStart >= s.sendEnd ||
      s.discoveryHour < 0 ||
      s.discoveryHour > 23 ||
      s.qualificationThreshold < 0 ||
      s.qualificationThreshold > 100
    )
      throw new ConvexError("Invalid automation limits");
    try {
      new Intl.DateTimeFormat("en", { timeZone: s.timezone }).format();
    } catch {
      throw new ConvexError("Invalid timezone");
    }
    if (s.services.length + s.projects.length + s.pricing.length > 20000)
      throw new ConvexError("Sales knowledge is too long");
    if ((s.targetProfile?.length ?? 0) > 3000)
      throw new ConvexError("Target profile must be at most 3000 characters");
    const current = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "owner"))
      .unique();
    const values = {
      ...s,
      lastDiscoveryDay: current?.lastDiscoveryDay ?? "",
      lastDigestDay: current?.lastDigestDay ?? "",
    };
    if (current) await ctx.db.patch(current._id, values);
    else await ctx.db.insert("settings", values);
    await audit(
      ctx,
      "settings.saved",
      `Outbound ${s.paused ? "paused" : "enabled"}; AI limits $${s.dailyLimit}/day, $${s.monthlyLimit}/month`,
    );
    return null;
  },
});
export const pause = mutation({
  args: { paused: v.boolean() },
  returns: v.null(),
  handler: async (ctx, { paused }) => {
    await requireOwner(ctx);
    const s = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "owner"))
      .unique();
    if (s) await ctx.db.patch(s._id, { paused });
    else await ctx.db.insert("settings", { ...defaultSettings, paused });
    await audit(ctx, "outbound.pause", String(paused));
    return null;
  },
});
export const saveTask = mutation({
  args: {
    leadId: v.id("leads"),
    title: v.string(),
    dueAt: v.number(),
    kind: v.union(
      v.literal("task"),
      v.literal("meeting"),
      v.literal("followup"),
    ),
  },
  returns: v.id("tasks"),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    if (
      !(await ctx.db.get(args.leadId)) ||
      !args.title.trim() ||
      !Number.isFinite(args.dueAt)
    )
      throw new ConvexError("Invalid task");
    return ctx.db.insert("tasks", {
      ...args,
      title: args.title.slice(0, 300),
      done: false,
      cancelled: false,
      attempt: 0,
      createdAt: Date.now(),
    });
  },
});
export const completeTask = mutation({
  args: { id: v.id("tasks") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    await ctx.db.patch(id, { done: true, cancelled: true });
    return null;
  },
});
export const markNotification = mutation({
  args: { id: v.id("notifications") },
  returns: v.null(),
  handler: async (ctx, { id }) => {
    await requireOwner(ctx);
    await ctx.db.patch(id, { read: true });
    return null;
  },
});
export async function recordReply(
  ctx: MutationCtx,
  input: {
    leadId: import("./_generated/dataModel").Id<"leads">;
    body: string;
    subject: string;
    provider: string;
    providerId: string;
    threadId: string;
    internetMessageId: string;
    inReplyTo: string;
    receivedAt: number;
    from?: string;
  },
) {
  const prior = await ctx.db
    .query("messages")
    .withIndex("by_provider_and_providerId", (q) =>
      q.eq("provider", input.provider).eq("providerId", input.providerId),
    )
    .unique();
  if (prior) return prior._id;
  const lead = await ctx.db.get(input.leadId);
  if (!lead) throw new ConvexError("Lead not found");
  const classification = classifyReply(input.body);
  const id = await ctx.db.insert("messages", {
    ...input,
    direction: "inbound",
    from: input.from ?? lead.email,
    to: "mail@muizrexhepi.com",
    classification,
    summary: input.body.slice(0, 300),
    delivery: "received",
  });
  await ctx.db.patch(lead._id, {
    repliedAt: Date.now(),
    stage:
      classification === "meeting"
        ? "meeting"
        : classification === "interested"
          ? "interested"
          : lead.stage,
    nextAction:
      classification === "opt_out"
        ? "Do not contact"
        : classification === "reply"
          ? "Review reply"
          : `Review ${classification} reply`,
    updatedAt: Date.now(),
  });
  await cancelFollowups(ctx, lead._id);
  if (classification === "opt_out") {
    await ctx.db.patch(lead._id, {
      suppressed: true,
      eligibility: "suppressed",
    });
    if (
      lead.email &&
      !(await ctx.db
        .query("suppressions")
        .withIndex("by_email", (q) => q.eq("email", lead.email))
        .unique())
    )
      await ctx.db.insert("suppressions", {
        email: lead.email,
        reason: "Reply opt-out",
        createdAt: Date.now(),
      });
  }
  await audit(ctx, "reply.received", classification, lead._id, "system");
  await notify(
    ctx,
    `${lead.name}: ${classification}`,
    "Review the conversation and next action.",
    `/crm/leads?id=${lead._id}`,
    "reply",
  );
  return id;
}
export const logReply = mutation({
  args: {
    leadId: v.id("leads"),
    body: v.string(),
    subject: v.string(),
    providerId: v.string(),
  },
  returns: v.id("messages"),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    if (args.body.length > 20000) throw new ConvexError("Reply too long");
    return recordReply(ctx, {
      ...args,
      provider: "manual",
      threadId: "",
      internetMessageId: "",
      inReplyTo: "",
      receivedAt: Date.now(),
    });
  },
});
export const captureInquiry = internalMutation({
  args: {
    key: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.string(),
    projectType: v.string(),
    budget: v.string(),
    message: v.string(),
  },
  returns: v.id("leads"),
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    const existing = await ctx.db
      .query("leads")
      .withIndex("by_email", (q) => q.eq("email", emailKey(args.email)))
      .first();
    if (event && existing) return existing._id;
    const result = await upsertLead(
      ctx,
      {
        name: args.company || args.name,
        website: "",
        location: "",
        industry: args.projectType,
        email: args.email,
        contactName: args.name,
        language: "en",
        notes: `Inquiry budget (unverified): ${args.budget}\n${args.message}`,
      },
      "website",
    );
    await recordReply(ctx, {
      leadId: result.id,
      body: args.message,
      subject: `Project inquiry: ${args.projectType}`,
      provider: "website",
      providerId: args.key,
      threadId: args.key,
      internetMessageId: "",
      inReplyTo: "",
      receivedAt: Date.now(),
    });
    const lead = await ctx.db.get(result.id);
    if (lead && !lead.suppressed)
      await ctx.db.patch(result.id, {
        eligibility: "requested",
        excluded: undefined,
        permissionEvidence:
          "Project inquiry submitted through the portfolio contact form. Permission applies to this project conversation.",
      });
    if (!event)
      await ctx.db.insert("events", {
        key: args.key,
        kind: "website.inquiry",
        createdAt: Date.now(),
      });
    return result.id;
  },
});
export const owner = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    await requireOwner(ctx);
    return true;
  },
});
export const editBusiness = mutation({
  args: { id: v.id("leads"), ...leadInput },
  returns: v.null(),
  handler: async (ctx, { id, ...input }) => {
    await requireOwner(ctx);
    const lead = await ctx.db.get(id);
    if (!lead) throw new ConvexError("Lead not found");
    const domain = domainKey(input.website),
      email = emailKey(input.email);
    if (
      !input.name.trim() ||
      (email && !/^[^\s@,<>;]+@[^\s@,<>;]+\.[^\s@,<>;]+$/.test(email))
    )
      throw new ConvexError("Enter a name and valid email");
    const duplicate = domain
      ? await ctx.db
          .query("leads")
          .withIndex("by_domain", (q) => q.eq("domain", domain))
          .first()
      : null;
    const contact = email
      ? await ctx.db
          .query("contacts")
          .withIndex("by_email", (q) => q.eq("email", email))
          .unique()
      : null;
    if (
      (duplicate && duplicate._id !== id) ||
      (contact && contact.leadId !== id)
    )
      throw new ConvexError(
        "This business or contact already belongs to another lead",
      );
    const changed = email !== lead.email,
      suppressed =
        lead.suppressed ||
        !!(
          email &&
          (await ctx.db
            .query("suppressions")
            .withIndex("by_email", (q) => q.eq("email", email))
            .unique())
        );
    await ctx.db.patch(id, {
      name: input.name.trim().slice(0, 200),
      website: domain
        ? new URL(
            input.website.includes("://")
              ? input.website
              : `https://${input.website}`,
          ).href
        : "",
      domain,
      email,
      contactName: input.contactName.slice(0, 120),
      location: input.location.slice(0, 200),
      industry: input.industry.slice(0, 120),
      language: input.language,
      notes: input.notes.slice(0, 12000),
      businessKey: businessKey(input.name, input.location),
      ...(domain !== lead.domain || input.name.trim() !== lead.name
        ? {
            targetFit: undefined,
            excluded: undefined,
            researchHash: undefined,
            researchAt: undefined,
            ...(["new", "researching", "qualified"].includes(lead.stage)
              ? { stage: "new" as const }
              : {}),
          }
        : {}),
      suppressed,
      ...(changed
        ? {
            eligibility: suppressed
              ? ("suppressed" as const)
              : ("unknown" as const),
            permissionEvidence: "",
          }
        : {}),
      updatedAt: Date.now(),
    });
    if (email && !contact)
      await ctx.db.insert("contacts", {
        email,
        leadId: id,
        name: input.contactName,
        verified: false,
        sourceUrl: "Owner-entered contact",
      });
    if (changed) {
      await cancelFollowups(ctx, id);
      for (const draft of await ctx.db
        .query("drafts")
        .withIndex("by_leadId", (q) => q.eq("leadId", id))
        .take(200)) {
        if (["draft", "approved", "rejected"].includes(draft.status))
          await ctx.db.patch(draft._id, {
            status: "draft",
            revision: draft.revision + 1,
            approvedBy: undefined,
            approvedRevision: undefined,
            approvedAt: undefined,
            updatedAt: Date.now(),
          });
      }
    }
    await audit(
      ctx,
      "lead.business_edited",
      changed
        ? "Recipient changed; permission and approvals reset"
        : "Business details updated",
      id,
    );
    return null;
  },
});
