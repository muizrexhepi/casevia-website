import { applyDelivery } from "./delivery";
import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";
import { recordReply } from "./crm";
import { cancelFollowups, notify, audit } from "./helpers";
import { requireOwner } from "./users";
export const status = query({
  args: {},
  returns: v.array(
    v.object({
      key: v.string(),
      lastSuccess: v.optional(v.number()),
      error: v.string(),
    }),
  ),
  handler: async (ctx) => {
    await requireOwner(ctx);
    return (await ctx.db.query("integrationState").take(10)).map(
      ({ key, lastSuccess, error }) => ({
        key,
        ...(lastSuccess ? { lastSuccess } : {}),
        error,
      }),
    );
  },
});
export const cursor = internalQuery({
  args: { key: v.string() },
  returns: v.union(
    v.object({ cursor: v.string(), lastSuccess: v.optional(v.number()) }),
    v.null(),
  ),
  handler: async (ctx, { key }) => {
    const s = await ctx.db
      .query("integrationState")
      .withIndex("by_key", (q) => q.eq("key", key))
      .unique();
    return s
      ? {
          cursor: s.cursor,
          ...(s.lastSuccess ? { lastSuccess: s.lastSuccess } : {}),
        }
      : null;
  },
});
export const checkpoint = internalMutation({
  args: {
    key: v.string(),
    cursor: v.string(),
    error: v.string(),
    completed: v.optional(v.boolean()),
    leaseToken: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const prior = await ctx.db
      .query("integrationState")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    if (args.leaseToken && prior?.leaseToken !== args.leaseToken) return null;
    const values = {
      key: args.key,
      cursor: args.cursor,
      error: args.error,
      ...(args.leaseToken
        ? { leaseToken: undefined, leaseUntil: undefined }
        : {}),
      ...(!args.error && args.completed !== false
        ? { lastSuccess: Date.now() }
        : {}),
    };
    if (prior) await ctx.db.patch(prior._id, values);
    else await ctx.db.insert("integrationState", values);
    return null;
  },
});
export const acquireZoho = internalMutation({
  args: { token: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { token }) => {
    const prior = await ctx.db
      .query("integrationState")
      .withIndex("by_key", (q) => q.eq("key", "zoho"))
      .unique();
    if (prior?.leaseUntil && prior.leaseUntil > Date.now()) return false;
    const lease = { leaseToken: token, leaseUntil: Date.now() + 9 * 60000 };
    if (prior) await ctx.db.patch(prior._id, lease);
    else
      await ctx.db.insert("integrationState", {
        key: "zoho",
        cursor: "1",
        error: "",
        ...lease,
      });
    return true;
  },
});
export const knownSender = internalQuery({
  args: { email: v.string() },
  returns: v.boolean(),
  handler: async (ctx, { email }) => {
    const key = email
      .trim()
      .toLowerCase()
      .replace(/^.*</, "")
      .replace(/>.*$/, "");
    return !!(await ctx.db
      .query("contacts")
      .withIndex("by_email", (q) => q.eq("email", key))
      .first());
  },
});
export const ingestReply = internalMutation({
  args: {
    email: v.string(),
    body: v.string(),
    subject: v.string(),
    providerId: v.string(),
    threadId: v.string(),
    internetMessageId: v.string(),
    inReplyTo: v.string(),
    receivedAt: v.number(),
  },
  returns: v.boolean(),
  handler: async (ctx, { email, ...args }) => {
    const key = email
      .trim()
      .toLowerCase()
      .replace(/^.*</, "")
      .replace(/>.*$/, "");
    const contact = await ctx.db
      .query("contacts")
      .withIndex("by_email", (q) => q.eq("email", key))
      .unique();
    if (!contact) return false;
    await recordReply(ctx, {
      ...args,
      from: key,
      leadId: contact.leadId,
      provider: "zoho",
    });
    return true;
  },
});
export const applyClassification = internalMutation({
  args: {
    leadId: v.id("leads"),
    classification: v.string(),
    summary: v.string(),
    nextAction: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const lead = await ctx.db.get(args.leadId);
    if (!lead) return null;
    const latest = (
      await ctx.db
        .query("messages")
        .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
        .order("desc")
        .take(20)
    ).find((m) => m.direction === "inbound");
    if (latest)
      await ctx.db.patch(latest._id, {
        classification: args.classification,
        summary: args.summary,
      });
    await ctx.db.patch(lead._id, {
      nextAction: args.nextAction,
      updatedAt: Date.now(),
    });
    if (args.classification === "opt_out") {
      await ctx.db.patch(lead._id, {
        suppressed: true,
        eligibility: "suppressed",
      });
      await cancelFollowups(ctx, lead._id);
      if (
        lead.email &&
        !(await ctx.db
          .query("suppressions")
          .withIndex("by_email", (q) => q.eq("email", lead.email))
          .unique())
      )
        await ctx.db.insert("suppressions", {
          email: lead.email,
          reason: "AI-identified opt-out: owner can review original reply",
          createdAt: Date.now(),
        });
    }
    return null;
  },
});
export const deliveryEvent = internalMutation({
  args: {
    eventId: v.string(),
    type: v.string(),
    messageId: v.string(),
    timestamp: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const key = `resend:${args.eventId}`;
    if (
      await ctx.db
        .query("events")
        .withIndex("by_key", (q) => q.eq("key", key))
        .unique()
    )
      return null;
    await ctx.db.insert("events", {
      key,
      kind: args.type,
      providerMessageId: args.messageId,
      timestamp: args.timestamp,
      createdAt: Date.now(),
    });
    const message = await ctx.db
      .query("messages")
      .withIndex("by_provider_and_providerId", (q) =>
        q.eq("provider", "resend").eq("providerId", args.messageId),
      )
      .unique();
    if (message) await applyDelivery(ctx, message, args.type);
    await audit(ctx, "webhook.processed", args.type, message?.leadId, "resend");
    return null;
  },
});
export const recovery = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const cutoff = Date.now() - 15 * 60000;
    for (const job of await ctx.db
      .query("jobs")
      .withIndex("by_state", (q) => q.eq("state", "running"))
      .take(30)) {
      if (job.createdAt < cutoff) {
        await ctx.db.patch(job._id, {
          state: "uncertain",
          error:
            "Worker interrupted. Reconcile provider usage before retrying.",
          finishedAt: Date.now(),
        });
        if (job.usageId)
          await ctx.db.patch(job.usageId, { status: "uncertain" });
        await notify(
          ctx,
          "Interrupted AI job",
          "Its spending reservation remains held.",
          "/crm/automation",
          "failure",
        );
      }
    }
    for (const intent of await ctx.db
      .query("sendIntents")
      .withIndex("by_state", (q) => q.eq("state", "sending"))
      .take(30)) {
      if (intent.updatedAt < cutoff) {
        await ctx.db.patch(intent._id, {
          state: "uncertain",
          error:
            "Interrupted send. Reconcile provider history before retrying.",
          updatedAt: Date.now(),
        });
        await notify(
          ctx,
          "Interrupted send",
          "Delivery must be checked before retrying.",
          "/crm/automation",
          "failure",
        );
      }
    }
    return null;
  },
});
