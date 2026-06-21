import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const phases = [
  {
    title: "Define",
    description:
      "We clarify the goal, audience, scope, and product direction before anything gets designed.",
  },
  {
    title: "Design",
    description:
      "We shape the experience, interface, and flows so the product feels clear, credible, and easy to use.",
  },
  {
    title: "Build",
    description:
      "We develop, test, launch, and improve the product with production-ready foundations.",
  },
];

export function ProcessSection() {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Heading as="h2" variant="section" className="max-w-xl">
              From rough idea to working product.
            </Heading>

            <Text variant="body" className="mt-5 max-w-xl">
              A focused process for turning unclear requirements into polished
              websites, dashboards, booking systems, and digital workflows.
            </Text>

            <Link
              href="/process"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "mt-7 h-11 rounded-full px-5 font-semibold",
              )}
            >
              View process
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={17}
                strokeWidth={1.8}
                className="ml-2"
              />
            </Link>
          </div>

          <div className="grid border-border sm:grid-cols-3 lg:border-l">
            {phases.map((phase, index) => (
              <div
                key={phase.title}
                className="border-border py-8 sm:px-7 lg:border-r lg:py-2 first:sm: last:lg:border-r-0"
              >
                <div className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <Heading as="h3" variant="card" className="mt-8">
                  {phase.title}
                </Heading>

                <Text variant="body-sm" className="mt-4 max-w-[18rem]">
                  {phase.description}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
