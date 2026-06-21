import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Heading, Text } from "@/components/ui/typography";
import { processSteps } from "@/lib/process";

export function ProcessSection() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Our process"
          title="A clear path from idea to launch."
          description="We keep the process transparent, focused, and practical — no bloated agency theater, no endless meetings, no unclear scope."
        />

        <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <div key={step.title}>
              <p className="font-heading text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </p>
              <Heading as="h3" variant="card" className="mt-5">
                {step.title}
              </Heading>
              <Text variant="body-sm" className="mt-3 max-w-sm">
                {step.description}
              </Text>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
