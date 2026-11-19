import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { vGithubProfile } from "@convex-dev/auth/methods/github/server";
import { internalMutation } from "./_generated/server";
import type { QueryCtx, MutationCtx } from "./_generated/server";
function check(id: string) {
  if (
    !process.env.CRM_OWNER_GITHUB_ID ||
    id !== process.env.CRM_OWNER_GITHUB_ID
  )
    throw new ConvexError("Owner access required");
}
export const createOwner = internalMutation({
  args: {
    method: v.object({ name: v.literal("github"), profile: vGithubProfile }),
  },
  returns: v.id("users"),
  handler: async (ctx, { method }) => {
    check(method.profile.id);
    const existing = await ctx.db
      .query("users")
      .withIndex("by_githubId", (q) => q.eq("githubId", method.profile.id))
      .unique();
    return existing
      ? existing._id
      : ctx.db.insert("users", {
          githubId: method.profile.id,
          name: method.profile.name ?? "Muiz",
          role: "owner",
        });
  },
});
export const checkOwner = internalMutation({
  args: {
    method: v.object({ name: v.literal("github"), profile: vGithubProfile }),
    userId: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, { method, userId }) => {
    check(method.profile.id);
    const u = await ctx.db.get(userId);
    if (u?.githubId !== method.profile.id)
      throw new ConvexError("Owner access required");
    return null;
  },
});
export async function requireOwner(ctx: QueryCtx | MutationCtx) {
  const id = await getAuthUserId(ctx);
  if (!id) throw new ConvexError("Sign in required");
  const user = await ctx.db.get(id);
  if (!user || user.role !== "owner")
    throw new ConvexError("Owner access required");
  check(user.githubId);
  return user;
}
