import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";
import { processSteps } from "@/lib/process";

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

export default function ProcessPage() {
  return (
    <main className="bg-background">
      <Section
        spacing="sm"
        className="pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16"
      >
        <Container>
          <PageIntro
            title="Enough structure to move quickly."
            description="A visible, collaborative path from the first business question to production—built around decisions, not ceremony."
          />
        </Container>
      </Section>

      <Section className="pt-8 sm:pt-10 lg:pt-12">
        <Container>
          <div className="mb-10 max-w-2xl">
            <Heading as="h2" variant="section">
              Six stages, one continuous conversation.
            </Heading>
          </div>
          <div className="divide-y divide-border border-y border-border">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[0.16fr_0.48fr_0.36fr] lg:gap-10 lg:p-10"
              >
                <div className="font-heading text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <Heading as="h3" variant="subsection">
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
                      className="border-l border-primary/30 py-1 pl-4 text-sm font-medium text-muted-foreground"
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
