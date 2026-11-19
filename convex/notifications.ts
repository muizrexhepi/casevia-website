import { v, ConvexError } from "convex/values";
import { mutation, internalQuery, internalMutation } from "./_generated/server";
import { requireOwner } from "./users";
import { settings } from "./helpers";
import { notificationDoc } from "./validators";
export const subscribe = mutation({
  args: { endpoint: v.string(), p256dh: v.string(), auth: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireOwner(ctx);
    const u = new URL(args.endpoint);
    if (
      u.protocol !== "https:" ||
      ![
        /^fcm\.googleapis\.com$/,
        /^updates\.push\.services\.mozilla\.com$/,
        /^web\.push\.apple\.com$/,
        /^[a-z0-9.-]+\.notify\.windows\.com$/,
      ].some((x) => x.test(u.hostname)) ||
      args.endpoint.length > 3000 ||
      args.p256dh.length > 300 ||
      args.auth.length > 150
    )
      throw new ConvexError("Unsupported push endpoint");
    const prior = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("endpoint", args.endpoint))
      .unique();
    if (prior) await ctx.db.patch(prior._id, args);
    else
      await ctx.db.insert("pushSubscriptions", {
        ...args,
        createdAt: Date.now(),
      });
    return null;
  },
});
export const unsubscribe = mutation({
  args: { endpoint: v.string() },
  returns: v.null(),
  handler: async (ctx, { endpoint }) => {
    await requireOwner(ctx);
    const row = await ctx.db
      .query("pushSubscriptions")
      .withIndex("by_endpoint", (q) => q.eq("endpoint", endpoint))
      .unique();
    if (row) await ctx.db.delete(row._id);
    return null;
  },
});
export const pending = internalQuery({
  args: {},
  returns: v.object({
    notifications: v.array(notificationDoc),
    subscriptions: v.array(
      v.object({
        id: v.id("pushSubscriptions"),
        endpoint: v.string(),
        p256dh: v.string(),
        auth: v.string(),
      }),
    ),
    push: v.boolean(),
    email: v.boolean(),
    mode: v.string(),
  }),
  handler: async (ctx) => {
    const s = await settings(ctx);
    let pending = await ctx.db
      .query("notifications")
      .withIndex("by_delivered", (q) => q.eq("delivered", false))
      .take(100);
    if (
      s.notificationMode === "digest" &&
      !pending.some((n) => n.kind === "digest")
    )
      pending = [];
    return {
      notifications: pending,
      subscriptions: (await ctx.db.query("pushSubscriptions").take(20)).map(
        (x) => ({
          id: x._id,
          endpoint: x.endpoint,
          p256dh: x.p256dh,
          auth: x.auth,
        }),
      ),
      push: s.notifyPush,
      email: s.notifyEmail,
      mode: s.notificationMode,
    };
  },
});
export const complete = internalMutation({
  args: {
    ids: v.array(v.id("notifications")),
    expired: v.array(v.id("pushSubscriptions")),
  },
  returns: v.null(),
  handler: async (ctx, { ids, expired }) => {
    for (const id of ids) await ctx.db.patch(id, { delivered: true });
    for (const id of expired) if (await ctx.db.get(id)) await ctx.db.delete(id);
    return null;
  },
});
