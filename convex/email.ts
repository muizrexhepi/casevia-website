"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { ResendProvider, ProspectingProvider } from "../lib/crm/email-provider";
export const send = internalAction({
  args: { intentId: v.id("sendIntents") },
  returns: v.null(),
  handler: async (ctx, { intentId }): Promise<null> => {
    const claim = await ctx.runMutation(internal.outbound.claim, { intentId });
    if (!claim) return null;
    const { draft, lead, key } = claim;
    try {
      const provider =
        draft.provider === "resend"
          ? new ResendProvider(process.env.RESEND_API_KEY!)
          : new ProspectingProvider(
              process.env.PROSPECTING_API_URL!,
              process.env.PROSPECTING_API_KEY!,
            );
      const text = [
        draft.body,
        ...(draft.kind === "proposal"
          ? [
              `Scope: ${draft.scope}`,
              `Price: ${draft.price} ${draft.currency}`,
              `Exclusions: ${draft.exclusions}`,
              `Next steps: ${draft.nextSteps}`,
            ]
          : []),
        "If you would prefer no further messages, reply and let me know.",
      ].join("\n\n");
      const result = await provider.send({
        from:
          process.env.CRM_FROM_EMAIL ?? "Muiz Rexhepi <mail@muizrexhepi.com>",
        to: lead.email,
        replyTo: process.env.CRM_REPLY_TO ?? "mail@muizrexhepi.com",
        subject: draft.subject,
        text,
        idempotencyKey: key,
      });
      await ctx.runMutation(internal.outbound.result, {
        intentId,
        state: "sent",
        providerId: result.id,
        error: "",
      });
    } catch {
      await ctx.runMutation(internal.outbound.result, {
        intentId,
        state: "uncertain",
        providerId: "",
        error:
          "Provider result is uncertain. Inspect delivery history and reconcile before retrying; automatic retry disabled.",
      });
    }
    return null;
  },
});
