import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";

const services = [
  {
    id: "business-websites",
    title: "Business websites",
    description:
      "Distinctive, high-performing websites that clarify the offer, strengthen trust, and turn attention into action.",
  },
  {
    id: "web-apps-dashboards",
    title: "Web apps & platforms",
    description:
      "Operational software, dashboards, portals, and booking systems designed around the way the business actually works.",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description:
      "Product and shopping experiences that balance brand presentation, clear discovery, and frictionless buying journeys.",
  },
  {
    id: "ai-automation",
    title: "AI & automation",
    description:
      "Practical AI features and connected workflows that reduce repetitive work and create useful product capabilities.",
  },
];

export function ServicesSection() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            {/* <Eyebrow>What we do</Eyebrow> */}
            <Heading as="h2" variant="section" className="mt-4">
              From business challenge to working software.
            </Heading>
          </div>

          <Text variant="body" className="max-w-lg lg:text-right">
            Strategy, design, and engineering stay connected from the first
            decision through launch and continued improvement.
          </Text>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {services.map((service, index) => (
            <Link
              key={service.id}
              href={`/services#${service.id}`}
              className="group flex min-h-[240px] flex-col rounded-3xl bg-background p-6 transition-transform duration-300 hover:-translate-y-1 sm:min-h-[270px] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={21}
                  strokeWidth={1.7}
                  className="text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>

              <div className="mt-auto pt-10">
                <Heading as="h3" variant="subsection">
                  {service.title}
                </Heading>
                <Text variant="body-sm" className="mt-4 max-w-lg">
                  {service.description}
                </Text>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
