import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { getService, services } from "@/lib/services";

type ServicePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    return {
      title: "Service not found — Casevia",
    };
  }

  return {
    title: service.seoTitle,
    description: service.seoDescription,
    keywords: service.keywords,
    alternates: {
      canonical: `/services/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle,
      description: service.seoDescription,
      url: `/services/${service.slug}`,
      siteName: "Casevia",
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Section spacing="sm" className="pt-10 sm:pt-14 lg:pt-16">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={17}
              strokeWidth={1.8}
              className="mr-2"
            />
            Back to services
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-start">
            <div>
              <Eyebrow>{service.eyebrow}</Eyebrow>

              <Heading as="h1" variant="section" className="mt-4 max-w-4xl">
                {service.title}
              </Heading>

              <Text variant="body" className="mt-5 max-w-2xl">
                {service.description}
              </Text>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Text
                  variant="caption"
                  className="font-semibold uppercase tracking-[0.16em]"
                >
                  Best for
                </Text>

                <div className="mt-5 flex flex-wrap gap-2">
                  {service.bestFor.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <Eyebrow>Deliverables</Eyebrow>

              <Heading as="h2" variant="section" className="mt-4">
                What this service can include.
              </Heading>

              <Text variant="body" className="mt-4 max-w-md">
                The exact scope depends on the project, but these are the common
                pieces we usually handle.
              </Text>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {service.deliverables.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <Eyebrow>Process</Eyebrow>

              <Heading as="h2" variant="section" className="mt-4">
                How we approach it.
              </Heading>

              <Text variant="body" className="mt-4 max-w-md">
                Clear steps, clean execution, and no unnecessary agency noise.
              </Text>
            </div>

            <div className="divide-y divide-border rounded-[2rem] border border-border bg-card shadow-sm">
              {service.process.map((step, index) => (
                <div
                  key={step.title}
                  className="grid gap-4 p-6 sm:p-7 lg:grid-cols-[0.12fr_0.88fr]"
                >
                  <div className="font-heading text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div>
                    <Heading as="h3" variant="card">
                      {step.title}
                    </Heading>

                    <Text variant="body-sm" className="mt-3">
                      {step.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <Eyebrow>FAQ</Eyebrow>

              <Heading as="h2" variant="section" className="mt-4">
                Common questions.
              </Heading>
            </div>

            <div className="space-y-3">
              {service.faq.map((item) => (
                <Card key={item.question}>
                  <CardContent className="pt-6">
                    <Heading as="h3" variant="card">
                      {item.question}
                    </Heading>

                    <Text variant="body-sm" className="mt-3">
                      {item.answer}
                    </Text>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
