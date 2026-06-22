import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

const services = [
  {
    id: "business-websites",
    title: "Business websites",
    description:
      "Make the offer easy to understand, the business easy to trust, and the next step easy to take.",
    outcome: "Positioning · Content · Design · Development",
  },
  {
    id: "web-apps-dashboards",
    title: "Web apps & platforms",
    description:
      "Turn manual workflows, scattered tools, or a product idea into software built around the real operation.",
    outcome: "Product strategy · UX · Full-stack engineering",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description:
      "Give products the presentation they deserve while keeping discovery, decision-making, and buying direct.",
    outcome: "Storefronts · Marketplaces · Conversion UX",
  },
  {
    id: "ai-automation",
    title: "AI & automation",
    description:
      "Use AI where it removes real work or unlocks a useful product capability—not where it only adds a label.",
    outcome: "Workflow design · Integrations · AI products",
  },
];

export function ServicesSection() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Heading as="h2" variant="section">
              One partner from first decision to production.
            </Heading>
          </div>

          <Text variant="body" className="max-w-lg lg:text-right">
            Bring us the commercial problem, the messy workflow, or the product
            idea. We shape the right thing, then design and build it.
          </Text>
        </div>

        <div className="mt-12 border-t border-foreground/15">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="group grid gap-5 border-b border-foreground/15 py-7 transition-colors hover:bg-background/75 sm:px-5 sm:py-9 lg:grid-cols-[0.1fr_0.34fr_0.46fr_0.1fr] lg:items-start"
            >
              <span className="font-heading text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>

              <Heading as="h3" variant="card" className="lg:pr-8">
                {service.title}
              </Heading>

              <div>
                <Text variant="body-sm" className="max-w-xl">
                  {service.description}
                </Text>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground/55">
                  {service.outcome}
                </p>
              </div>

              <div className="flex justify-end">
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={21}
                  strokeWidth={1.7}
                  className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
