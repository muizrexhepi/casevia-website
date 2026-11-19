import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { internalMutation, type MutationCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { coldProspect, knownEnterprise } from "../lib/crm/targeting";
import { audit, cancelFollowups } from "./helpers";

export async function excludeEnterprise(ctx: MutationCtx, lead: Doc<"leads">) {
  const reason = coldProspect(lead)
    ? knownEnterprise(lead.name, lead.website)
    : null;
  if (!reason) return false;
  if (!lead.excluded) {
    await ctx.db.patch(lead._id, {
      excluded: true,
      targetFit: {
        status: "excluded",
        reason,
        evidenceUrl: lead.website,
        sizeQuote: "",
        opportunityQuote: "",
      },
      nextAction: reason,
      updatedAt: Date.now(),
    });
    await cancelFollowups(ctx, lead._id);
    await audit(ctx, "lead.excluded", reason, lead._id, "system");
  }
  return true;
}
// Bounded, reversible cleanup of existing discoveries. Inquiries and requested
// conversations are deliberately preserved. No records or audit history are deleted.
export const screenExisting = internalMutation({
  args: { paginationOpts: paginationOptsValidator },
  returns: v.object({
    excluded: v.number(),
    isDone: v.boolean(),
    continueCursor: v.string(),
  }),
  handler: async (ctx, { paginationOpts }) => {
    const page = await ctx.db
      .query("leads")
      .paginate({
        ...paginationOpts,
        numItems: Math.min(50, paginationOpts.numItems),
      });
    let excluded = 0;
    for (const lead of page.page)
      if (await excludeEnterprise(ctx, lead)) excluded++;
    return {
      excluded,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
