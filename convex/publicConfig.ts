import { query } from "./_generated/server";
import { v } from "convex/values";
/** Minimal pre-auth signal; never returns private records or credentials. */
export const connection = query({
  args: {},
  returns: v.object({ ownerLoginConfigured: v.boolean() }),
  handler: () => ({
    ownerLoginConfigured:
      !!process.env.AUTH_GITHUB_ID &&
      process.env.AUTH_GITHUB_ID !== "disconnected" &&
      !!process.env.AUTH_GITHUB_SECRET &&
      process.env.AUTH_GITHUB_SECRET !== "disconnected" &&
      !!process.env.CRM_OWNER_GITHUB_ID,
  }),
});
