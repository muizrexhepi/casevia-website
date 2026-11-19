import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import { spawnSync } from "node:child_process";
const root = new URL("../", import.meta.url);
const project = JSON.parse(
  readFileSync(new URL(".vercel/project.json", root), "utf8"),
);
if (project.projectName !== "casevia-io")
  throw new Error("Unexpected hosting project");
const production = process.argv.includes("--prod");
const source = readFileSync(
  new URL(production ? ".env.crm-production.local" : ".env.local", root),
  "utf8",
);
const payloadPath = new URL(".env.crm-vercel-payload.local", root);
try {
  for (const key of [
    "NEXT_PUBLIC_CONVEX_URL",
    "NEXT_PUBLIC_CONVEX_SITE_URL",
    "CRM_CAPTURE_SECRET",
    "NEXT_PUBLIC_VAPID_PUBLIC_KEY",
  ]) {
    const value = source.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1]?.trim();
    if (!value) throw new Error(`Missing ${key}`);
    writeFileSync(
      payloadPath,
      JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: [production ? "production" : "preview"],
        ...(production ? {} : { gitBranch: "feat/private-sales-crm" }),
      }),
      { mode: 0o600 },
    );
    const result = spawnSync(
      "npx",
      [
        "--yes",
        "vercel@latest",
        "api",
        `/v10/projects/${project.projectId}/env?upsert=true`,
        "-X",
        "POST",
        "--input",
        payloadPath.pathname,
        "--scope",
        "knuckleclots-projects",
        "--raw",
      ],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    if (result.status !== 0)
      throw new Error(
        `Could not configure hosting ${key}: ${result.stderr
          .replaceAll(value, "[REDACTED]")
          .replace(/(?:re_|sk-)[A-Za-z0-9_-]+/g, "[REDACTED]")
          .slice(-700)}`,
      );
    console.log(
      `Configured ${production ? "production" : "branch preview"} ${key}`,
    );
  }
} finally {
  try {
    unlinkSync(payloadPath);
  } catch {}
}
