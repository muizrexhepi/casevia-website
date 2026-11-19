"use node";
import * as webpush from "web-push";
import { Resend } from "resend";
import { createHash } from "node:crypto";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
export const deliver = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx): Promise<null> => {
    const batch = await ctx.runQuery(internal.notifications.pending, {});
    if (!batch.notifications.length) return null;
    const expired: Id<"pushSubscriptions">[] = [];
    const ids: Id<"notifications">[] = [];
    if (
      batch.push &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_PUBLIC_KEY
    )
      webpush.setVapidDetails(
        "mailto:mail@muizrexhepi.com",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      );
    const groups =
      batch.mode === "digest"
        ? [batch.notifications]
        : batch.notifications.map((n) => [n]);
    for (const group of groups) {
      let delivered = false;
      const first = group[0],
        href = batch.mode === "digest" ? "/crm" : first.href,
        payload = JSON.stringify({
          title:
            batch.mode === "digest"
              ? "Your daily CRM summary"
              : "Your CRM needs attention",
          body:
            batch.mode === "digest"
              ? `${group.length} updates to review.`
              : "Open your private workspace to review this update.",
          href,
          tag: `crm-${first._id}`,
        });
      if (
        batch.push &&
        process.env.VAPID_PRIVATE_KEY &&
        process.env.VAPID_PUBLIC_KEY
      )
        for (const subscription of batch.subscriptions) {
          try {
            await webpush.sendNotification(
              {
                endpoint: subscription.endpoint,
                keys: { p256dh: subscription.p256dh, auth: subscription.auth },
              },
              payload,
              { TTL: 3600, timeout: 10000 },
            );
            delivered = true;
          } catch (error) {
            if (
              error &&
              typeof error === "object" &&
              "statusCode" in error &&
              [404, 410].includes(Number(error.statusCode))
            )
              expired.push(subscription.id);
          }
        }
      if (batch.email && process.env.RESEND_API_KEY) {
        try {
          const { data, error } = await new Resend(
            process.env.RESEND_API_KEY,
          ).emails.send(
            {
              from:
                process.env.CRM_FROM_EMAIL ?? "Muiz CRM <mail@muizrexhepi.com>",
              to: process.env.CRM_OWNER_EMAIL ?? "mail@muizrexhepi.com",
              subject:
                batch.mode === "digest"
                  ? "Your daily CRM summary"
                  : "Your CRM needs attention",
              text: `${group.length} update(s) need your attention. Open https://crm.muizrexhepi.com${href.replace(/^\/crm/, "") || "/"}.`,
            },
            {
              idempotencyKey: `crm-notification/${createHash("sha256")
                .update(group.map((n) => n._id).join(","))
                .digest("hex")}`,
            },
          );
          if (data?.id && !error) delivered = true;
        } catch {
          /* Persist pending notifications for the next delivery sweep. */
        }
      }
      if (delivered) ids.push(...group.map((n) => n._id));
    }
    await ctx.runMutation(internal.notifications.complete, { ids, expired });
    return null;
  },
});
