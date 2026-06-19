import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services — Casevia",
  description:
    "Premium business websites, web apps, dashboards, e-commerce websites, and AI automation systems built for modern businesses.",
  keywords: [
    "software agency",
    "website development",
    "web app development",
    "dashboard development",
    "ecommerce development",
    "AI automation",
    "Casevia services",
  ],
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services — Casevia",
    description:
      "Premium websites, web apps, dashboards, e-commerce platforms, and AI automation systems.",
    url: "/services",
    siteName: "Casevia",
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <Section spacing="sm" className="pt-10 sm:pt-14 lg:pt-16">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Services</Eyebrow>

          <Heading as="h1" variant="section" className="mt-4">
            Software services built around real business outcomes.
          </Heading>

          <Text variant="body" className="mt-4 max-w-2xl">
            Websites, platforms, dashboards, e-commerce experiences, and AI
            systems designed to look premium and work properly.
          </Text>
        </div>

        <div className="mt-10 divide-y divide-border rounded-[2rem] border border-border bg-card shadow-sm">
          {services.map((service, index) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="group grid gap-6 p-6 transition-colors hover:bg-muted/40 sm:p-8 lg:grid-cols-[0.18fr_0.82fr_auto] lg:items-start"
            >
              <div className="font-heading text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div>
                <Text
                  variant="caption"
                  className="font-semibold uppercase tracking-[0.16em]"
                >
                  {service.eyebrow}
                </Text>

                <Heading as="h2" variant="subsection" className="mt-3">
                  {service.title}
                </Heading>

                <Text variant="body" className="mt-4 max-w-3xl">
                  {service.shortDescription}
                </Text>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.bestFor.slice(0, 4).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="inline-flex items-center text-sm font-semibold text-primary lg:pt-8">
                View service
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={17}
                  strokeWidth={1.8}
                  className="ml-2 transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
