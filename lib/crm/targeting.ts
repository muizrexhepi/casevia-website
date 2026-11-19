import { domainKey } from "./policy";

export const defaultTargetProfile =
  "Owner-run, independent small businesses in North Macedonia and Switzerland: guesthouses, small boutique hotels, local tour operators and local professional service practices. Prefer one location or a small local team (roughly 1–30 people, only when supported by evidence). Seek a concrete opportunity for a clearer business website, direct enquiries/bookings, or a small workflow/dashboard matching Muiz's services. Require original-source evidence of small/independent scale and the relevant customer workflow. Do not assume an existing booking system is missing or broken. Exclude multinationals, large enterprises, banks, Big Four firms, national tourism bodies, chains/franchises, large luxury hotels, marketplaces/directories, and competing web/design agencies. Unknown size or vague service fit needs review, not automatic qualification. Never invent headcount, budget, pain points or contact permission. Fewer well-supported leads are better than filling a quota.";

export type BusinessType =
  | "independent_small_business"
  | "enterprise_or_chain"
  | "agency_competitor"
  | "directory_or_public_body"
  | "unknown";
export type FitStatus = "matched" | "review" | "excluded";
export type FitAssessment = {
  status: FitStatus;
  reason: string;
  evidenceUrl: string;
  sizeQuote: string;
  opportunityQuote: string;
  opportunityUrl?: string;
};

const enterpriseDomains = [
  "kpmg.com",
  "kpmg.ch",
  "ey.com",
  "pwc.com",
  "pwc.ch",
  "deloitte.com",
  "accenture.com",
  "mckinsey.com",
  "bcg.com",
  "ubs.com",
  "credit-suisse.com",
  "hilton.com",
  "marriott.com",
  "accor.com",
  "ihg.com",
  "hyatt.com",
  "radissonhotels.com",
  "booking.com",
  "expedia.com",
  "tripadvisor.com",
  "switzerlandtravelcentre.com",
  "myswitzerland.com",
];
export function knownEnterprise(name: string, website: string): string | null {
  let domain = "";
  try {
    domain = domainKey(website);
  } catch {
    /* Invalid URLs are rejected at ingestion. */
  }
  if (
    enterpriseDomains.some((d) => domain === d || domain.endsWith(`.${d}`)) ||
    /^(KPMG|EY|Ernst\s*(?:&|and)\s*Young|PwC|PricewaterhouseCoopers|Deloitte|Accenture|McKinsey|Hilton|Marriott|Ibis|Radisson|UBS)(?:\b|$)/i.test(
      name.trim(),
    )
  )
    return "Outside target: enterprise, chain, platform or national tourism organization.";
  return null;
}
export function coldProspect(lead: { origin: string; eligibility: string }) {
  return (
    lead.origin === "discovery" &&
    !["requested", "opted_in"].includes(lead.eligibility)
  );
}
function normalized(text: string) {
  return text.replace(/\s+/g, " ").trim().toLowerCase();
}
export function supportedQuote(quote: string, text: string) {
  return (
    quote.trim().length >= 16 && normalized(text).includes(normalized(quote))
  );
}
export function assessTarget(input: {
  name: string;
  website: string;
  businessType: BusinessType;
  reason: string;
  sizeQuote: string;
  opportunityQuote: string;
  evidenceUrl: string;
  sources: Array<{ url: string; text: string; requestedUrl?: string }>;
}): FitAssessment {
  const excluded = knownEnterprise(input.name, input.website);
  const base = { evidenceUrl: "", sizeQuote: "", opportunityQuote: "" };
  if (
    excluded ||
    [
      "enterprise_or_chain",
      "agency_competitor",
      "directory_or_public_body",
    ].includes(input.businessType)
  )
    return {
      ...base,
      status: "excluded",
      reason:
        excluded ?? "Outside the independent small-business target profile.",
    };
  const original = input.sources.find((s) =>
    supportedQuote(input.sizeQuote, s.text),
  );
  const opportunity = input.sources.find((s) =>
    supportedQuote(input.opportunityQuote, s.text),
  );
  let sameBusiness = false;
  try {
    sameBusiness = domainKey(input.website) === domainKey(input.evidenceUrl);
  } catch {
    /* No original evidence. */
  }
  if (
    input.businessType !== "independent_small_business" ||
    !original ||
    !sameBusiness ||
    domainKey(original.url) !== domainKey(input.website)
  )
    return {
      ...base,
      status: "review",
      reason:
        "Small-business scale and a relevant service opportunity need original-source evidence.",
    };
  // A model label alone is insufficient: its cited scale evidence must actually
  // describe an independent/local/small operation, with no enterprise signal.
  if (
    /global network|multinational|international chain|hundreds of (?:staff|employees)|thousands of (?:staff|employees)/i.test(
      input.sizeQuote,
    ) ||
    !/family[ -]?(?:run|owned)|by a family|our family|owner[ -]?(?:run|managed|operated)|independent|small|boutique|guesthouse|local (?:team|business|practice)|familien|inhaber|klein|familjar|семе[еј]н|мал(?:а|о|и)?\b|\b(?:[1-9]|[12][0-9]|30|one|two|three|four|five|six|seven|eight|nine|ten|twelve|sixteen|twenty|thirty)\s+(?:of us|rooms|apartments|zimmer|staff|employees|people|соби|dhoma|Mitarbeit)/i.test(
      input.sizeQuote,
    )
  )
    return {
      ...base,
      status: "review",
      reason:
        "The cited text does not establish suitable small-business scale. Review ownership and size.",
    };
  if (!opportunity || domainKey(opportunity.url) !== domainKey(input.website))
    return {
      status: "review",
      reason:
        "Independent small-business scale is verified. Research the specific service opportunity before drafting.",
      evidenceUrl: original.url,
      sizeQuote: input.sizeQuote.slice(0, 500),
      opportunityQuote: "",
    };
  return {
    status: "matched",
    reason: input.reason.slice(0, 600),
    evidenceUrl: original.url,
    sizeQuote: input.sizeQuote.slice(0, 500),
    opportunityQuote: input.opportunityQuote.slice(0, 500),
    opportunityUrl: opportunity.url,
  };
}
