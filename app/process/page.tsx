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
  title: "Process — Casevia",
  description:
    "A clear software design and development process for websites, web apps, dashboards, e-commerce platforms, booking systems, and AI automations.",
  alternates: {
    canonical: "/process",
  },
  openGraph: {
    title: "Process — Casevia",
    description:
      "How Casevia takes projects from direction to design, development, launch, and improvement.",
    url: "/process",
    siteName: "Casevia",
    type: "website",
  },
};

const processSteps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We clarify the business goal, audience, current workflow, constraints, and what the project actually needs to achieve.",
    details: [
      "Business goals",
      "User needs",
      "Current problems",
      "Technical constraints",
    ],
  },
  {
    number: "02",
    title: "Structure",
    description:
      "We shape the scope, sitemap, user flows, core features, content structure, and technical direction before design begins.",
    details: [
      "Project scope",
      "Feature priorities",
      "Information architecture",
      "Technical direction",
    ],
  },
  {
    number: "03",
    title: "Design",
    description:
      "We design clean, responsive interfaces that feel premium, reduce friction, and make the product easier to use.",
    details: [
      "UX structure",
      "Interface design",
      "Responsive layouts",
      "Design refinement",
    ],
  },
  {
    number: "04",
    title: "Build",
    description:
      "We develop the product with modern tools, clean implementation, reusable components, and production-ready foundations.",
    details: [
      "Frontend development",
      "Backend integration",
      "CMS or dashboard logic",
      "Performance basics",
    ],
  },
  {
    number: "05",
    title: "Launch",
    description:
      "We test the important flows, handle deployment, connect the required tools, and prepare the product for real users.",
    details: ["QA checks", "Deployment", "Analytics", "Launch support"],
  },
  {
    number: "06",
    title: "Improve",
    description:
      "After launch, we can keep improving the product based on usage, feedback, business priorities, and new opportunities.",
    details: [
      "Ongoing support",
      "Conversion improvements",
      "Feature iteration",
      "Maintenance",
    ],
  },
];

const principles = [
  {
    title: "Clear scope before building",
    description:
      "The project should not start as a vague idea. The direction, priorities, and expected outcome need to be understood first.",
  },
  {
    title: "Design that supports the business",
    description:
      "The interface should look good, but it also needs to make the offer, flow, or product easier to understand and use.",
  },
  {
    title: "Build for production, not screenshots",
    description:
      "The final product should work properly across devices, handle real content, and be maintainable after launch.",
  },
];

export default function ProcessPage() {
  return (
    <main className="bg-background">
      <Section
        spacing="sm"
        className="pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16"
      >
        <Container>
          <div className="max-w-4xl">
            <Heading as="h1" variant="hero">
              Process.
            </Heading>

            <Text variant="lead" className="mt-5 max-w-2xl">
              A clear path from rough idea to polished digital product.
            </Text>
          </div>
        </Container>
      </Section>

      <Section className="pt-8 sm:pt-10 lg:pt-12">
        <Container>
          <div className="divide-y divide-border rounded-[2rem] border border-border bg-card shadow-sm">
            {processSteps.map((step) => (
              <article
                key={step.number}
                className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.16fr_0.48fr_0.36fr] lg:gap-10 lg:p-10"
              >
                <div className="font-heading text-sm font-semibold text-primary">
                  {step.number}
                </div>

                <div>
                  <Heading as="h2" variant="subsection">
                    {step.title}
                  </Heading>

                  <Text variant="body" className="mt-4 max-w-2xl">
                    {step.description}
                  </Text>
                </div>

                <div className="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {step.details.map((detail) => (
                    <div
                      key={detail}
                      className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium text-muted-foreground"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
