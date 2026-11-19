import { z } from "zod";
export const researchSchema = z.object({
  observations: z
    .array(
      z.object({
        text: z.string().max(600),
        quote: z.string().max(500),
        kind: z.enum(["verified", "hypothesis"]),
        sourceUrl: z.union([z.string().url(), z.literal("")]),
      }),
    )
    .max(12),
  score: z.number().min(0).max(100),
  reasons: z.array(z.string().max(400)).max(8),
  service: z.string().max(200),
  nextAction: z.string().max(400),
});
export const discoverySchema = z.object({
  businesses: z
    .array(
      z.object({
        name: z.string().max(200),
        website: z.string().url(),
        location: z.string().max(200),
        industry: z.string().max(120),
        sourceUrl: z.string().url(),
      }),
    )
    .max(10),
});
export const draftSchema = z.object({
  subject: z.string().max(180),
  body: z.string().max(8000),
  scope: z.string().max(3000),
  exclusions: z.string().max(2000),
  nextSteps: z.string().max(1200),
});
export const replySchema = z.object({
  classification: z.enum([
    "interested",
    "meeting",
    "question",
    "objection",
    "pricing",
    "opt_out",
    "reply",
  ]),
  summary: z.string().max(600),
  nextAction: z.string().max(400),
});
