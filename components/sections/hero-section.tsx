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
import { getHeroStripProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";

const proofItems = [
  "Strategy & Design",
  "Scalable Development",
  "Ongoing Partnership",
];

const metrics = [
  { value: "7+", label: "Projects" },
  { value: "98%", label: "Satisfaction" },
  { value: "4+", label: "Years" },
];

export function HeroSection() {
  const heroProjects = getHeroStripProjects();

  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden pt-10 sm:pt-14 lg:pt-20"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[440px] w-[760px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-44 h-[360px] w-[360px] rounded-full bg-primary/[0.035] blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
          <div>
            <Heading as="h1" variant="hero" className="max-w-2xl">
              Premium software for businesses that want to stand out.
            </Heading>

            <Text variant="lead" className="mt-5 max-w-xl">
              Casevia builds polished websites, web apps, dashboards, and
              e-commerce platforms with clean design and scalable engineering.
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

            <div className="mt-7 hidden gap-3 text-sm font-medium text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-5">
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

        <HeroLogoStrip projects={heroProjects} />
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

function HeroLogoStrip({
  projects,
}: {
  projects: {
    slug: string;
    name: string;
    logoImage?: string;
    logoAlt?: string;
    logoImageClassName?: string;
  }[];
}) {
  const repeatedProjects = [...projects, ...projects, ...projects];

  if (!projects.length) {
    return null;
  }

  return (
    <div className="relative mt-12 sm:mt-14 lg:mt-16">
      <div className="relative overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-[casevia-marquee_38s_linear_infinite] items-center gap-12 pr-12 hover:[animation-play-state:paused] sm:gap-16 sm:pr-16">
          {repeatedProjects.map((project, index) => (
            <Link
              key={`${project.slug}-${index}`}
              href={`/work/${project.slug}`}
              aria-label={`View ${project.name} case study`}
              title={project.name}
              className="group/logo flex h-12 w-[150px] shrink-0 items-center justify-center"
            >
              <Image
                src={project.logoImage ?? ""}
                alt={project.logoAlt ?? `${project.name} logo`}
                width={160}
                height={48}
                className={cn(
                  "max-h-8 w-auto max-w-[135px] object-contain opacity-35 grayscale transition duration-300 group-hover/logo:opacity-80 group-hover/logo:grayscale-0",
                  project.logoImageClassName,
                )}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
