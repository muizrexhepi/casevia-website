import Link from "next/link";
import {
  ArrowRight02Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

const services = [
  ["Business websites", "Positioning, content, design, development"],
  ["Web apps & platforms", "Product strategy, UX, full-stack engineering"],
  ["E-commerce", "Storefronts, marketplaces, conversion UX"],
  ["AI & automation", "Workflow design, integrations, AI products"],
];

const process = [
  "Discover",
  "Structure",
  "Design",
  "Build",
  "Launch",
  "Improve",
];

export function StudioOverviewSection() {
  return (
    <Section className="bg-muted/40">
      <Container>
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.62fr_0.38fr] lg:items-end lg:gap-16">
          <Heading as="h2" variant="section" className="max-w-3xl">
            One studio across the decisions that shape the product.
          </Heading>
          <Text className="max-w-lg lg:pb-1">
            Strategy, design, and engineering stay connected—so context is not
            lost between a brief, a mockup, and the software that ships.
          </Text>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          <article className="flex flex-col rounded-[2rem] bg-background p-6 sm:p-8 lg:col-span-7 lg:row-span-2 lg:min-h-[650px] lg:p-10">
            <div className="flex items-start justify-between gap-6">
              <Heading as="h3" variant="subsection" className="max-w-md">
                From a business problem to working software.
              </Heading>
              <Link
                href="/services"
                aria-label="View all services"
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={19}
                  strokeWidth={1.8}
                />
              </Link>
            </div>

            <div className="mt-12 border-t border-border lg:mt-auto">
              {services.map(([title, detail], index) => (
                <Link
                  key={title}
                  href="/services"
                  className="group grid gap-2 border-b border-border py-5 sm:grid-cols-[0.1fr_0.36fr_0.54fr] sm:items-center sm:gap-5 sm:py-6"
                >
                  <span className="text-xs font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {title}
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground transition-colors group-hover:text-foreground">
                    {detail}
                  </span>
                </Link>
              ))}
            </div>
          </article>

          <Link
            href="/process"
            className="group flex min-h-[315px] flex-col rounded-[2rem] bg-primary p-6 text-primary-foreground sm:p-8 lg:col-span-5 lg:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <Heading
                as="h3"
                variant="subsection"
                className="max-w-xs text-primary-foreground"
              >
                A process built around momentum.
              </Heading>
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={21}
                strokeWidth={1.8}
                className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>

            <div className="mt-auto flex flex-wrap gap-x-3 gap-y-2 pt-10 text-sm font-medium text-primary-foreground/75">
              {process.map((step, index) => (
                <span key={step} className="inline-flex items-center gap-3">
                  {step}
                  {index < process.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="text-primary-foreground/35"
                    >
                      /
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </Link>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
            <Link
              href="/about"
              className="group flex min-h-[315px] flex-col rounded-[2rem] bg-background p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <Heading as="h3" variant="card">
                  Close to the work.
                </Heading>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={19}
                  strokeWidth={1.8}
                  className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary"
                />
              </div>
              <p className="mt-auto pt-10 font-heading text-3xl font-semibold leading-tight tracking-[-0.04em] text-foreground">
                Europe
              </p>
              <Text variant="body-sm" className="mt-4">
                Direct collaboration across product, design, and engineering.
              </Text>
            </Link>

            <Link
              href="/contact"
              className="group flex min-h-[315px] flex-col rounded-[2rem] border border-border bg-transparent p-6 sm:p-8"
            >
              <Heading as="h3" variant="card" className="max-w-[12rem]">
                Have something worth building?
              </Heading>
              <div className="mt-auto flex items-center justify-between gap-4 pt-10 text-sm font-semibold text-primary">
                Start a conversation
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
