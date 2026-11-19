import { EventEmitter } from "node:events";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const network = vi.hoisted(() => ({ lookup: vi.fn(), request: vi.fn() }));
vi.mock("node:dns/promises", () => ({ lookup: network.lookup }));
vi.mock("node:https", () => ({ request: network.request }));
import {
  safeSource,
  extractSource,
  sourceByteLimit,
} from "../lib/crm/safe-fetch";
import { assessTarget, knownEnterprise } from "../lib/crm/targeting";

function page(html: string, status = 200, location = "") {
  const request = Object.assign(new EventEmitter(), {
    end: vi.fn(),
    destroy: vi.fn(),
  });
  network.request.mockImplementationOnce((_options, callback) => {
    request.end.mockImplementation(() =>
      queueMicrotask(() => {
        const response = Object.assign(new EventEmitter(), {
          statusCode: status,
          headers: { "content-type": "text/html", location },
          destroy: vi.fn(),
        });
        callback(response);
        response.emit("data", Buffer.from(html));
        response.emit("end");
      }),
    );
    return request;
  });
  return request;
}
beforeEach(() => {
  vi.resetAllMocks();
  network.lookup.mockResolvedValue([{ address: "8.8.8.8", family: 4 }]);
});
afterEach(() => vi.restoreAllMocks());
describe("bounded original-source research", () => {
  it("reads ordinary script-heavy pages beyond the former 200 KB limit and only extracts published contacts", async () => {
    page(
      `<title>Family guesthouse</title><script>${"x".repeat(300000)} hidden@tracker.invalid</script><p>Our family-run guesthouse has eight rooms.</p><a href="mailto:hello@guesthouse.test">Contact us</a><a href="/about">About us</a><a href="https://other.test/contact">Contact another company</a>`,
    );
    const source = await safeSource("https://guesthouse.test/");
    expect(source.truncated).toBe(false);
    expect(source.text).toContain("family-run guesthouse");
    expect(source.emails).toEqual(["hello@guesthouse.test"]);
    expect(source.links).toEqual(["https://guesthouse.test/about"]);
    expect(network.request.mock.calls[0][0]).toMatchObject({
      hostname: "8.8.8.8",
      servername: "guesthouse.test",
    });
  });
  it("stops oversized bodies at a fixed bound without treating an unfinished script as business evidence", async () => {
    const request = page(
      `<p>Our family-run guesthouse welcomes visitors.</p><script>${"x".repeat(sourceByteLimit + 500)} secret@tracker.invalid`,
    );
    const source = await safeSource("https://guesthouse.test/");
    expect(source.truncated).toBe(true);
    expect(source.text).toBe("Our family-run guesthouse welcomes visitors.");
    expect(source.emails).toEqual([]);
    expect(request.destroy).toHaveBeenCalledWith();
  });
  it("still blocks redirects into private networks", async () => {
    network.lookup
      .mockResolvedValueOnce([{ address: "8.8.8.8", family: 4 }])
      .mockResolvedValueOnce([{ address: "10.0.0.1", family: 4 }]);
    page("", 302, "https://internal.test/about");
    await expect(safeSource("https://guesthouse.test/")).rejects.toThrow(
      "Private source address blocked",
    );
    expect(network.request).toHaveBeenCalledTimes(1);
  });
});
describe("evidence-supported small-business targeting", () => {
  const sizeQuote = "Our family-run guesthouse has eight rooms.";
  const opportunityQuote =
    "Please call or email us to enquire about availability.";
  const candidate = {
    name: "Local Guesthouse",
    website: "https://guesthouse.test/",
    businessType: "independent_small_business" as const,
    reason:
      "A small direct-enquiry website matches the owner's lodging portfolio.",
    evidenceUrl: "https://guesthouse.test/about",
    sizeQuote,
    opportunityQuote,
    sources: [
      {
        url: "https://guesthouse.test/about",
        text: `${sizeQuote} ${opportunityQuote}`,
      },
    ],
  };
  it("accepts quoted original small-business evidence and holds unsupported opportunity claims", () => {
    expect(assessTarget(candidate).status).toBe("matched");
    expect(
      assessTarget({
        ...candidate,
        opportunityQuote: "They have no working booking system at all.",
      }).status,
    ).toBe("review");
    expect(
      assessTarget({
        ...candidate,
        evidenceUrl: "https://directory.test/listing",
      }).status,
    ).toBe("review");
    expect(assessTarget({ ...candidate, businessType: "unknown" }).status).toBe(
      "review",
    );
  });
  it("rejects known enterprises despite a model's positive label, including subdomains without false suffix matches", () => {
    expect(
      assessTarget({
        ...candidate,
        name: "KPMG Switzerland",
        website: "https://ch.kpmg.com/",
      }).status,
    ).toBe("excluded");
    expect(
      knownEnterprise("EY Switzerland", "https://www.ey.com/en_ch"),
    ).toBeTruthy();
    expect(
      knownEnterprise("Local Guesthouse", "https://notkpmg.com/"),
    ).toBeNull();
  });
  it("requires scale evidence beyond a model label and holds contradictory global-scale claims", () => {
    const sizeQuote = "We serve clients through our global network.";
    expect(
      assessTarget({
        ...candidate,
        sizeQuote,
        sources: [
          {
            url: candidate.evidenceUrl,
            text: `${sizeQuote} ${opportunityQuote}`,
          },
        ],
      }).status,
    ).toBe("review");
  });
  it("decodes original-page text and does not create contacts from scripts or image URLs", () => {
    const source = extractSource(
      "https://guesthouse.test/",
      '<p>Small &amp; family-run. We&#x27;re local.</p><script>"bad@tracker.test"</script><img src="/owner@2x.png"><a href="mailto:hello@guesthouse.test?subject=Enquiry">Email</a>',
    );
    expect(source.text).toContain("Small & family-run");
    expect(source.text).toContain("We're local.");
    expect(source.emails).toEqual(["hello@guesthouse.test"]);
  });
  it("verifies scale and opportunity on separate original pages and supports explicit tiny-property counts", () => {
    const sizeQuote = "Six apartments. Sixteen guests maximum.";
    const result = assessTarget({
      ...candidate,
      sizeQuote,
      sources: [
        { url: candidate.evidenceUrl, text: sizeQuote },
        { url: "https://guesthouse.test/contact", text: opportunityQuote },
      ],
    });
    expect(result).toMatchObject({
      status: "matched",
      evidenceUrl: candidate.evidenceUrl,
      opportunityUrl: "https://guesthouse.test/contact",
    });
  });
});
