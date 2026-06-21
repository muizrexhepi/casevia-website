import Image from "next/image";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <Section
      spacing="lg"
      className="relative overflow-hidden pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-20"
    >
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Heading as="h1" variant="hero" className="max-w-2xl">
              Digital products built for businesses in motion.
            </Heading>

            <Text variant="lead" className="mt-6 max-w-xl">
              Casevia brings strategy, design, and engineering together to
              create websites and software that move real businesses forward.
            </Text>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 w-full px-5 sm:w-auto",
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
                  "h-11 w-full bg-background px-5 sm:w-auto",
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
          </div>

          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="mx-auto w-full max-w-[340px] lg:hidden">
        <div className="overflow-hidden rounded-3xl bg-muted p-2">
          <div className="overflow-hidden rounded-[1.25rem] bg-background">
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
        <div className="overflow-hidden rounded-3xl bg-muted p-2">
          <div className="overflow-hidden rounded-[1.5rem] bg-background">
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
          <div className="overflow-hidden rounded-3xl bg-background p-2 shadow-xl shadow-slate-950/10">
            <div className="overflow-hidden rounded-[1.5rem] bg-background">
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
      </div>
    </div>
  );
}
