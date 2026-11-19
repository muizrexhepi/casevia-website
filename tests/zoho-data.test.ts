import { describe, expect, it } from "vitest";
import { parseZohoJson, zohoPage } from "../lib/crm/zoho-data";
import { researchSchema } from "../lib/crm/research-schema";
describe("integration boundaries", () => {
  it("preserves numeric Zoho message IDs beyond JavaScript integer precision", () => {
    expect(
      parseZohoJson('{"messageId":1795086178634123456,"start":25}'),
    ).toEqual({ messageId: "1795086178634123456", start: 25 });
  });
  it("retains the Zoho page on valid cursors and recovers invalid cursors", () => {
    expect(zohoPage("101")).toBe(101);
    expect(zohoPage("NaN")).toBe(1);
    expect(zohoPage("-1")).toBe(1);
  });
  it("allows an uncited research hypothesis while requiring valid nonempty source URLs", () => {
    const result = {
      observations: [
        {
          text: "Could a booking flow help?",
          quote: "",
          kind: "hypothesis",
          sourceUrl: "",
        },
      ],
      score: 20,
      reasons: ["Unverified opportunity"],
      service: "Web development",
      nextAction: "Review original source",
    };
    expect(researchSchema.safeParse(result).success).toBe(true);
    expect(
      researchSchema.safeParse({
        ...result,
        observations: [{ ...result.observations[0], sourceUrl: "not a URL" }],
      }).success,
    ).toBe(false);
  });
});
