export const stages = [
  "new",
  "researching",
  "qualified",
  "contacted",
  "interested",
  "meeting",
  "proposal",
  "won",
  "lost",
] as const;
export const languages = ["en", "sq", "mk", "de"] as const;
export type Stage = (typeof stages)[number];
export type Eligibility =
  "unknown" | "requested" | "opted_in" | "prospecting_eligible" | "suppressed";
export const stageLabels: Record<Stage, string> = {
  new: "New",
  researching: "Researching",
  qualified: "Qualified",
  contacted: "Contacted",
  interested: "Interested",
  meeting: "Meeting",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
};
export function emailKey(email: string) {
  return email.trim().toLowerCase();
}
export function domainKey(website: string) {
  if (!website.trim()) return "";
  const url = new URL(website.includes("://") ? website : `https://${website}`);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password
  )
    throw new Error("Enter a public business website");
  return url.hostname
    .toLowerCase()
    .replace(/^www\./, "")
    .replace(/\.$/, "");
}
export function businessKey(name: string, location: string) {
  return `${name.trim().toLowerCase().replace(/\s+/g, " ")}|${location.trim().toLowerCase()}`;
}
export function sendBlock(input: {
  paused: boolean;
  approved: boolean;
  suppressed: boolean;
  eligibility: Eligibility;
  provider: "resend" | "prospecting";
  configured: boolean;
  authorized: boolean;
  replied: boolean;
  followup: boolean;
}) {
  if (input.paused) return "Outbound is paused";
  if (!input.approved) return "This exact draft needs owner approval";
  if (input.suppressed || input.eligibility === "suppressed")
    return "Recipient is suppressed";
  if (input.followup && input.replied) return "A reply cancelled follow-ups";
  if (!input.configured) return "Sending provider is disconnected";
  if (
    input.provider === "resend" &&
    !["requested", "opted_in"].includes(input.eligibility)
  )
    return "Resend requires requested or opted-in communication";
  if (
    input.provider === "prospecting" &&
    (!input.authorized || input.eligibility !== "prospecting_eligible")
  )
    return "Prospecting requires eligible recipient and explicit owner authorization";
  return null;
}
export function canReserve(
  daily: number,
  monthly: number,
  amount: number,
  dailyLimit: number,
  monthlyLimit: number,
) {
  return (
    amount > 0 &&
    daily + amount <= dailyLimit &&
    monthly + amount <= monthlyLimit
  );
}
export const modelRates = {
  "gpt-6.2-sol": { input: 2, output: 10, context: 1_050_000 },
  "gpt-6.2-astra": { input: 8, output: 40, context: 1_050_000 },
} as const;
export type CrmModel = keyof typeof modelRates;
export const searchCallUsd = 0.01;
export function reservationUsd(model: CrmModel, search: boolean) {
  const rate = modelRates[model];
  // Bounded text-only inputs use at most 82k UTF-8 bytes plus prompt overhead.
  // Search reserves the entire model context at long-context rates, rather
  // than assuming a cheap search result or ignoring hidden tool content.
  const input = search ? rate.context : 82_000;
  const multiplier = input > 272_000 ? 2 : 1;
  const outputMultiplier = input > 272_000 ? 1.5 : 1;
  return (
    Math.ceil(
      ((input * rate.input * multiplier) / 1e6 +
        (4096 * rate.output * outputMultiplier) / 1e6 +
        (search ? 3 * searchCallUsd : 0)) *
        100,
    ) / 100
  );
}
export function usageUsd(
  model: CrmModel,
  input: number,
  output: number,
  searches: number,
) {
  const rate = modelRates[model];
  return (
    (input * rate.input * (input > 272_000 ? 2 : 1)) / 1e6 +
    (output * rate.output * (input > 272_000 ? 1.5 : 1)) / 1e6 +
    searches * searchCallUsd
  );
}
export function sendingWindow(
  now: number,
  timezone: string,
  start: number,
  end: number,
) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      hourCycle: "h23",
    }).format(now),
  );
  return hour >= start && hour < end;
}
export function classifyReply(text: string) {
  if (
    /\b(unsubscribe|stop emailing|remove me|do not contact|abmelden|kein interesse|mos më kontakto)\b/i.test(
      text,
    )
  )
    return "opt_out";
  if (/\b(meeting|call|schedule|termin|gespräch|состанок|takim)\b/i.test(text))
    return "meeting";
  if (/\b(price|pricing|cost|quote|preis|цена|çmim)\b/i.test(text))
    return "pricing";
  if (/\b(interested|sounds good|let.s discuss|interessiert)\b/i.test(text))
    return "interested";
  if (/\b(not interested|too expensive|already have|no thanks)\b/i.test(text))
    return "objection";
  return text.includes("?") ? "question" : "reply";
}
