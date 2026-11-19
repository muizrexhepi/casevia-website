import { services } from "../lib/services";
import { projects } from "../lib/projects";
import type { Doc } from "./_generated/dataModel";
export const defaultSettings: Omit<Doc<"settings">, "_id" | "_creationTime"> = {
  key: "owner",
  paused: true,
  prospectingAuthorized: false,
  prospectingProvider: "",
  autoDiscovery: false,
  autoResearch: false,
  autoDraft: false,
  autoEligibleFollowups: false,
  autoSendApproved: false,
  dailyVolume: 5,
  discoveryHour: 9,
  markets: ["North Macedonia", "Switzerland"],
  industries: ["Hospitality", "Travel", "Professional services"],
  services: services
    .map((x) => `${x.title}: ${x.deliverables.join(", ")}`)
    .join("\n"),
  projects: projects
    .map(
      (x) =>
        `${x.name}: ${x.summary} — https://www.muizrexhepi.com/work/${x.slug}`,
    )
    .join("\n"),
  pricing:
    "No approved price list yet. Prepare scope for owner review. Never invent prices, discounts, budgets, or delivery promises.",
  languages: ["en", "sq", "mk", "de"],
  qualificationThreshold: 65,
  followupDays: 5,
  maxFollowups: 2,
  sendStart: 9,
  sendEnd: 17,
  timezone: "Europe/Skopje",
  model: "gpt-6-luna",
  dailyLimit: 5,
  monthlyLimit: 30,
  creditNote:
    "OpenAI Personal organization: $100 observed 2026-11-19, displayed expiry 2026-12-18. This is not a live credit balance.",
  notifyPush: false,
  notifyEmail: false,
  notificationMode: "digest",
  lastDiscoveryDay: "",
  lastDigestDay: "",
};
