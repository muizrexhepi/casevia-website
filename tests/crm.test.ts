import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { convexTest } from "convex-test";
import authTest from "@convex-dev/auth/test";
import workpoolTest from "@convex-dev/workpool/test";
import { mutationGeneric, type FunctionReference } from "convex/server";
import { v } from "convex/values";
import { Webhook } from "svix";
import schema from "../convex/schema";
import { api, internal } from "../convex/_generated/api";
import { defaultSettings } from "../convex/defaults";
import {
  domainKey,
  sendBlock,
  reservationUsd,
  usageUsd,
} from "../lib/crm/policy";
import { publicAddress } from "../lib/crm/safe-fetch";
const modules = import.meta.glob("../convex/**/*.ts");
const seedSession = mutationGeneric({
  args: { userId: v.string() },
  returns: v.string(),
  handler: async (ctx, { userId }) =>
    ctx.db.insert("sessions", { userId, component: "authGithub" }),
});
function testBackend() {
  const t = convexTest(schema, modules);
  const auth = t.registerComponent<{
    testSeed: {
      seed: FunctionReference<"mutation", "public", { userId: string }, string>;
    };
  }>("auth", authTest.schema, {
    ...authTest.modules,
    "../component/testSeed.ts": async () => ({ seed: seedSession }),
  });
  workpoolTest.register(t, "aiPool");
  workpoolTest.register(t, "emailPool");
  return { t, auth };
}
const input = {
  name: "Controlled Test Studio",
  website: "https://example.com",
  location: "Skopje",
  industry: "Design",
  email: "owner@example.com",
  contactName: "Owner",
  language: "en" as const,
  notes: "Controlled test fixture",
};
async function setup() {
  const { t, auth } = testBackend();
  const ownerId = await t.run((ctx) =>
    ctx.db.insert("users", {
      githubId: "90201782",
      name: "Muiz",
      role: "owner",
    }),
  );
  const session = await t.mutation(auth.testSeed.seed, { userId: ownerId });
  const owner = t.withIdentity({ subject: session });
  return { t, owner, ownerId };
}
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-19T11:00:00Z"));
  vi.stubEnv("CRM_OWNER_GITHUB_ID", "90201782");
  vi.stubEnv("OPENAI_ORG_ID", "org-test");
  vi.stubEnv("OPENAI_API_KEY", "test-not-a-real-key");
  vi.stubEnv("RESEND_API_KEY", "test-not-a-real-key");
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.useRealTimers();
});
describe("Zoho synchronization recovery", () => {
  it("reuses valid provider tokens internally without exposing them through status", async () => {
    const { t, owner } = await setup();
    await t.mutation(internal.integrations.cacheToken, {
      key: "zoho:test",
      value: "private-test-token",
      expiresAt: Date.now() + 3600000,
    });
    expect(
      await t.query(internal.integrations.cachedToken, {
        key: "zoho:test",
        now: Date.now(),
      }),
    ).toEqual({ value: "private-test-token" });
    expect(
      JSON.stringify(await owner.query(api.integrations.status, {})),
    ).not.toContain("private-test-token");
    expect(
      await t.query(internal.integrations.cachedToken, {
        key: "zoho:test",
        now: Date.now() + 3600000,
      }),
    ).toBeNull();
  });
  it("keeps its completed watermark across pages and rejects overlapping or stale workers", async () => {
    const { t } = testBackend();
    await t.mutation(internal.integrations.checkpoint, {
      key: "zoho",
      cursor: "1",
      error: "",
    });
    const before = await t.query(internal.integrations.cursor, { key: "zoho" });
    expect(
      await t.mutation(internal.integrations.acquireZoho, { token: "first" }),
    ).toBe(true);
    expect(
      await t.mutation(internal.integrations.acquireZoho, { token: "second" }),
    ).toBe(false);
    await t.mutation(internal.integrations.checkpoint, {
      key: "zoho",
      cursor: "126",
      error: "",
      completed: false,
      leaseToken: "stale",
    });
    expect(
      (await t.query(internal.integrations.cursor, { key: "zoho" }))?.cursor,
    ).toBe("1");
    vi.advanceTimersByTime(60000);
    await t.mutation(internal.integrations.checkpoint, {
      key: "zoho",
      cursor: "26",
      error: "",
      completed: false,
      leaseToken: "first",
    });
    const after = await t.query(internal.integrations.cursor, { key: "zoho" });
    expect(after?.cursor).toBe("26");
    expect(after?.lastSuccess).toBe(before?.lastSuccess);
    expect(
      await t.mutation(internal.integrations.acquireZoho, { token: "next" }),
    ).toBe(true);
  });
  it("bounds automatic mailbox retries and allows explicit recovery", async () => {
    const { t } = testBackend();
    for (let i = 0; i < 5; i++) {
      expect(
        await t.mutation(internal.integrations.acquireZoho, {
          token: String(i),
        }),
      ).toBe(true);
      await t.mutation(internal.integrations.checkpoint, {
        key: "zoho",
        cursor: "51",
        error: "Read failed",
        completed: false,
        leaseToken: String(i),
      });
      expect(
        await t.mutation(internal.integrations.acquireZoho, {
          token: "too-soon",
        }),
      ).toBe(false);
      vi.advanceTimersByTime(3600001);
    }
    expect(
      await t.mutation(internal.integrations.acquireZoho, {
        token: "automatic",
      }),
    ).toBe(false);
    expect(
      await t.mutation(internal.integrations.acquireZoho, {
        token: "owner-retry",
        force: true,
      }),
    ).toBe(true);
    expect(
      (await t.query(internal.integrations.cursor, { key: "zoho" }))?.cursor,
    ).toBe("51");
  });
});
describe("owner authorization", () => {
  it("rejects anonymous reads and writes", async () => {
    const { t } = testBackend();
    await expect(
      t.query(api.crm.snapshot, { month: "2026-11" }),
    ).rejects.toThrow("Sign in required");
    await expect(t.mutation(api.crm.createLead, input)).rejects.toThrow(
      "Sign in required",
    );
  });
  it("rejects a valid non-owner session", async () => {
    const { t, auth } = testBackend();
    const id = await t.run((ctx) =>
      ctx.db.insert("users", {
        githubId: "someone-else",
        name: "Other",
        role: "owner",
      }),
    );
    const session = await t.mutation(auth.testSeed.seed, { userId: id });
    await expect(
      t
        .withIdentity({ subject: session })
        .query(api.crm.snapshot, { month: "2026-11" }),
    ).rejects.toThrow("Owner access required");
  });
  it("pins GitHub account creation to the configured immutable ID", async () => {
    const { t } = testBackend();
    await expect(
      t.mutation(internal.users.createOwner, {
        method: {
          name: "github",
          profile: {
            id: "attacker",
            login: "muizrexhepi",
            emailVerified: true,
          },
        },
      }),
    ).rejects.toThrow("Owner access required");
  });
});
describe("leads, permissions and outcomes", () => {
  it("deduplicates businesses by normalized domain and contacts by email", async () => {
    const { t, owner } = await setup();
    const a = await owner.mutation(api.crm.createLead, input);
    const b = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "Different name",
      website: "https://www.example.com/contact",
      email: "other@example.com",
    });
    const c = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "Another",
      website: "https://different.example",
      email: "OWNER@example.com",
    });
    expect(b.id).toEqual(a.id);
    expect(c.id).toEqual(a.id);
    expect((await t.run((ctx) => ctx.db.query("leads").take(20))).length).toBe(
      1,
    );
  });
  it("keeps public contact details in unknown eligibility until evidence is recorded", async () => {
    const { owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, input);
    await expect(
      owner.mutation(api.crm.updateLead, { id, eligibility: "opted_in" }),
    ).rejects.toThrow("permission basis");
    await owner.mutation(api.crm.updateLead, {
      id,
      eligibility: "opted_in",
      permissionEvidence: "Owner-controlled test opt-in",
    });
    expect((await owner.query(api.crm.detail, { id })).lead.eligibility).toBe(
      "opted_in",
    );
  });
  it("requires won-deal evidence and keeps deal value separate from collected revenue", async () => {
    const { owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, input);
    await expect(
      owner.mutation(api.crm.updateLead, { id, stage: "won" }),
    ).rejects.toThrow("evidence");
    await owner.mutation(api.crm.updateLead, {
      id,
      stage: "proposal",
      dealValue: 5000,
    });
    const { lead } = await owner.query(api.crm.detail, { id });
    expect(lead.collectedRevenue).toBe(0);
  });
});
async function approvedFixture() {
  const { t, owner, ownerId } = await setup();
  await owner.mutation(api.crm.saveSettings, {
    settings: { ...defaultSettings, paused: false },
  });
  const { id } = await owner.mutation(api.crm.createLead, input);
  await owner.mutation(api.crm.updateLead, {
    id,
    eligibility: "requested",
    permissionEvidence: "Controlled test inquiry",
  });
  const draft = await owner.mutation(api.outbound.createDraft, {
    leadId: id,
    kind: "reply",
    subject: "Controlled test",
    body: "Test only",
  });
  return { t, owner, ownerId, id, draft };
}
describe("approval and duplicate-send prevention", () => {
  it("requires saved revision approval and invalidates it on editing", async () => {
    const { owner, draft } = await approvedFixture();
    await expect(
      owner.mutation(api.outbound.queueSend, { id: draft }),
    ).rejects.toThrow("approval");
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    await owner.mutation(api.outbound.editDraft, {
      id: draft,
      subject: "Changed",
      body: "Changed",
      price: 0,
      currency: "EUR",
      scope: "",
      exclusions: "",
      nextSteps: "",
      provider: "resend",
    });
    await expect(
      owner.mutation(api.outbound.queueSend, { id: draft }),
    ).rejects.toThrow("approval");
  });
  it("persists exactly one send intent for repeated queue calls", async () => {
    const { t, owner, draft } = await approvedFixture();
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    const a = await owner.mutation(api.outbound.queueSend, { id: draft }),
      b = await owner.mutation(api.outbound.queueSend, { id: draft });
    expect(a).toBe(b);
    expect(
      (await t.run((ctx) => ctx.db.query("sendIntents").take(20))).length,
    ).toBe(1);
  });
  it("rechecks pause immediately before worker claim", async () => {
    const { t, owner, draft } = await approvedFixture();
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    const intent = await owner.mutation(api.outbound.queueSend, { id: draft });
    await owner.mutation(api.crm.pause, { paused: true });
    expect(
      await t.mutation(internal.outbound.claim, { intentId: intent }),
    ).toBeNull();
    expect((await t.run((ctx) => ctx.db.get(intent)))?.state).toBe("cancelled");
  });
  it("blocks Resend for unknown and prospecting recipients regardless of owner approval", () => {
    const base = {
      paused: false,
      approved: true,
      suppressed: false,
      eligibility: "unknown" as const,
      provider: "resend" as const,
      configured: true,
      authorized: true,
      replied: false,
      followup: false,
    };
    expect(sendBlock(base)).toMatch(/Resend/);
    expect(sendBlock({ ...base, eligibility: "prospecting_eligible" })).toMatch(
      /Resend/,
    );
    expect(
      sendBlock({
        ...base,
        provider: "prospecting",
        eligibility: "prospecting_eligible",
        configured: false,
      }),
    ).toMatch(/disconnected/);
  });
  it("stops queued sends and follow-ups on a reply or suppression", async () => {
    const { t, owner, id, draft } = await approvedFixture();
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    const intent = await owner.mutation(api.outbound.queueSend, { id: draft });
    const task = await owner.mutation(api.crm.saveTask, {
      leadId: id,
      title: "Follow up",
      kind: "followup",
      dueAt: Date.now() + 86400000,
    });
    await owner.mutation(api.crm.logReply, {
      leadId: id,
      subject: "Re: test",
      body: "Please unsubscribe and remove me",
      providerId: "reply-1",
    });
    expect((await t.run((ctx) => ctx.db.get(intent)))?.state).toBe("cancelled");
    expect((await t.run((ctx) => ctx.db.get(task)))?.cancelled).toBe(true);
    expect((await owner.query(api.crm.detail, { id })).lead.suppressed).toBe(
      true,
    );
    await owner.mutation(api.crm.logReply, {
      leadId: id,
      subject: "Re: test",
      body: "Duplicate",
      providerId: "reply-1",
    });
    expect(
      (await t.run((ctx) => ctx.db.query("messages").take(20))).length,
    ).toBe(1);
  });
});
describe("atomic spending accounting", () => {
  it("reserves Luna search costs atomically and pins queued jobs to their reserved model", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: {
        ...defaultSettings,
        model: "gpt-6-luna",
        dailyLimit: 0.3,
        monthlyLimit: 30,
      },
    });
    const attempts = await Promise.allSettled([
      owner.mutation(api.jobs.enqueue, {
        kind: "discovery",
        query: "First controlled fixture",
      }),
      owner.mutation(api.jobs.enqueue, {
        kind: "discovery",
        query: "Second controlled fixture",
      }),
    ]);
    expect(attempts.filter((a) => a.status === "fulfilled")).toHaveLength(1);
    const jobs = await t.run((ctx) => ctx.db.query("jobs").take(5));
    expect(jobs).toHaveLength(1);
    expect(jobs[0].reservation).toBe(0.25);
    await owner.mutation(api.crm.saveSettings, {
      settings: {
        ...defaultSettings,
        model: "gpt-6.2-sol",
        dailyLimit: 5,
        monthlyLimit: 30,
      },
    });
    expect(
      (await t.query(internal.jobs.context, { jobId: jobs[0]._id })).settings
        .model,
    ).toBe("gpt-6-luna");
    expect(
      (
        await owner.query(api.jobs.budget, {
          day: "2026-11-19",
          month: "2026-11",
        })
      ).dailyReserved,
    ).toBe(0.25);
    expect(usageUsd("gpt-6-luna", 1000, 500, 2)).toBeCloseTo(0.02035);
  });
  it("rejects new Astra configuration and legacy Astra job scheduling before reserving money", async () => {
    const { t, owner } = await setup();
    const settings = { ...defaultSettings, model: "gpt-6.2-astra" as const };
    await expect(
      owner.mutation(api.crm.saveSettings, { settings }),
    ).rejects.toThrow("Astra is disabled");
    await t.run((ctx) => ctx.db.insert("settings", settings));
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "discovery" }),
    ).rejects.toThrow("Astra is disabled");
    expect(
      (
        await owner.query(api.jobs.budget, {
          day: "2026-11-19",
          month: "2026-11",
        })
      ).dailyReserved,
    ).toBe(0);
  });
  it("reserves model and search costs before enqueue, including concurrent jobs", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: {
        ...defaultSettings,
        model: "gpt-6.2-sol",
        dailyLimit: 5,
        monthlyLimit: 30,
      },
    });
    const first = await owner.mutation(api.jobs.enqueue, {
      kind: "discovery",
      query: "Controlled fixture",
    });
    await expect(
      owner.mutation(api.jobs.enqueue, {
        kind: "discovery",
        query: "Another fixture",
      }),
    ).rejects.toThrow("Spending limit");
    const b = await owner.query(api.jobs.budget, {
      day: "2026-11-19",
      month: "2026-11",
    });
    expect(b.dailyReserved).toBe(reservationUsd("gpt-6.2-sol", true));
    expect((await t.run((ctx) => ctx.db.get(first)))?.state).toBe("queued");
  });
  it("settles once and keeps uncertain reservations held", async () => {
    const { t, owner } = await setup();
    const id = await owner.mutation(api.jobs.enqueue, { kind: "discovery" });
    const result = {
      jobId: id,
      estimated: 0.027,
      inputTokens: 1000,
      outputTokens: 500,
      searchCalls: 2,
      responseId: "resp_test",
      uncertain: false,
    };
    await t.mutation(internal.jobs.settle, { ...result, uncertain: true });
    expect(
      (
        await owner.query(api.jobs.budget, {
          day: "2026-11-19",
          month: "2026-11",
        })
      ).dailyReserved,
    ).toBeGreaterThan(0);
    await t.mutation(internal.jobs.settle, result);
    await t.mutation(internal.jobs.settle, result);
    const b = await owner.query(api.jobs.budget, {
      day: "2026-11-19",
      month: "2026-11",
    });
    expect(b.dailyReserved).toBe(0);
    expect(b.dailySpent).toBe(0.027);
    expect(usageUsd("gpt-6.2-sol", 1000, 500, 2)).toBe(0.027);
  });
  it("blocks discovery when credentials are missing without spending reservations", async () => {
    vi.stubEnv("OPENAI_API_KEY", "");
    const { owner } = await setup();
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "discovery" }),
    ).rejects.toThrow("OpenAI key");
    expect(
      (
        await owner.query(api.jobs.budget, {
          day: "2026-11-19",
          month: "2026-11",
        })
      ).dailyReserved,
    ).toBe(0);
  });
});
describe("approval-first automation", () => {
  it("holds high-scoring small businesses when the service opportunity is only a weak hypothesis", async () => {
    const { t, owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, {
      ...input,
      website: "https://small.test/",
    });
    await t.run((ctx) =>
      ctx.db.patch(id, { origin: "discovery", stage: "qualified" }),
    );
    const research = {
      leadId: id,
      hash: "fixture",
      contacts: [],
      sources: [],
      observations: [],
      score: 95,
      reasons: ["A model gave a high overall score"],
      service: "Website",
      nextAction: "Review evidence",
      targetFit: {
        status: "matched" as const,
        reason: "Small business",
        evidenceUrl: "https://small.test/",
        sizeQuote: "Our family-run guesthouse has eight rooms.",
        opportunityQuote: "We offer tours and accommodation.",
      },
    };
    const oldDraft = await owner.mutation(api.outbound.createDraft, {
      leadId: id,
      kind: "outreach",
      subject: "Old broad targeting",
      body: "Controlled legacy draft",
    });
    await t.mutation(internal.jobs.saveResearch, {
      ...research,
      opportunityScore: 10,
    });
    expect((await t.run((ctx) => ctx.db.get(oldDraft)))?.status).toBe(
      "cancelled",
    );
    expect(await t.run((ctx) => ctx.db.get(id))).toMatchObject({
      stage: "researching",
      excluded: true,
      score: 60,
      opportunityScore: 10,
      targetFit: { status: "review" },
    });
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "draft", leadId: id }),
    ).rejects.toThrow("Verify small-business fit");
    await t.mutation(internal.jobs.saveResearch, {
      ...research,
      opportunityScore: 25,
    });
    expect(await t.run((ctx) => ctx.db.get(id))).toMatchObject({
      stage: "qualified",
      opportunityScore: 25,
      targetFit: { status: "matched" },
    });
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "draft", leadId: id }),
    ).resolves.toBeTruthy();
  });
  it("researches verified small businesses automatically while still blocking drafts until service fit is established", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, autoResearch: true, autoDraft: true },
    });
    await t.mutation(internal.jobs.saveDiscovered, {
      rows: [
        {
          name: "Tiny Guesthouse",
          website: "https://tiny.test/",
          location: "Skopje",
          industry: "Guesthouse",
          sourceUrl: "https://tiny.test/",
          targetFit: {
            status: "review",
            reason: "Small scale verified; research the service opportunity",
            evidenceUrl: "https://tiny.test/",
            sizeQuote: "Our family-run guesthouse has eight rooms.",
            opportunityQuote: "",
          },
        },
      ],
    });
    const [lead] = (await owner.query(api.crm.snapshot, { month: "2026-11" }))
      .leads;
    expect(lead.excluded).toBeUndefined();
    await t.mutation(internal.automation.tick, {});
    const jobs = await t.run((ctx) => ctx.db.query("jobs").take(5));
    expect(jobs.map((j) => j.kind)).toEqual(["research"]);
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "draft", leadId: lead._id }),
    ).rejects.toThrow("Verify small-business fit");
  });
  it("screens enterprise discoveries before spending and continues beyond a full excluded page", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, autoResearch: true },
    });
    for (let i = 0; i < 21; i++) {
      const { id } = await owner.mutation(api.crm.createLead, {
        ...input,
        name: `KPMG office ${i}`,
        website: `https://office${i}.kpmg.com`,
        email: "",
      });
      await t.run((ctx) => ctx.db.patch(id, { origin: "discovery" }));
    }
    const fresh = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "Small Guesthouse",
      website: "https://guesthouse.test",
      email: "",
    });
    await t.mutation(internal.automation.tick, {});
    await t.mutation(internal.automation.tick, {});
    const jobs = await t.run((ctx) => ctx.db.query("jobs").take(30));
    expect(jobs).toHaveLength(1);
    expect(jobs[0].leadId).toBe(fresh.id);
    const snapshot = await owner.query(api.crm.snapshot, { month: "2026-11" });
    expect(snapshot.leads).toHaveLength(1);
    const archive = await owner.query(api.crm.listLeads, {
      includeExcluded: true,
      paginationOpts: { numItems: 50, cursor: null },
    });
    expect(archive.page).toHaveLength(22);
    const active = await owner.query(api.crm.listLeads, {
      paginationOpts: { numItems: 50, cursor: null },
    });
    expect(active.page).toHaveLength(1);
    expect(
      (
        await owner.query(api.jobs.budget, {
          day: "2026-11-19",
          month: "2026-11",
        })
      ).dailyReserved,
    ).toBe(0.25);
  });
  it("keeps evidence-supported prospects active, holds uncertain candidates and refuses enterprise ingestion", async () => {
    const { t, owner } = await setup();
    const targetFit = {
      status: "matched" as const,
      reason: "Verified small independent guesthouse and enquiry flow",
      evidenceUrl: "https://guesthouse.test/about",
      sizeQuote: "Our family-run guesthouse has eight rooms.",
      opportunityQuote: "Call or email us for booking enquiries.",
    };
    const row = {
      name: "Local Guesthouse",
      website: "https://guesthouse.test",
      location: "Skopje, North Macedonia",
      industry: "Guesthouse",
      sourceUrl: "https://guesthouse.test/about",
      targetFit,
    };
    expect(
      await t.mutation(internal.jobs.saveDiscovered, {
        rows: [
          row,
          { ...row, name: "KPMG Switzerland", website: "https://kpmg.com" },
          {
            ...row,
            name: "Uncertain Lodge",
            website: "https://uncertain.test",
            targetFit: { ...targetFit, status: "review", sizeQuote: "" },
          },
        ],
      }),
    ).toBe(2);
    expect(
      (await owner.query(api.crm.snapshot, { month: "2026-11" })).leads.map(
        (l) => l.name,
      ),
    ).toEqual(["Local Guesthouse"]);
    const all = await owner.query(api.crm.listLeads, {
      includeExcluded: true,
      paginationOpts: { numItems: 50, cursor: null },
    });
    const uncertain = all.page.find((l) => l.name === "Uncertain Lodge")!;
    await expect(
      owner.mutation(api.jobs.enqueue, {
        kind: "draft",
        leadId: uncertain._id,
      }),
    ).rejects.toThrow("Verify small-business fit");
    expect(
      await t.run((ctx) => ctx.db.query("sendIntents").take(5)),
    ).toHaveLength(0);
  });
  it("prevents high model scores from qualifying enterprises and preserves requested conversations", async () => {
    const { t, owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "EY Switzerland",
      website: "https://ey.com",
      email: "",
    });
    await t.run((ctx) => ctx.db.patch(id, { origin: "discovery" }));
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "research", leadId: id }),
    ).rejects.toThrow("outside your target profile");
    await t.mutation(internal.jobs.saveResearch, {
      leadId: id,
      hash: "test",
      contacts: [],
      sources: [],
      observations: [],
      score: 99,
      reasons: ["Model claims fit"],
      service: "Website",
      nextAction: "Review",
      targetFit: {
        status: "matched",
        reason: "Incorrect model label",
        evidenceUrl: "https://ey.com",
        sizeQuote: "",
        opportunityQuote: "",
      },
    });
    const lead = await t.run((ctx) => ctx.db.get(id));
    expect(lead).toMatchObject({
      excluded: true,
      score: 45,
      targetFit: { status: "excluded" },
    });
    await owner.mutation(api.crm.updateLead, {
      id,
      eligibility: "requested",
      permissionEvidence: "Controlled requested project conversation",
    });
    expect(
      (await owner.query(api.crm.snapshot, { month: "2026-11" })).leads,
    ).toHaveLength(1);
    await expect(
      owner.mutation(api.jobs.enqueue, { kind: "research", leadId: id }),
    ).resolves.toBeTruthy();
  });
  it("recovers definite oversized-source failures once within budget and never retries uncertain work", async () => {
    const { t, owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, input);
    const failed = await t.run((ctx) =>
      ctx.db.insert("jobs", {
        kind: "research",
        leadId: id,
        state: "failed",
        error: "Original source is too large",
        attempt: 1,
        query: "",
        reservation: 0,
        createdAt: Date.now(),
      }),
    );
    await t.run((ctx) =>
      ctx.db.insert("jobs", {
        kind: "discovery",
        state: "uncertain",
        error: "Original source is too large",
        attempt: 1,
        query: "",
        reservation: 0,
        createdAt: Date.now(),
      }),
    );
    expect(await t.mutation(internal.jobs.retryOversizedSources, {})).toEqual({
      queued: 1,
      excluded: 0,
    });
    expect(await t.mutation(internal.jobs.retryOversizedSources, {})).toEqual({
      queued: 0,
      excluded: 0,
    });
    expect(
      (await t.run((ctx) => ctx.db.get(failed)))?.retriedByJobId,
    ).toBeTruthy();
    expect(
      await t.run((ctx) =>
        ctx.db
          .query("jobs")
          .withIndex("by_state", (q) => q.eq("state", "uncertain"))
          .take(5),
      ),
    ).toHaveLength(1);
  });
  it("restores an excluded discovery when the business requests a project conversation", async () => {
    const { t, owner } = await setup();
    const { id } = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "KPMG Switzerland",
      website: "https://kpmg.com",
    });
    await t.run((ctx) => ctx.db.patch(id, { origin: "discovery" }));
    await t.mutation(internal.targeting.screenExisting, {
      paginationOpts: { numItems: 50, cursor: null },
    });
    expect(
      (await owner.query(api.crm.snapshot, { month: "2026-11" })).leads,
    ).toHaveLength(0);
    await t.mutation(internal.crm.captureInquiry, {
      key: "enterprise-inquiry",
      name: "Controlled owner",
      email: input.email,
      company: "KPMG Switzerland",
      projectType: "Website",
      budget: "Not approved",
      message: "Please discuss this requested project.",
    });
    const lead = await t.run((ctx) => ctx.db.get(id));
    expect(lead?.eligibility).toBe("requested");
    expect(lead?.excluded).toBeUndefined();
    expect(
      (await owner.query(api.crm.snapshot, { month: "2026-11" })).leads,
    ).toHaveLength(1);
  });
  it("moves past a full page of legacy research rows and excludes known domains from discovery", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, autoResearch: true, paused: true },
    });
    for (let i = 0; i < 20; i++) {
      const { id } = await owner.mutation(api.crm.createLead, {
        ...input,
        name: `Legacy ${i}`,
        website: `https://legacy${i}.example.com`,
        email: `legacy${i}@example.com`,
      });
      await t.run((ctx) =>
        ctx.db.insert("jobs", {
          kind: "research",
          leadId: id,
          state: "complete",
          error: "",
          attempt: 1,
          query: "",
          reservation: 0,
          createdAt: Date.now(),
          finishedAt: Date.now(),
        }),
      );
    }
    const fresh = await owner.mutation(api.crm.createLead, {
      ...input,
      website: "https://fresh.example.org",
      email: "fresh@example.org",
    });
    await t.mutation(internal.automation.tick, {});
    await t.mutation(internal.automation.tick, {});
    expect((await t.run((ctx) => ctx.db.get(fresh.id)))?.stage).toBe(
      "researching",
    );
    expect(
      await t.run((ctx) =>
        ctx.db
          .query("jobs")
          .withIndex("by_leadId", (q) => q.eq("leadId", fresh.id))
          .take(5),
      ),
    ).toHaveLength(1);
    const discovery = await owner.mutation(api.jobs.enqueue, {
      kind: "discovery",
    });
    const context = await t.query(internal.jobs.context, { jobId: discovery });
    expect(context.existingDomains).toContain("fresh.example.org");
    expect(context.existingDomains).toHaveLength(21);
  });
  it("prepares eligible prospecting follow-ups without requiring or enabling outbound delivery", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: {
        ...defaultSettings,
        autoEligibleFollowups: true,
        paused: true,
      },
    });
    const { id } = await owner.mutation(api.crm.createLead, input);
    await owner.mutation(api.crm.updateLead, {
      id,
      eligibility: "prospecting_eligible",
      permissionEvidence:
        "Controlled fixture with explicit eligibility evidence",
    });
    await owner.mutation(api.crm.saveTask, {
      leadId: id,
      title: "Follow up",
      kind: "followup",
      dueAt: Date.now() - 1000,
    });
    await t.mutation(internal.automation.tick, {});
    const drafts = await t.run((ctx) => ctx.db.query("drafts").take(5));
    expect(drafts).toHaveLength(1);
    expect(drafts[0]).toMatchObject({
      kind: "followup",
      provider: "prospecting",
      status: "draft",
    });
    expect(
      await t.run((ctx) => ctx.db.query("sendIntents").take(5)),
    ).toHaveLength(0);
  });
  it("automatically queues only the exact approved messages and does not queue duplicates", async () => {
    const { t, owner, id, draft } = await approvedFixture();
    const unapproved = await owner.mutation(api.outbound.createDraft, {
      leadId: id,
      kind: "reply",
      subject: "Needs review",
      body: "Unapproved controlled fixture",
    });
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, paused: false, autoSendApproved: true },
    });
    await t.mutation(internal.automation.tick, {});
    await t.mutation(internal.automation.tick, {});
    const intents = await t.run((ctx) => ctx.db.query("sendIntents").take(5));
    expect(intents).toHaveLength(1);
    expect(intents[0].draftId).toBe(draft);
    expect((await t.run((ctx) => ctx.db.get(unapproved)))?.status).toBe(
      "draft",
    );
  });
  it("queues discovery, research and qualified drafts with limits while sending stays paused", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: {
        ...defaultSettings,
        autoDiscovery: true,
        autoResearch: true,
        autoDraft: true,
        paused: true,
        autoSendApproved: false,
        markets: ["North Macedonia", "Switzerland"],
      },
    });
    await owner.mutation(api.crm.createLead, input);
    const qualified = await owner.mutation(api.crm.createLead, {
      ...input,
      name: "Second controlled fixture",
      email: "second@example.org",
      website: "https://example.org",
    });
    await t.run((ctx) => ctx.db.patch(qualified.id, { stage: "qualified" }));
    await t.mutation(internal.automation.tick, {});
    const jobs = await t.run((ctx) => ctx.db.query("jobs").take(10));
    expect(jobs.map((j) => j.kind).sort()).toEqual([
      "discovery",
      "draft",
      "research",
    ]);
    expect(jobs.find((j) => j.kind === "discovery")?.query).toContain(
      "North Macedonia, Switzerland",
    );
    expect(
      await t.run((ctx) => ctx.db.query("sendIntents").take(5)),
    ).toHaveLength(0);
    const config = await t.run((ctx) => ctx.db.query("settings").first());
    expect(config?.paused).toBe(true);
    expect(config?.autoSendApproved).toBe(false);
    const budget = await owner.query(api.jobs.budget, {
      day: "2026-11-19",
      month: "2026-11",
    });
    expect(budget.dailyReserved).toBeCloseTo(0.52);
  });
});
describe("signed webhook processing", () => {
  it("rejects invalid signatures and deduplicates valid delivery events", async () => {
    const { t, owner, id } = await approvedFixture();
    const message = await t.run((ctx) =>
      ctx.db.insert("messages", {
        leadId: id,
        direction: "outbound",
        subject: "Test",
        body: "Test",
        from: "owner@example.com",
        to: input.email,
        provider: "resend",
        providerId: "mail-test",
        threadId: "test",
        internetMessageId: "",
        inReplyTo: "",
        classification: "reply",
        summary: "Test",
        receivedAt: Date.now(),
        delivery: "sent",
      }),
    );
    const secret =
      "whsec_" +
      Buffer.from("controlled-test-signing-key-32bytes").toString("base64");
    vi.stubEnv("RESEND_WEBHOOK_SECRET", secret);
    const body = JSON.stringify({
        type: "email.bounced",
        created_at: new Date().toISOString(),
        data: { email_id: "mail-test" },
      }),
      timestamp = String(Math.floor(Date.now() / 1000)),
      eventId = "evt-test";
    expect(
      await t.action(internal.webhooks.resend, {
        body,
        id: eventId,
        timestamp,
        signature: "bad",
      }),
    ).toBe(false);
    const signature = new Webhook(secret).sign(
      eventId,
      new Date(Number(timestamp) * 1000),
      body,
    );
    expect(
      await t.action(internal.webhooks.resend, {
        body,
        id: eventId,
        timestamp,
        signature,
      }),
    ).toBe(true);
    expect(
      await t.action(internal.webhooks.resend, {
        body,
        id: eventId,
        timestamp,
        signature,
      }),
    ).toBe(true);
    expect((await t.run((ctx) => ctx.db.query("events").take(20))).length).toBe(
      1,
    );
    expect((await t.run((ctx) => ctx.db.get(message)))?.delivery).toBe(
      "email.bounced",
    );
    expect((await owner.query(api.crm.detail, { id })).lead.suppressed).toBe(
      true,
    );
  });
  it("rejects unsigned website capture and captures a signed inquiry once", async () => {
    const { t } = testBackend();
    const body = JSON.stringify({
      key: "inquiry-test",
      name: "Test Owner",
      email: input.email,
      company: input.name,
      projectType: "Custom software",
      budget: "Unknown",
      message: "A controlled project inquiry.",
    });
    expect((await t.fetch("/inquiry", { method: "POST", body })).status).toBe(
      403,
    );
    vi.stubEnv("CRM_CAPTURE_SECRET", "test-capture-secret");
    const { createHmac } = await import("node:crypto"),
      timestamp = String(Date.now()),
      signature = createHmac("sha256", "test-capture-secret")
        .update(`${timestamp}.${body}`)
        .digest("hex");
    const headers = {
      "x-crm-timestamp": timestamp,
      "x-crm-signature": signature,
    };
    expect(
      (await t.fetch("/inquiry", { method: "POST", body, headers })).status,
    ).toBe(200);
    expect(
      (await t.fetch("/inquiry", { method: "POST", body, headers })).status,
    ).toBe(200);
    const leads = await t.run((ctx) => ctx.db.query("leads").take(10));
    expect(leads).toHaveLength(1);
    expect(leads[0].eligibility).toBe("requested");
    expect(
      await t.run((ctx) => ctx.db.query("messages").take(10)),
    ).toHaveLength(1);
  });
});
describe("untrusted source protection", () => {
  it("normalizes domains and blocks private addresses", () => {
    expect(domainKey("https://www.Example.com/contact")).toBe("example.com");
    for (const ip of [
      "127.0.0.1",
      "10.1.2.3",
      "169.254.169.254",
      "192.168.1.1",
      "::1",
      "::ffff:127.0.0.1",
      "fc00::1",
    ])
      expect(publicAddress(ip)).toBe(false);
    expect(publicAddress("8.8.8.8")).toBe(true);
  });
});
describe("complete persisted sales workflow with controlled provider results", () => {
  it("moves from inquiry through research, approval, sent message, reply, proposal, and explicit outcome", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, paused: false },
    });
    const id = await t.mutation(internal.crm.captureInquiry, {
      key: "controlled-e2e",
      name: "Test Owner",
      email: input.email,
      company: input.name,
      projectType: "Web Development",
      budget: "Owner controlled",
      message: "Please discuss my project with me.",
    });
    await t.mutation(internal.jobs.saveResearch, {
      leadId: id,
      hash: "controlled-source-hash",
      contacts: [],
      sources: [
        {
          url: "https://example.com",
          title: "Controlled original",
          verified: true,
          excerpt: "Controlled business evidence",
          checkedAt: Date.now(),
        },
      ],
      observations: [
        {
          text: "Controlled observed fact",
          kind: "verified",
          sourceUrl: "https://example.com",
        },
      ],
      score: 80,
      reasons: ["Supported by controlled evidence"],
      service: "Web Development",
      nextAction: "Draft project response",
    });
    const draft = await owner.mutation(api.outbound.createDraft, {
      leadId: id,
      kind: "reply",
      subject: "Your requested project conversation",
      body: "Owner-controlled test response.",
    });
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    const intent = await owner.mutation(api.outbound.queueSend, { id: draft });
    expect(
      await t.mutation(internal.outbound.claim, { intentId: intent }),
    ).not.toBeNull();
    await t.mutation(internal.outbound.result, {
      intentId: intent,
      state: "sent",
      providerId: "controlled-provider-id",
      error: "",
    });
    await owner.mutation(api.crm.logReply, {
      leadId: id,
      body: "Interested, sounds good. Let’s discuss.",
      subject: "Re: your project",
      providerId: "controlled-reply-id",
    });
    let detail = await owner.query(api.crm.detail, { id });
    expect(detail.lead.stage).toBe("interested");
    expect(detail.lead.stage).not.toBe("won");
    const proposal = await owner.mutation(api.outbound.createDraft, {
      leadId: id,
      kind: "proposal",
      subject: "Project scope for your approval",
      body: "Controlled proposal",
    });
    await owner.mutation(api.outbound.editDraft, {
      id: proposal,
      subject: "Project scope",
      body: "Controlled scope for review",
      price: 2500,
      currency: "EUR",
      scope: "Agreed scope",
      exclusions: "Hosting excluded",
      nextSteps: "Owner review",
      provider: "resend",
    });
    await owner.mutation(api.outbound.decide, { id: proposal, approve: true });
    await owner.mutation(api.crm.updateLead, {
      id,
      stage: "proposal",
      dealValue: 2500,
    });
    detail = await owner.query(api.crm.detail, { id });
    expect(detail.lead.collectedRevenue).toBe(0);
    await owner.mutation(api.crm.updateLead, {
      id,
      stage: "won",
      outcomeReason: "Controlled signed acceptance fixture",
      collectedRevenue: 1000,
    });
    detail = await owner.query(api.crm.detail, { id });
    expect(detail.lead.stage).toBe("won");
    expect(detail.lead.collectedRevenue).toBe(1000);
    expect(
      detail.messages.filter((m) => m.direction === "outbound"),
    ).toHaveLength(1);
  });
  it("resets permissions and approval if the recipient changes", async () => {
    const { owner, draft, id } = await approvedFixture();
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    await owner.mutation(api.crm.editBusiness, {
      ...input,
      id,
      email: "another-owner@example.com",
    });
    const detail = await owner.query(api.crm.detail, { id });
    expect(detail.lead.eligibility).toBe("unknown");
    expect(detail.drafts[0].approvedBy).toBeUndefined();
    await expect(
      owner.mutation(api.outbound.queueSend, { id: draft }),
    ).rejects.toThrow("approval");
  });
});
describe("delivery ordering and approval recovery", () => {
  it("applies a delivery event that arrives before send completion is persisted", async () => {
    const { t, owner, id, draft } = await approvedFixture();
    await owner.mutation(api.outbound.decide, { id: draft, approve: true });
    const intent = await owner.mutation(api.outbound.queueSend, { id: draft });
    await t.mutation(internal.outbound.claim, { intentId: intent });
    await t.mutation(internal.integrations.deliveryEvent, {
      eventId: "early-bounce",
      type: "email.bounced",
      messageId: "early-provider-id",
      timestamp: Date.now(),
    });
    await t.mutation(internal.outbound.result, {
      intentId: intent,
      state: "sent",
      providerId: "early-provider-id",
      error: "",
    });
    const detail = await owner.query(api.crm.detail, { id });
    expect(detail.lead.suppressed).toBe(true);
    expect(detail.messages[0].delivery).toBe("email.bounced");
    expect(
      detail.tasks.filter((t) => !t.done && t.kind === "followup"),
    ).toHaveLength(0);
  });
});
