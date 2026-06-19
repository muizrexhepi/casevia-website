import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const proofItems = [
  "Strategy & Design",
  "Scalable Development",
  "Ongoing Partnership",
];

const companies = [
  "Logly",
  "SpeakSure",
  "GoBusly",
  "Hakbus",
  "Nextloop",
  "Doros Premium",
];

const metrics = [
  { value: "7+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "4+", label: "Years" },
];

export function HeroSection() {
  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden pt-10 sm:pt-14 lg:pt-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div>
            <Heading as="h1" variant="hero" className="max-w-2xl">
              Premium software for businesses that want to stand out.
            </Heading>

            <Text variant="lead" className="mt-5 max-w-xl">
              Casevia designs and builds websites, web apps, dashboards, and
              e-commerce platforms with clean UI and scalable engineering.
            </Text>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 w-full rounded-full px-6 font-semibold sm:w-auto",
                )}
              >
                Book a discovery call
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="ml-2"
                />
              </Link>

              <Link
                href="/work"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 w-full rounded-full bg-card px-6 font-semibold sm:w-auto",
                )}
              >
                View our work
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  strokeWidth={1.8}
                  className="ml-2"
                />
              </Link>
            </div>

            <div className="mt-7 grid gap-3 text-sm font-medium text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-5">
              {proofItems.map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    strokeWidth={1.8}
                    className="text-primary"
                  />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <HeroVisual />
        </div>

        <TrustedMarquee />
      </Container>
    </Section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-[340px] lg:hidden">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
            <Image
              src="/dashboardMobile.png"
              alt="Casevia mobile product preview"
              width={941}
              height={1672}
              priority
              className="h-[430px] w-full object-cover object-top sm:h-[520px]"
            />
          </div>
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-3 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
          <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
            <Image
              src="/dashboard.png"
              alt="Casevia dashboard preview"
              width={1448}
              height={1086}
              priority
              className="h-[440px] w-full object-cover object-top xl:h-[500px]"
            />
          </div>
        </div>

        <div className="absolute -bottom-8 -right-4 w-[215px] xl:-right-7 xl:w-[245px]">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card p-2 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-background">
              <Image
                src="/dashboardMobile.png"
                alt="Casevia mobile app preview"
                width={941}
                height={1672}
                className="h-[320px] w-full object-cover object-top xl:h-[365px]"
              />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -left-6 top-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
      </div>
    </div>
  );
}

function TrustedMarquee() {
  const repeatedCompanies = [...companies, ...companies];

  return (
    <div className="relative mt-16">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="relative min-w-0 overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-[casevia-marquee_30s_linear_infinite] items-center gap-10 pr-10 hover:[animation-play-state:paused]">
            {repeatedCompanies.map((company, index) => (
              <span
                key={`${company}-${index}`}
                className="font-heading text-lg font-semibold tracking-tight text-foreground/70 sm:text-xl"
              >
                {company}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-background/90 shadow-sm backdrop-blur lg:min-w-[320px]">
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={cn(
                "px-4 py-3 text-center",
                index !== 0 && "border-l border-border",
              )}
            >
              <div className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                {metric.value}
              </div>

              <Text variant="caption" className="mt-0.5">
                {metric.label}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
