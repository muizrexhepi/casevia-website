import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "About — Casevia",
  description:
    "Casevia is a software studio combining product strategy, interface design, and engineering for business-critical digital products.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Casevia",
    description:
      "A software studio focused on clear design, strong engineering, and meaningful business outcomes.",
    url: "/about",
    siteName: "Casevia",
    type: "website",
  },
};

const disciplines = [
  {
    title: "Product thinking",
    description:
      "We begin with the business model, user needs, operational constraints, and the result the product must create.",
  },
  {
    title: "Design discipline",
    description:
      "Clear hierarchy, deliberate interaction, and a coherent visual system make complex products easier to trust and use.",
  },
  {
    title: "Engineering ownership",
    description:
      "We build for production: responsive behavior, maintainable systems, dependable integrations, and real operational use.",
  },
];

const principles = [
  {
    title: "Understand before making",
    description:
      "Good execution starts with a precise understanding of the business, the user, and the constraint behind the request.",
  },
  {
    title: "Clarity over decoration",
    description:
      "Visual decisions should improve comprehension, confidence, and action—not compete for attention.",
  },
  {
    title: "Build the real workflow",
    description:
      "Software should reflect how the operation actually works rather than forcing the business into a generic template.",
  },
  {
    title: "Stay accountable after launch",
    description:
      "A launch is the start of real use. We design systems that can be measured, maintained, and improved over time.",
  },
];

const capabilities = [
  "Business websites",
  "Web applications",
  "Operations platforms",
  "Booking systems",
  "E-commerce",
  "Mobile products",
  "AI workflows",
  "Headless CMS",
];

export default function AboutPage() {
  return (
    <main>
      <Section spacing="sm" className="pt-10 sm:pt-14 lg:pt-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-16">
            <div>
              <Eyebrow>About Casevia</Eyebrow>
              <Heading as="h1" variant="hero" className="mt-4 max-w-3xl">
                Built around the work, not the agency theatre.
              </Heading>
            </div>

            <Text variant="lead" className="max-w-2xl lg:pb-1">
              Casevia is a software studio combining strategy, interface design,
              and engineering to create digital products that earn trust and
              hold up in real business operations.
            </Text>
          </div>
        </Container>
      </Section>

      <Section className="bg-muted/40">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>How we work</Eyebrow>
            <Heading as="h2" variant="section" className="mt-4">
              One studio across product, design, and engineering.
            </Heading>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {disciplines.map((discipline, index) => (
              <article
                key={discipline.title}
                className="flex min-h-[250px] flex-col rounded-3xl bg-background p-6 sm:p-8"
              >
                <p className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div className="mt-auto pt-10">
                  <Heading as="h3" variant="card">
                    {discipline.title}
                  </Heading>
                  <Text variant="body-sm" className="mt-4">
                    {discipline.description}
                  </Text>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
            <div>
              <Eyebrow>What we build</Eyebrow>
              <Heading as="h2" variant="section" className="mt-4">
                Digital foundations for growing businesses.
              </Heading>
              <Text variant="body" className="mt-5 max-w-lg">
                The format changes with the problem. The standard does not:
                focused design, production-quality engineering, and a clear
                connection to the business outcome.
              </Text>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl bg-muted/50 px-5 py-4 text-sm font-semibold text-foreground"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-4 md:grid-cols-2">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="rounded-3xl bg-muted/40 p-6 sm:p-8"
              >
                <p className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <Heading as="h3" variant="card" className="mt-8">
                  {principle.title}
                </Heading>
                <Text variant="body-sm" className="mt-4 max-w-lg">
                  {principle.description}
                </Text>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
