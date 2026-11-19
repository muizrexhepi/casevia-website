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
  it("reserves model and search costs before enqueue, including concurrent jobs", async () => {
    const { t, owner } = await setup();
    await owner.mutation(api.crm.saveSettings, {
      settings: { ...defaultSettings, dailyLimit: 5, monthlyLimit: 30 },
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
describe("delivery ordering and approval recovery",()=>{
 it("applies a delivery event that arrives before send completion is persisted",async()=>{const {t,owner,id,draft}=await approvedFixture();await owner.mutation(api.outbound.decide,{id:draft,approve:true});const intent=await owner.mutation(api.outbound.queueSend,{id:draft});await t.mutation(internal.outbound.claim,{intentId:intent});await t.mutation(internal.integrations.deliveryEvent,{eventId:"early-bounce",type:"email.bounced",messageId:"early-provider-id",timestamp:Date.now()});await t.mutation(internal.outbound.result,{intentId:intent,state:"sent",providerId:"early-provider-id",error:""});const detail=await owner.query(api.crm.detail,{id});expect(detail.lead.suppressed).toBe(true);expect(detail.messages[0].delivery).toBe("email.bounced");expect(detail.tasks.filter(t=>!t.done&&t.kind==="followup")).toHaveLength(0);});
});
