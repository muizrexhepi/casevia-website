import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { Resend } from "resend";
const path = new URL("../.env.crm-secrets.local", import.meta.url);
let source = readFileSync(path, "utf8");
const key = source.match(/^RESEND_API_KEY=(.*)$/m)?.[1]?.trim();
if (!key) throw new Error("Missing existing Resend key");
const client = new Resend(key);
const listed = await client.webhooks.list();
if (listed.error || !listed.data)
  throw new Error(
    `Resend webhook management unavailable: ${listed.error?.name ?? "unknown"}. No new credentials created.`,
  );
for (const [deployment, flag, suffix] of [
  ["exciting-scorpion-834", [], "DEV"],
  ["nautical-tapir-784", ["--prod"], "PROD"],
]) {
  const endpoint = `https://${deployment}.convex.site/webhooks/resend`;
  const existing = listed.data.data.find((row) => row.endpoint === endpoint);
  const result = existing
    ? await client.webhooks.get(existing.id)
    : await client.webhooks.create({
        endpoint,
        events: [
          "email.sent",
          "email.delivered",
          "email.delivery_delayed",
          "email.failed",
          "email.bounced",
          "email.complained",
        ],
      });
  if (result.error || !result.data?.signing_secret)
    throw new Error(
      `Could not configure ${suffix} webhook; provider response withheld`,
    );
  const name = `CRM_RESEND_WEBHOOK_${suffix}`;
  source =
    source.replace(new RegExp(`^${name}=.*\\n?`, "gm"), "") +
    `\n${name}=${result.data.signing_secret}\n`;
  writeFileSync(path, source, { mode: 0o600 });
  const configured = spawnSync(
    "npx",
    [
      "convex",
      "env",
      "set",
      ...flag,
      "RESEND_WEBHOOK_SECRET",
      result.data.signing_secret,
    ],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  if (configured.status !== 0)
    throw new Error(
      `Could not store ${suffix} webhook verification key; response withheld`,
    );
  console.log(`Configured signed ${suffix} Resend events (${result.data.id})`);
}
