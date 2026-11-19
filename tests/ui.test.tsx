import React from "react";
import { renderToString } from "react-dom/server";
import { describe, it, expect, vi } from "vitest";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import type { FunctionReturnType } from "convex/server";
import { api } from "../convex/_generated/api";
import { defaultSettings } from "../convex/defaults";
const state = vi.hoisted(() => ({
  snapshot: null as unknown,
  detail: null as unknown,
  params: "",
}));
vi.mock("convex/react", async () => {
  const { getFunctionName } = await import("convex/server");
  return {
    useConvexAuth: () => ({ isLoading: false, isAuthenticated: true }),
    useConvexConnectionState: () => ({ isWebSocketConnected: true }),
    useQuery: (ref: Parameters<typeof getFunctionName>[0]) => {
      const name = getFunctionName(ref);
      if (name === "crm:snapshot") return state.snapshot;
      if (name === "crm:detail") return state.detail;
      if (name === "jobs:budget")
        return {
          dailySpent: 0.08,
          dailyReserved: 0,
          monthlySpent: 0.08,
          monthlyReserved: 0,
        };
      if (name === "publicConfig:connection")
        return { ownerLoginConfigured: false };
      return [];
    },
    useMutation: () => async () => null,
    useAction: () => async () => null,
    usePaginatedQuery: () => ({
      results: (state.snapshot as { leads: unknown[] }).leads,
      status: "Exhausted",
      loadMore: () => null,
    }),
  };
});
vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => ({ signOut: async () => null }),
}));
vi.mock("@convex-dev/auth/methods/github/react", () => ({
  useSignInWithGithub: () => ({ signIn: async () => ({ status: "error" }) }),
  useOauth: () => ({ flowError: null }),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => null }),
  useSearchParams: () => new URLSearchParams(state.params),
}));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.ComponentProps<"a">) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
import { CrmApp } from "../components/crm/crm-app";
type Snapshot = FunctionReturnType<typeof api.crm.snapshot>;
const now = Date.now();
const lead = {
  _id: "visual-lead",
  _creationTime: now,
  name: "Controlled Test Studio",
  domain: "example.com",
  businessKey: "test|skopje",
  website: "https://example.com",
  location: "Skopje, North Macedonia",
  industry: "Professional services",
  email: "owner@example.com",
  contactName: "Test Owner",
  language: "en",
  origin: "manual",
  stage: "qualified",
  eligibility: "unknown",
  permissionEvidence: "",
  suppressed: false,
  sources: [
    {
      url: "https://example.com",
      title: "Controlled original source",
      verified: true,
      excerpt: "Isolated visual fixture. No real prospect.",
      checkedAt: now,
    },
  ],
  observations: [
    {
      text: "This is a controlled test observation.",
      kind: "verified",
      sourceUrl: "https://example.com",
    },
  ],
  score: 78,
  scoreReasons: ["Controlled evidence-backed qualification fixture"],
  suggestedService: "Web Development",
  researchAt: now,
  nextAction: "Review researched opportunity",
  notes: "Isolated test fixture",
  dealValue: 2500,
  currency: "EUR",
  collectedRevenue: 0,
  outcomeReason: "",
  createdAt: now,
  updatedAt: now,
};
const draft = {
  _id: "visual-draft",
  _creationTime: now,
  leadId: lead._id,
  kind: "outreach",
  subject: "A thought about your online booking experience",
  body: "Hello Test Owner,\n\nThis is an isolated fixture for reviewing the interface. It will never be sent.\n\nBest,\nMuiz",
  language: "en",
  provider: "prospecting",
  revision: 1,
  status: "draft",
  price: 0,
  currency: "EUR",
  scope: "",
  exclusions: "",
  nextSteps: "",
  createdAt: now,
  updatedAt: now,
};
const fixture = {
  leads: [lead],
  drafts: [draft],
  messages: [],
  jobs: [],
  settings: defaultSettings,
  notifications: [],
  activity: [
    {
      _id: "visual-activity",
      _creationTime: now,
      action: "research.completed",
      detail: "Isolated test fixture",
      actor: "system",
      leadId: lead._id,
      createdAt: now,
    },
  ],
  tasks: [],
  usage: [],
  integrations: {
    openai: false,
    github: false,
    resend: false,
    zoho: false,
    push: true,
    prospecting: false,
  },
} as unknown as Snapshot;
const css = readFileSync("app/crm/crm.css", "utf8");
describe("CRM screen rendering with isolated controlled fixtures", () => {
  for (const section of [
    "overview",
    "leads",
    "pipeline",
    "inbox",
    "automation",
    "settings",
  ]) {
    it(`renders ${section} without a runtime failure`, () => {
      state.snapshot = fixture;
      state.params = "";
      const html = renderToString(<CrmApp section={section} />);
      expect(html).toContain("crm-workspace");
      expect(html).not.toContain("Owner access required");
      mkdirSync("artifacts/crm-ui-review", { recursive: true });
      writeFileSync(
        `artifacts/crm-ui-review/${section}.html`,
        `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>CRM ${section} · Isolated visual fixture</title><style>body{margin:0;font-family:Inter,Arial,sans-serif}button{font-family:inherit;display:inline-flex;align-items:center;justify-content:center;border:1px solid #ddd}a{text-decoration:none}${css}</style></head><body><div style="background:#71539d;color:white;padding:6px 16px;font:11px system-ui;position:relative;z-index:100">ISOLATED VISUAL FIXTURE · No live data, API calls, or sending</div>${html}</body></html>`,
      );
    });
  }
  it("renders evidence, permission and outcome controls on a lead", () => {
    state.snapshot = fixture;
    state.params = "id=visual-lead";
    state.detail = {
      lead,
      drafts: [draft],
      messages: [],
      tasks: [],
      activity: [],
    };
    const html = renderToString(<CrmApp section="leads" />);
    expect(html).toContain("Source checked");
    expect(html).toContain("Evidence");
    expect(html).toContain("Edit business &amp; contact");
    state.params = "";
  });
});
