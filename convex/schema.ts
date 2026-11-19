import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  leadFields,
  draftFields,
  messageFields,
  jobFields,
  settingsFields,
  notificationFields,
  activityFields,
  taskFields,
  usageFields,
} from "./validators";
export default defineSchema({
  users: defineTable({
    githubId: v.string(),
    name: v.string(),
    role: v.literal("owner"),
  }).index("by_githubId", ["githubId"]),
  leads: defineTable(leadFields)
    .index("by_domain", ["domain"])
    .index("by_businessKey", ["businessKey"])
    .index("by_email", ["email"])
    .index("by_stage", ["stage"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["stage"],
    }),
  contacts: defineTable({
    email: v.string(),
    leadId: v.id("leads"),
    name: v.string(),
    verified: v.boolean(),
    sourceUrl: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_leadId", ["leadId"]),
  suppressions: defineTable({
    email: v.string(),
    reason: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),
  drafts: defineTable(draftFields)
    .index("by_leadId", ["leadId"])
    .index("by_status", ["status"]),
  messages: defineTable(messageFields)
    .index("by_leadId", ["leadId"])
    .index("by_provider_and_providerId", ["provider", "providerId"]),
  sendIntents: defineTable({
    draftId: v.id("drafts"),
    leadId: v.id("leads"),
    revision: v.number(),
    key: v.string(),
    state: v.union(
      v.literal("queued"),
      v.literal("sending"),
      v.literal("sent"),
      v.literal("failed"),
      v.literal("uncertain"),
      v.literal("cancelled"),
    ),
    provider: v.string(),
    providerId: v.string(),
    error: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_state", ["state"])
    .index("by_leadId", ["leadId"]),
  jobs: defineTable(jobFields)
    .index("by_state", ["state"])
    .index("by_leadId", ["leadId"]),
  usage: defineTable(usageFields)
    .index("by_day", ["day"])
    .index("by_month", ["month"])
    .index("by_status", ["status"]),
  budgets: defineTable({
    period: v.string(),
    spent: v.number(),
    reserved: v.number(),
  }).index("by_period", ["period"]),
  settings: defineTable(settingsFields).index("by_key", ["key"]),
  activity: defineTable(activityFields).index("by_leadId", ["leadId"]),
  tasks: defineTable(taskFields)
    .index("by_leadId", ["leadId"])
    .index("by_done_and_dueAt", ["done", "dueAt"]),
  notifications: defineTable(notificationFields).index("by_delivered", [
    "delivered",
  ]),
  pushSubscriptions: defineTable({
    endpoint: v.string(),
    p256dh: v.string(),
    auth: v.string(),
    createdAt: v.number(),
  }).index("by_endpoint", ["endpoint"]),
  events: defineTable({
    key: v.string(),
    kind: v.string(),
    createdAt: v.number(),
    providerMessageId: v.optional(v.string()),
    timestamp: v.optional(v.number()),
  })
    .index("by_key", ["key"])
    .index("by_providerMessageId", ["providerMessageId"]),
  integrationState: defineTable({
    key: v.string(),
    cursor: v.string(),
    lastSuccess: v.optional(v.number()),
    leaseToken: v.optional(v.string()),
    leaseUntil: v.optional(v.number()),
    retryCount: v.optional(v.number()),
    retryAfter: v.optional(v.number()),
    error: v.string(),
  }).index("by_key", ["key"]),
  // Short-lived provider credentials. Accessible only through internal functions;
  // never included in the owner snapshot, status API, frontend or audit log.
  integrationTokens: defineTable({
    key: v.string(),
    value: v.string(),
    expiresAt: v.number(),
  }).index("by_key", ["key"]),
});
