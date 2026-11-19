import { v } from "convex/values";
export const stage = v.union(
  ...[
    "new",
    "researching",
    "qualified",
    "contacted",
    "interested",
    "meeting",
    "proposal",
    "won",
    "lost",
  ].map((x) => v.literal(x)),
);
export const eligibility = v.union(
  v.literal("unknown"),
  v.literal("requested"),
  v.literal("opted_in"),
  v.literal("prospecting_eligible"),
  v.literal("suppressed"),
);
export const language = v.union(
  v.literal("en"),
  v.literal("sq"),
  v.literal("mk"),
  v.literal("de"),
);
export const source = v.object({
  url: v.string(),
  title: v.string(),
  verified: v.boolean(),
  excerpt: v.string(),
  checkedAt: v.number(),
});
export const observation = v.object({
  text: v.string(),
  kind: v.union(v.literal("verified"), v.literal("hypothesis")),
  sourceUrl: v.string(),
});
export const leadFields = {
  name: v.string(),
  domain: v.string(),
  businessKey: v.string(),
  website: v.string(),
  location: v.string(),
  industry: v.string(),
  email: v.string(),
  contactName: v.string(),
  language,
  origin: v.union(
    v.literal("manual"),
    v.literal("csv"),
    v.literal("website"),
    v.literal("discovery"),
  ),
  stage,
  eligibility,
  permissionEvidence: v.string(),
  suppressed: v.boolean(),
  sources: v.array(source),
  observations: v.array(observation),
  score: v.number(),
  scoreReasons: v.array(v.string()),
  suggestedService: v.string(),
  researchAt: v.optional(v.number()),
  researchHash: v.optional(v.string()),
  nextAction: v.string(),
  notes: v.string(),
  dealValue: v.number(),
  currency: v.union(v.literal("EUR"), v.literal("CHF"), v.literal("MKD")),
  collectedRevenue: v.number(),
  outcomeReason: v.string(),
  repliedAt: v.optional(v.number()),
  updatedAt: v.number(),
  createdAt: v.number(),
};
export const draftFields = {
  leadId: v.id("leads"),
  kind: v.union(
    v.literal("outreach"),
    v.literal("reply"),
    v.literal("followup"),
    v.literal("proposal"),
  ),
  subject: v.string(),
  body: v.string(),
  language,
  provider: v.union(v.literal("resend"), v.literal("prospecting")),
  revision: v.number(),
  approvedRevision: v.optional(v.number()),
  approvedBy: v.optional(v.id("users")),
  approvedAt: v.optional(v.number()),
  status: v.union(
    v.literal("draft"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("queued"),
    v.literal("sent"),
    v.literal("cancelled"),
  ),
  price: v.number(),
  currency: v.string(),
  scope: v.string(),
  exclusions: v.string(),
  nextSteps: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
};
export const messageFields = {
  leadId: v.id("leads"),
  direction: v.union(v.literal("inbound"), v.literal("outbound")),
  subject: v.string(),
  body: v.string(),
  from: v.string(),
  to: v.string(),
  provider: v.string(),
  providerId: v.string(),
  threadId: v.string(),
  internetMessageId: v.string(),
  inReplyTo: v.string(),
  classification: v.string(),
  summary: v.string(),
  receivedAt: v.number(),
  delivery: v.string(),
};
export const jobFields = {
  kind: v.union(
    v.literal("discovery"),
    v.literal("research"),
    v.literal("draft"),
    v.literal("proposal"),
    v.literal("classify"),
  ),
  leadId: v.optional(v.id("leads")),
  state: v.union(
    v.literal("queued"),
    v.literal("running"),
    v.literal("complete"),
    v.literal("failed"),
    v.literal("uncertain"),
  ),
  error: v.string(),
  attempt: v.number(),
  query: v.string(),
  reservation: v.number(),
  usageId: v.optional(v.id("usage")),
  createdAt: v.number(),
  finishedAt: v.optional(v.number()),
};
export const settingsFields = {
  key: v.literal("owner"),
  paused: v.boolean(),
  prospectingAuthorized: v.boolean(),
  prospectingProvider: v.string(),
  autoDiscovery: v.boolean(),
  autoResearch: v.boolean(),
  autoDraft: v.boolean(),
  autoEligibleFollowups: v.boolean(),
  autoSendApproved: v.optional(v.boolean()),
  dailyVolume: v.number(),
  discoveryHour: v.number(),
  markets: v.array(v.string()),
  industries: v.array(v.string()),
  services: v.string(),
  projects: v.string(),
  pricing: v.string(),
  languages: v.array(language),
  qualificationThreshold: v.number(),
  followupDays: v.number(),
  maxFollowups: v.number(),
  sendStart: v.number(),
  sendEnd: v.number(),
  timezone: v.string(),
  model: v.union(
    v.literal("gpt-6-luna"),
    v.literal("gpt-6.2-sol"),
    v.literal("gpt-6.2-astra"),
  ),
  dailyLimit: v.number(),
  monthlyLimit: v.number(),
  manualCredit: v.optional(v.number()),
  creditNote: v.string(),
  notifyPush: v.boolean(),
  notifyEmail: v.boolean(),
  notificationMode: v.union(v.literal("individual"), v.literal("digest")),
  lastDiscoveryDay: v.string(),
  lastDigestDay: v.string(),
};
export const notificationFields = {
  title: v.string(),
  body: v.string(),
  href: v.string(),
  kind: v.string(),
  read: v.boolean(),
  createdAt: v.number(),
  delivered: v.boolean(),
};
export const activityFields = {
  leadId: v.optional(v.id("leads")),
  action: v.string(),
  detail: v.string(),
  actor: v.string(),
  createdAt: v.number(),
};
export const taskFields = {
  leadId: v.id("leads"),
  title: v.string(),
  dueAt: v.number(),
  done: v.boolean(),
  kind: v.union(v.literal("task"), v.literal("meeting"), v.literal("followup")),
  attempt: v.number(),
  cancelled: v.boolean(),
  createdAt: v.number(),
};
export const usageFields = {
  jobId: v.id("jobs"),
  model: v.string(),
  day: v.string(),
  month: v.string(),
  reserved: v.number(),
  estimated: v.number(),
  inputTokens: v.number(),
  outputTokens: v.number(),
  searchCalls: v.number(),
  status: v.union(
    v.literal("reserved"),
    v.literal("settled"),
    v.literal("uncertain"),
  ),
  responseId: v.string(),
  createdAt: v.number(),
};
export const leadDoc = v.object({
  _id: v.id("leads"),
  _creationTime: v.number(),
  ...leadFields,
});
export const draftDoc = v.object({
  _id: v.id("drafts"),
  _creationTime: v.number(),
  ...draftFields,
});
export const messageDoc = v.object({
  _id: v.id("messages"),
  _creationTime: v.number(),
  ...messageFields,
});
export const jobDoc = v.object({
  _id: v.id("jobs"),
  _creationTime: v.number(),
  ...jobFields,
});
export const settingsDoc = v.object({
  _id: v.id("settings"),
  _creationTime: v.number(),
  ...settingsFields,
});
export const notificationDoc = v.object({
  _id: v.id("notifications"),
  _creationTime: v.number(),
  ...notificationFields,
});
export const activityDoc = v.object({
  _id: v.id("activity"),
  _creationTime: v.number(),
  ...activityFields,
});
export const taskDoc = v.object({
  _id: v.id("tasks"),
  _creationTime: v.number(),
  ...taskFields,
});
export const usageDoc = v.object({
  _id: v.id("usage"),
  _creationTime: v.number(),
  ...usageFields,
});
