import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { settings, notify, audit } from "./helpers";
import { scheduleJob } from "./jobs";
import { queueApproved } from "./outbound";
import { followupText } from "../lib/crm/followup";
export const tick = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const s = await settings(ctx),
      now = Date.now(),
      day = new Intl.DateTimeFormat("en-CA", {
        timeZone: s.timezone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(now),
      hour = Number(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: s.timezone,
          hour: "2-digit",
          hourCycle: "h23",
        }).format(now),
      );
    const persisted = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "owner"))
      .unique();
    if (
      s.autoDiscovery &&
      s.lastDiscoveryDay !== day &&
      hour >= s.discoveryHour &&
      process.env.OPENAI_API_KEY
    ) {
      try {
        await scheduleJob(ctx, {
          kind: "discovery",
          query: `${s.industries.join(", ")} in ${s.markets.join(", ")}`,
        });
        if (persisted)
          await ctx.db.patch(persisted._id, { lastDiscoveryDay: day });
      } catch (error) {
        if (persisted)
          await ctx.db.patch(persisted._id, { lastDiscoveryDay: day });
        await notify(
          ctx,
          "Discovery paused by controls",
          error instanceof Error
            ? error.message.slice(0, 200)
            : "Check spending limits",
          "/crm/automation",
          "budget",
        );
      }
    }
    if (s.autoSendApproved && !s.paused) {
      for (const draft of await ctx.db
        .query("drafts")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .take(10)) {
        try {
          await queueApproved(ctx, draft._id);
        } catch {
          /* Leave saved approvals available while channel/eligibility/hours are blocked. */
        }
      }
    }
    // One new stage transition per sweep keeps automatic work bounded.
    if (process.env.OPENAI_API_KEY && (s.autoResearch || s.autoDraft)) {
      const stage = s.autoResearch ? "new" : "qualified";
      const leads = await ctx.db
        .query("leads")
        .withIndex("by_stage", (q) => q.eq("stage", stage))
        .take(20);
      for (const lead of leads) {
        if (lead.suppressed) continue;
        const jobs = await ctx.db
          .query("jobs")
          .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
          .take(30);
        const kind = stage === "new" ? "research" : "draft";
        if (jobs.some((job) => job.kind === kind)) continue;
        try {
          await scheduleJob(ctx, { kind, leadId: lead._id });
        } catch {
          /* Budget/configuration will be checked again next sweep. */
        }
        break;
      }
      if (s.autoResearch && s.autoDraft) {
        const qualified = await ctx.db
          .query("leads")
          .withIndex("by_stage", (q) => q.eq("stage", "qualified"))
          .take(10);
        for (const lead of qualified) {
          if (lead.suppressed) continue;
          const drafts = await ctx.db
            .query("drafts")
            .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
            .take(1);
          const jobs = await ctx.db
            .query("jobs")
            .withIndex("by_leadId", (q) => q.eq("leadId", lead._id))
            .take(30);
          if (drafts.length || jobs.some((j) => j.kind === "draft")) continue;
          try {
            await scheduleJob(ctx, { kind: "draft", leadId: lead._id });
          } catch {
            /* Respect current app limits. */
          }
          break;
        }
      }
    }
    for (const task of await ctx.db
      .query("tasks")
      .withIndex("by_done_and_dueAt", (q) =>
        q.eq("done", false).lte("dueAt", now),
      )
      .take(30)) {
      if (task.cancelled) continue;
      const lead = await ctx.db.get(task.leadId);
      if (!lead) continue;
      if (
        task.kind === "followup" &&
        (lead.repliedAt ||
          lead.suppressed ||
          ["won", "lost"].includes(lead.stage))
      ) {
        await ctx.db.patch(task._id, { done: true, cancelled: true });
        continue;
      }
      await notify(
        ctx,
        task.kind === "meeting" ? "Meeting due" : "Next action due",
        `${lead.name}: ${task.title}`,
        `/crm/leads?id=${lead._id}`,
        "task",
      );
      await ctx.db.patch(task._id, { done: true });
      if (
        task.kind === "followup" &&
        s.autoEligibleFollowups &&
        ["requested", "opted_in", "prospecting_eligible"].includes(
          lead.eligibility,
        ) &&
        task.attempt <= s.maxFollowups
      ) {
        await ctx.db.insert("drafts", {
          leadId: lead._id,
          kind: "followup",
          ...followupText(lead.language, lead.contactName || lead.name),
          language: lead.language,
          provider:
            lead.eligibility === "prospecting_eligible"
              ? "prospecting"
              : "resend",
          revision: 1,
          status: "draft",
          price: 0,
          currency: lead.currency,
          scope: "",
          exclusions: "",
          nextSteps: "",
          createdAt: now,
          updatedAt: now,
        });
        await audit(
          ctx,
          "followup.drafted",
          "Owner approval required",
          lead._id,
          "system",
        );
      }
    }
    if (persisted && s.lastDigestDay !== day && hour >= 18) {
      await notify(
        ctx,
        "Your daily CRM summary",
        "Review pipeline activity, pending decisions and workflow health.",
        "/crm",
        "digest",
      );
      await ctx.db.patch(persisted._id, { lastDigestDay: day });
    }
    return null;
  },
});
