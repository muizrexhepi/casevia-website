import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

const steps = [
  {
    title: "Discover",
    description:
      "We understand your business, audience, goals, constraints, and what success actually means.",
  },
  {
    title: "Design",
    description:
      "We craft clean, premium, conversion-focused interfaces your users can understand instantly.",
  },
  {
    title: "Build",
    description:
      "We develop fast, secure, scalable software using modern and maintainable technology.",
  },
  {
    title: "Launch",
    description:
      "We test, optimize, deploy, and support the product so it is ready for real users.",
  },
];

export function ProcessSection() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Our process"
          title="A clear path from idea to launch."
          description="We keep the process transparent, focused, and practical — no bloated agency theater, no endless meetings, no unclear scope."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step.title} className="h-full">
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-accent font-heading text-sm font-semibold text-primary">
                  {index + 1}
                </div>

                <Heading as="h3" variant="card" className="mt-6">
                  {step.title}
                </Heading>
              </CardHeader>

              <CardContent className="pt-3">
                <Text variant="body-sm">{step.description}</Text>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
