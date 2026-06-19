import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

const reasons = [
  {
    title: "Premium design",
    description:
      "Clean visual hierarchy, polished spacing, and interfaces that make your business look serious.",
  },
  {
    title: "Conversion focused",
    description:
      "Every page is built with a goal: leads, bookings, sales, trust, or operational efficiency.",
  },
  {
    title: "Fast & scalable",
    description:
      "Modern architecture, responsive layouts, optimized performance, and clean code you can build on.",
  },
  {
    title: "Long-term partner",
    description:
      "We can support, maintain, improve, and scale the product after launch instead of disappearing.",
  },
];

export function WhyCaseviaSection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow="Why Casevia"
            title="Built like a product team, not a template shop."
            description="We combine design taste, engineering skill, and business thinking to create websites and platforms that feel premium and actually help the business."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((reason) => (
              <Card key={reason.title} className="h-full">
                <CardHeader>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-accent text-primary">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={22}
                      strokeWidth={1.8}
                    />
                  </div>

                  <Heading as="h3" variant="card" className="mt-6">
                    {reason.title}
                  </Heading>
                </CardHeader>

                <CardContent className="pt-3">
                  <Text variant="body-sm">{reason.description}</Text>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
