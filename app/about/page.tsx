import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About — Casevia",
  description:
    "Casevia is a software studio building premium websites, apps, dashboards, booking systems, e-commerce platforms, and AI workflows.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About — Casevia",
    description:
      "Premium software studio focused on clean design, strong engineering, and real business outcomes.",
    url: "/about",
    siteName: "Casevia",
    type: "website",
  },
};

const principles = [
  {
    title: "Design should create trust",
    description:
      "A product should feel credible from the first screen. Clean visuals, strong hierarchy, and polished details matter.",
  },
  {
    title: "Software should match the workflow",
    description:
      "The best systems are built around how the business actually works, not around generic templates.",
  },
  {
    title: "Shipping matters",
    description:
      "A polished idea is not enough. The final product needs to work, launch, and support real users.",
  },
  {
    title: "Long-term quality wins",
    description:
      "Good structure, maintainable code, and clear product decisions make the product easier to improve after launch.",
  },
];

const capabilities = [
  "Business websites",
  "Web apps",
  "Dashboards",
  "Booking systems",
  "E-commerce",
  "AI workflows",
  "Mobile apps",
  "CMS platforms",
];

const stats = [
  {
    value: "7+",
    label: "Projects shipped",
  },
  {
    value: "4+",
    label: "Years building",
  },
  {
    value: "EU",
    label: "Client experience",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-background">
      <Section
        spacing="sm"
        className="pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <Heading as="h1" variant="hero" className="max-w-3xl">
              About Casevia.
            </Heading>

            <Text variant="lead" className="max-w-2xl lg:pb-2">
              Casevia is a software studio building premium websites, apps,
              dashboards, booking systems, e-commerce platforms, and AI
              workflows for businesses that care about quality.
            </Text>
          </div>
        </Container>
      </Section>

      <section className="border-y border-border bg-card">
        <Container>
          <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="py-7 md:px-8 first:md:pl-0">
                <div className="font-heading text-4xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </div>

                <Text variant="caption" className="mt-2">
                  {stat.label}
                </Text>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <Heading as="h2" variant="section">
                What Casevia builds.
              </Heading>

              <Text variant="body" className="mt-5 max-w-xl">
                The focus is not just making things look good. The goal is to
                build digital products that feel credible, support real
                workflows, and can keep improving after launch.
              </Text>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="rounded-2xl border border-border bg-card px-5 py-4 text-sm font-semibold text-foreground shadow-sm"
                >
                  {capability}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-border">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <Heading as="h2" variant="section">
                Principles.
              </Heading>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {principles.map((principle, index) => (
                <div
                  key={principle.title}
                  className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm"
                >
                  <div className="font-heading text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <Heading as="h3" variant="card" className="mt-6">
                    {principle.title}
                  </Heading>

                  <Text variant="body-sm" className="mt-4">
                    {principle.description}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
