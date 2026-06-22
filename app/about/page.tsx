import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "About — Casevia",
  description:
    "Casevia is an independent European software studio combining product strategy, interface design, and engineering for ambitious businesses.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Casevia",
    description:
      "An independent software studio connecting business thinking, design, and engineering.",
    url: "/about",
    siteName: "Casevia",
    type: "website",
  },
};

const disciplines = [
  {
    number: "01",
    title: "Find the real problem",
    description:
      "We start with the business model, the people using the product, and the workflow behind the request. The first brief is an input, not the final answer.",
  },
  {
    number: "02",
    title: "Give it a clear shape",
    description:
      "Strategy becomes structure, structure becomes an interface, and the interface becomes a coherent system people can understand and trust.",
  },
  {
    number: "03",
    title: "Own the production result",
    description:
      "We stay responsible through engineering, integrations, responsive behavior, testing, launch, and the details that decide whether the product holds up in use.",
  },
];

const principles = [
  ["Context before output", "Understand the business before prescribing screens."],
  ["Clarity over spectacle", "Make the important thing obvious before making it impressive."],
  ["One connected team", "Keep product, design, and engineering in the same conversation."],
  ["Useful over fashionable", "Choose technology and features for the job they need to do."],
  ["Show the work early", "Use visible progress to make decisions concrete."],
  ["Stay after launch", "Treat production as the beginning of learning, not the end of delivery."],
];

const capabilities = [
  "Business websites",
  "Web platforms",
  "Booking systems",
  "Operations software",
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
          <PageIntro
            title="A software studio built to stay close to the work."
            description="Casevia is an independent European studio working internationally to turn commercial challenges and operational complexity into useful digital products."
          />
        </Container>
      </Section>

      <section className="border-y border-border py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="max-w-5xl lg:ml-auto">
            <div>
              <Heading
                as="h2"
                variant="section"
                className="max-w-5xl lg:text-6xl"
              >
                The best digital work comes from understanding the business
                behind the screen.
              </Heading>
              <div className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
                <StudioFact label="Based in" value="Europe" />
                <StudioFact label="Working across" value="Europe and internationally" />
                <StudioFact label="Core disciplines" value="Strategy, design, engineering" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section className="bg-muted/40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
            <div>
              <Heading as="h2" variant="section" className="max-w-md">
                Thinking and making, without the handoffs.
              </Heading>
              <Text className="mt-5 max-w-md">
                One continuous line from the first business question to the
                software running in production.
              </Text>
            </div>

            <div className="border-t border-foreground/15">
              {disciplines.map((discipline) => (
                <article
                  key={discipline.number}
                  className="grid gap-4 border-b border-foreground/15 py-7 sm:grid-cols-[0.12fr_0.34fr_0.54fr] sm:gap-6 sm:py-9"
                >
                  <p className="font-heading text-sm font-semibold text-primary">
                    {discipline.number}
                  </p>
                  <Heading as="h3" variant="card">
                    {discipline.title}
                  </Heading>
                  <Text variant="body-sm">{discipline.description}</Text>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:gap-20">
            <div>
              <Heading as="h2" variant="section" className="max-w-md">
                A small set of standards we apply to every project.
              </Heading>
            </div>

            <div className="grid border-t border-border sm:grid-cols-2">
              {principles.map(([title, description], index) => (
                <article
                  key={title}
                  className={`border-b border-border py-7 sm:p-7 ${
                    index % 2 === 0 ? "sm:border-r" : ""
                  }`}
                >
                  <Heading as="h3" variant="small">
                    {title}
                  </Heading>
                  <Text variant="body-sm" className="mt-3 max-w-sm">
                    {description}
                  </Text>
                </article>
              ))}
            </div>
          </div>

          <div className="mt-20 border-t border-border pt-10 sm:mt-24">
            <Heading as="h2" variant="subsection">
              What we make
            </Heading>
            <div className="mt-7 flex flex-wrap gap-x-3 gap-y-3">
              {capabilities.map((capability) => (
                <span
                  key={capability}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/75"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function StudioFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold leading-6 text-foreground">
        {value}
      </p>
    </div>
  );
}
