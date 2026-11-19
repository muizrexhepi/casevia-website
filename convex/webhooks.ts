"use node";
import { Webhook } from "svix";
import { z } from "zod";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
const eventSchema = z.object({
  type: z.string().max(100),
  created_at: z.string(),
  data: z.object({ email_id: z.string().max(200) }),
});
export const resend = internalAction({
  args: {
    body: v.string(),
    id: v.string(),
    timestamp: v.string(),
    signature: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args): Promise<boolean> => {
    if (!process.env.RESEND_WEBHOOK_SECRET) return false;
    try {
      new Webhook(process.env.RESEND_WEBHOOK_SECRET).verify(args.body, {
        "svix-id": args.id,
        "svix-timestamp": args.timestamp,
        "svix-signature": args.signature,
      });
      const event = eventSchema.parse(JSON.parse(args.body));
      await ctx.runMutation(internal.integrations.deliveryEvent, {
        eventId: args.id,
        type: event.type,
        messageId: event.data.email_id,
        timestamp: new Date(event.created_at).getTime(),
      });
      return true;
    } catch {
      return false;
    }
  },
});
