import type { MutationCtx, QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { defaultSettings } from "./defaults";
export async function settings(ctx: QueryCtx | MutationCtx) {
  return (
    (await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "owner"))
      .unique()) ?? defaultSettings
  );
}
export async function audit(
  ctx: MutationCtx,
  action: string,
  detail: string,
  leadId?: Id<"leads">,
  actor = "owner",
) {
  await ctx.db.insert("activity", {
    action,
    detail,
    ...(leadId ? { leadId } : {}),
    actor,
    createdAt: Date.now(),
  });
}
export async function notify(
  ctx: MutationCtx,
  title: string,
  body: string,
  href = "/crm",
  kind = "decision",
) {
  await ctx.db.insert("notifications", {
    title,
    body,
    href,
    kind,
    read: false,
    createdAt: Date.now(),
    delivered: false,
  });
}
export async function cancelFollowups(ctx: MutationCtx, leadId: Id<"leads">) {
  for (const task of await ctx.db
    .query("tasks")
    .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
    .take(200)) {
    if (task.kind === "followup" && !task.done)
      await ctx.db.patch(task._id, { cancelled: true, done: true });
  }
  for (const intent of await ctx.db
    .query("sendIntents")
    .withIndex("by_leadId", (q) => q.eq("leadId", leadId))
    .take(200)) {
    if (intent.state === "queued") {
      await ctx.db.patch(intent._id, {
        state: "cancelled",
        error: "Reply, suppression or manual cancellation",
        updatedAt: Date.now(),
      });
      const d = await ctx.db.get(intent.draftId);
      if (d) await ctx.db.patch(d._id, { status: "cancelled" });
    }
  }
}
