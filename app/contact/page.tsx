import type { Metadata } from "next";
import Link from "next/link";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Contact Casevia | Start Your Project",
  description:
    "Contact Casevia to discuss a premium website, web app, dashboard, e-commerce platform, booking system, or AI automation project.",
  keywords: [
    "contact software agency",
    "start website project",
    "web app agency contact",
    "Casevia contact",
    "hire web developer",
    "hire software agency",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Casevia | Start Your Project",
    description:
      "Start a project with Casevia for websites, web apps, dashboards, e-commerce platforms, and AI automations.",
    url: "/contact",
    siteName: "Casevia",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <Section
      spacing="sm"
      className="pb-10 pt-8 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-14"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
          <div className="max-w-xl">
            <Heading as="h1" variant="hero">
              Start a project.
            </Heading>

            <Text variant="lead" className="mt-5">
              Tell us what you want to build. We’ll reply with the clearest next
              step, scope direction, and timeline.
            </Text>

            <Link
              href="mailto:hello@casevia.io"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <HugeiconsIcon icon={Mail01Icon} size={18} strokeWidth={1.8} />
              hello@casevia.io
            </Link>
          </div>

          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
