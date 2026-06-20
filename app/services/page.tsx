import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Services — Casevia",
  description:
    "Websites, web apps, dashboards, e-commerce platforms, booking systems, and AI automation systems built for modern businesses.",
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
      "Websites, web apps, dashboards, e-commerce platforms, booking systems, and AI automation systems.",
    url: "/services",
    siteName: "Casevia",
    type: "website",
  },
};

const capabilityColumns = [
  {
    title: "Strategy",
    groups: [
      {
        title: "Discovery",
        items: [
          "Business goals",
          "User needs",
          "Workflow mapping",
          "Product direction",
        ],
      },
      {
        title: "Definition",
        items: [
          "Scope planning",
          "Feature priorities",
          "Content structure",
          "Launch roadmap",
        ],
      },
    ],
  },
  {
    title: "Design",
    groups: [
      {
        title: "Interface",
        items: [
          "UX structure",
          "Responsive layouts",
          "Design systems",
          "Conversion-focused pages",
        ],
      },
      {
        title: "Experience",
        items: [
          "Booking flows",
          "Dashboard UX",
          "Product browsing",
          "Mobile-first polish",
        ],
      },
    ],
  },
  {
    title: "Development",
    groups: [
      {
        title: "Front-end",
        items: ["Next.js", "React", "React Native", "Tailwind CSS"],
      },
      {
        title: "Systems",
        items: ["Dashboards", "CMS", "Payments", "AI integrations"],
      },
    ],
  },
];

const services = [
  {
    id: "business-websites",
    number: "01",
    title: "Business Websites",
    description:
      "Premium websites for restaurants, clinics, service businesses, local brands, and companies that need credibility, clarity, and conversion.",
    deliverables: [
      "Landing pages",
      "Multi-page websites",
      "CMS-backed content",
      "SEO foundations",
      "Contact and booking flows",
    ],
  },
  {
    id: "web-apps-dashboards",
    number: "02",
    title: "Web Apps & Dashboards",
    description:
      "Custom platforms, admin dashboards, booking systems, portals, and internal tools built around real business workflows.",
    deliverables: [
      "Product architecture",
      "Dashboard UI",
      "Authentication",
      "Database-backed workflows",
      "Production deployment",
    ],
  },
  {
    id: "ecommerce",
    number: "03",
    title: "E-commerce",
    description:
      "Polished product catalogs and online stores with strong presentation, clean browsing, responsive pages, and buying flows.",
    deliverables: [
      "Storefront UI",
      "Product pages",
      "Category pages",
      "Checkout-ready flows",
      "Responsive shopping experience",
    ],
  },
  {
    id: "ai-automation",
    number: "04",
    title: "AI & Automation",
    description:
      "AI-powered features and automations that reduce manual work, improve operations, and create leverage inside the business.",
    deliverables: [
      "AI-assisted workflows",
      "Automation logic",
      "Prompt systems",
      "Admin tools",
      "API integrations",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="bg-background">
      <Section
        spacing="sm"
        className="pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16"
      >
        <Container>
          <Heading as="h1" variant="hero" className="max-w-4xl">
            Services.
          </Heading>
        </Container>
      </Section>

      <section className="border-y border-border bg-card">
        <Container>
          <div className="grid divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {capabilityColumns.map((column) => (
              <div
                key={column.title}
                className="py-8 lg:px-8 lg:py-10 first:lg:pl-0 last:lg:pr-0"
              >
                <Heading as="h2" variant="subsection">
                  {column.title}
                </Heading>

                <div className="mt-8 space-y-8">
                  {column.groups.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-sm font-semibold text-foreground">
                        {group.title}
                      </h3>

                      <ul className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="text-base leading-7 text-muted-foreground"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="divide-y divide-border rounded-[2rem] border border-border bg-card shadow-sm">
            {services.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-28 p-6 sm:p-8 lg:p-10"
              >
                <div className="grid gap-7 lg:grid-cols-[0.16fr_0.84fr]">
                  <div className="font-heading text-sm font-semibold text-primary">
                    {service.number}
                  </div>

                  <div className="grid gap-8 lg:grid-cols-[0.9fr_1fr]">
                    <div>
                      <Heading as="h2" variant="subsection">
                        {service.title}
                      </Heading>

                      <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground">
                        Deliverables
                      </h3>

                      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        {service.deliverables.map((item) => (
                          <li
                            key={item}
                            className="flex gap-3 text-sm leading-6 text-muted-foreground"
                          >
                            <HugeiconsIcon
                              icon={CheckmarkCircle02Icon}
                              size={17}
                              strokeWidth={1.8}
                              className="mt-0.5 shrink-0 text-primary"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:p-7">
            <Heading as="h2" variant="card">
              Need something more custom?
            </Heading>

            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-semibold text-primary"
            >
              Start a project
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={17}
                strokeWidth={1.8}
                className="ml-2"
              />
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
