import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

const principles = [
  {
    number: "01",
    title: "Direct collaboration",
    description:
      "The people making the product stay close to the business context. Less translation, faster decisions, and clearer accountability.",
  },
  {
    number: "02",
    title: "Design and engineering together",
    description:
      "The interface and the implementation are developed as one system, so the quality agreed in design reaches production.",
  },
  {
    number: "03",
    title: "Built around the operation",
    description:
      "We learn the workflow behind the screen and make decisions that work for the team running the product after launch.",
  },
];

export function WhyCaseviaSection() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
          <div>
            <Heading as="h2" variant="section" className="max-w-xl">
              A studio that stays close to the work.
            </Heading>
            <Text className="mt-5 max-w-md">
              Based in Tetovo and working across Europe, Casevia keeps product
              thinking, design, and engineering in one continuous process.
            </Text>
          </div>

          <div className="border-t border-foreground/15">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-4 border-b border-foreground/15 py-7 sm:grid-cols-[0.12fr_0.34fr_0.54fr] sm:gap-6 sm:py-8"
              >
                <p className="font-heading text-sm font-semibold text-primary">
                  {principle.number}
                </p>
                <Heading as="h3" variant="card">
                  {principle.title}
                </Heading>
                <Text variant="body-sm">{principle.description}</Text>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
