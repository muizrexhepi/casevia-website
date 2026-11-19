import type { MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { cancelFollowups } from "./helpers";
export async function applyDelivery(
  ctx: MutationCtx,
  message: Doc<"messages">,
  type: string,
) {
  const rank: Record<string, number> = {
    sent: 0,
    "email.sent": 0,
    "email.delivered": 1,
    "email.opened": 2,
    "email.clicked": 3,
    "email.bounced": 10,
    "email.complained": 11,
  };
  if ((rank[type] ?? 0) >= (rank[message.delivery] ?? 0))
    await ctx.db.patch(message._id, { delivery: type });
  if (["email.bounced", "email.complained"].includes(type)) {
    const lead = await ctx.db.get(message.leadId);
    if (!lead) return;
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
        reason: type,
        createdAt: Date.now(),
      });
    await cancelFollowups(ctx, lead._id);
  }
}
