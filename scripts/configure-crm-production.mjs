import { readFileSync, writeFileSync, existsSync, chmodSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { generateVAPIDKeys } from "web-push";
const root = new URL("../", import.meta.url);
const local = readFileSync(new URL(".env.local", root), "utf8");
if (!local.includes("exciting-scorpion-834"))
  throw new Error("Unexpected Convex project");
const path = new URL(".env.crm-production.local", root);
const previous = existsSync(path) ? readFileSync(path, "utf8") : "";
const get = (name) =>
  previous.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim();
const vapid = generateVAPIDKeys();
const config = {
  NEXT_PUBLIC_CONVEX_URL: "https://nautical-tapir-784.convex.cloud",
  NEXT_PUBLIC_CONVEX_SITE_URL: "https://nautical-tapir-784.convex.site",
  CRM_CAPTURE_SECRET:
    get("CRM_CAPTURE_SECRET") ?? randomBytes(32).toString("hex"),
  NEXT_PUBLIC_VAPID_PUBLIC_KEY:
    get("NEXT_PUBLIC_VAPID_PUBLIC_KEY") ?? vapid.publicKey,
  VAPID_PRIVATE_KEY: get("VAPID_PRIVATE_KEY") ?? vapid.privateKey,
};
writeFileSync(
  path,
  Object.entries(config)
    .map(([k, v]) => `${k}=${v}\n`)
    .join(""),
  { mode: 0o600 },
);
chmodSync(path, 0o600);
for (const [name, value] of Object.entries({
  CRM_CAPTURE_SECRET: config.CRM_CAPTURE_SECRET,
  VAPID_PUBLIC_KEY: config.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY: config.VAPID_PRIVATE_KEY,
  CRM_OWNER_GITHUB_ID: "90201782",
  ZOHO_REGION: "eu",
})) {
  const result = spawnSync(
    "npx",
    ["convex", "env", "set", "--prod", name, value],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
  if (result.status !== 0)
    throw new Error(
      `Could not configure production ${name}; response withheld`,
    );
  console.log(`Configured production ${name}`);
}
