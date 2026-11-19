"use node";
import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { randomUUID } from "node:crypto";
import { parseZohoJson, zohoPage } from "../lib/crm/zoho-data";
const regions: Record<string, { accounts: string; mail: string }> = {
  com: { accounts: "https://accounts.zoho.com", mail: "https://mail.zoho.com" },
  eu: { accounts: "https://accounts.zoho.eu", mail: "https://mail.zoho.eu" },
  in: { accounts: "https://accounts.zoho.in", mail: "https://mail.zoho.in" },
  "com.au": {
    accounts: "https://accounts.zoho.com.au",
    mail: "https://mail.zoho.com.au",
  },
};
export const sync = internalAction({
  args: { force: v.optional(v.boolean()) },
  returns: v.null(),
  handler: async (ctx, { force }): Promise<null> => {
    const {
      ZOHO_CLIENT_ID: id,
      ZOHO_CLIENT_SECRET: secret,
      ZOHO_REFRESH_TOKEN: refresh,
      ZOHO_ACCOUNT_ID: account,
    } = process.env;
    if (!id || !secret || !refresh || !account) return null;
    const region = regions[process.env.ZOHO_REGION ?? "com"];
    if (!region) return null;
    const leaseToken = randomUUID();
    if (
      !(await ctx.runMutation(internal.integrations.acquireZoho, {
        token: leaseToken,
        force: !!force,
      }))
    )
      return null;
    const state = await ctx.runQuery(internal.integrations.cursor, {
      key: "zoho",
    });
    const start = zohoPage(state?.cursor);
    const tokenKey = `zoho:${id}:${account}`;
    try {
      const cached = await ctx.runQuery(internal.integrations.cachedToken, {
        key: tokenKey,
        now: Date.now(),
      });
      let accessToken = cached?.value;
      if (!accessToken) {
        const tokenResponse = await fetch(`${region.accounts}/oauth/v2/token`, {
          method: "POST",
          body: new URLSearchParams({
            grant_type: "refresh_token",
            client_id: id,
            client_secret: secret,
            refresh_token: refresh,
          }),
          signal: AbortSignal.timeout(15000),
        });
        const token = (await tokenResponse.json()) as {
          access_token?: string;
          expires_in?: number;
          error?: string;
        };
        if (!tokenResponse.ok || !token.access_token)
          throw new Error(
            `Zoho OAuth refresh failed (${tokenResponse.status}${token.error === "Access Denied" ? " Access Denied" : ""}); check region, scopes and credentials`,
          );
        accessToken = token.access_token;
        await ctx.runMutation(internal.integrations.cacheToken, {
          key: tokenKey,
          value: accessToken,
          expiresAt:
            Date.now() + Math.min(3600, token.expires_in ?? 3600) * 1000,
        });
      }
      const headers = {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      };
      // Poll inbox with a deliberate overlap. Every message is deduplicated by Zoho ID.
      const url = new URL(
        `${region.mail}/api/accounts/${encodeURIComponent(account)}/messages/view`,
      );
      url.searchParams.set("start", String(start));
      url.searchParams.set("limit", "25");
      url.searchParams.set("sortBy", "date");
      url.searchParams.set("sortorder", "false");
      if (process.env.ZOHO_INBOX_FOLDER_ID)
        url.searchParams.set("folderId", process.env.ZOHO_INBOX_FOLDER_ID);
      const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(15000),
      });
      const data = parseZohoJson(await response.text()) as {
        data?: Array<{
          messageId: string | number;
          folderId: string | number;
          fromAddress: string;
          subject: string;
          threadId?: string | number;
          receivedTime?: string | number;
          receivedtime?: string | number;
          summary?: string;
        }>;
      };
      if (response.status === 401)
        await ctx.runMutation(internal.integrations.cacheToken, {
          key: tokenKey,
          value: "",
          expiresAt: 0,
        });
      if (!response.ok || !Array.isArray(data.data))
        throw new Error(`Zoho messages request failed (${response.status})`);
      let reachedPrevious = false;
      const watermark = state?.lastSuccess ?? Date.now() - 30 * 86400000;
      for (const message of data.data) {
        const timestamp = Number(
          message.receivedTime ?? message.receivedtime ?? Date.now(),
        );
        if (timestamp < watermark - 86400000) {
          reachedPrevious = true;
          break;
        }
        // Read full bodies only for contacts already present in the CRM.
        if (
          !(await ctx.runQuery(internal.integrations.knownSender, {
            email: message.fromAddress,
          }))
        )
          continue;
        const contentResponse = await fetch(
          `${region.mail}/api/accounts/${encodeURIComponent(account)}/folders/${encodeURIComponent(String(message.folderId))}/messages/${encodeURIComponent(String(message.messageId))}/content`,
          { headers, signal: AbortSignal.timeout(10000) },
        );
        if (!contentResponse.ok)
          throw new Error(
            `Zoho message content fetch failed (${contentResponse.status}); cursor retained`,
          );
        const content = (await contentResponse.json()) as {
          data?: { content?: string };
        };
        const body = (content.data?.content ?? message.summary ?? "")
          .replace(/<(script|style)[\s\S]*?<\/\1>/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/\s+/g, " ")
          .slice(0, 20000);
        await ctx.runMutation(internal.integrations.ingestReply, {
          email: message.fromAddress,
          body,
          subject: message.subject.slice(0, 200),
          providerId: String(message.messageId),
          threadId: String(message.threadId ?? message.messageId),
          internetMessageId: "",
          inReplyTo: "",
          receivedAt: timestamp,
        });
      }
      const next = data.data.length === 25 && !reachedPrevious ? start + 25 : 1;
      await ctx.runMutation(internal.integrations.checkpoint, {
        key: "zoho",
        cursor: String(next),
        error: "",
        completed: next === 1,
        leaseToken,
      });
      if (next > 1) await ctx.scheduler.runAfter(15000, internal.zoho.sync, {});
    } catch (error) {
      await ctx.runMutation(internal.integrations.checkpoint, {
        key: "zoho",
        cursor: String(start),
        completed: false,
        leaseToken,
        error: `${error instanceof Error && error.message.startsWith("Zoho ") ? error.message : "Zoho network or persistence failure"}. No mailbox settings were changed.`,
      });
    }
    return null;
  },
});
export const syncNow = action({
  args: {},
  returns: v.null(),
  handler: async (ctx): Promise<null> => {
    await ctx.runQuery(api.crm.owner, {});
    await ctx.runAction(internal.zoho.sync, { force: true });
    return null;
  },
});
