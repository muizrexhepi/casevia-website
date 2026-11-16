import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className={cn(
        "relative isolate grid place-items-center overflow-hidden",
        "bg-[#100e11]",

        // Full viewport height minus the navigation
        "min-h-[calc(100dvh-4rem)]",
        "sm:min-h-[calc(100dvh-4.5rem)]",

        // Responsive vertical spacing
        "py-14 sm:py-20 lg:py-24",
      )}
    >
      {/* Decorative artwork */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <Image
          src="/brand/bracket-sticker.svg"
          alt=""
          width={234}
          height={181}
          className={cn(
            "hero-artwork absolute -left-7 top-5 w-24 -rotate-12",
            "sm:-left-5 sm:-top-4 sm:w-20",
            "md:top-14",
            "lg:left-[5%] lg:w-[clamp(7rem,14vw,14rem)]",
          )}
        />

        <Image
          src="/brand/cursor-sticker.svg"
          alt=""
          width={220}
          height={220}
          className={cn(
            "absolute -right-6 -bottom-5 w-28 rotate-[15deg]",
            "sm:-right-4 sm:w-24",
            "md:bottom-7",
            "lg:right-[4%] lg:w-[clamp(8rem,16vw,15rem)]",
          )}
        />

        <Image
          src="/brand/mr-light.svg"
          alt=""
          width={64}
          height={64}
          className={cn(
            "absolute top-11 right-[12%] hidden",
            "w-18 rotate-[14deg]",
            "drop-shadow-[5px_6px_0_#713c62]",
            "lg:block xl:w-22",
          )}
        />

        <span className="absolute bottom-[13%] left-[11%] hidden text-4xl text-primary lg:block">
          ✦
        </span>
      </div>

      {/* Hero content */}
      <Container className="relative z-10 w-full text-center">
        {/* Headline */}
        <Heading
          as="h1"
          variant="hero"
          className={cn(
            "type-display-home mx-auto max-w-none",
            "text-[#FFF9F0]",

            // Mobile typography
            "max-sm:!text-[clamp(2.4rem,11.5vw,3rem)]",
            "max-sm:!leading-[1.02]",
            "max-sm:!tracking-[-0.055em]",

            // Desktop: slightly smaller and more balanced
            "sm:!text-[clamp(3.2rem,5.6vw,5.25rem)]",
            "sm:!leading-[1.06]",
            "sm:!tracking-[-0.055em]",
          )}
        >
          <span className="block lg:whitespace-nowrap">
            Websites &amp; software.
          </span>
          <span className="block lg:whitespace-nowrap">
            Built for business.
          </span>
        </Heading>

        {/* Supporting description */}
        <Text
          variant="lead"
          className={cn(
            "mx-auto mt-7 max-w-[34ch]",
            "text-[#FFF9F0]/90",

            // Mobile readability
            "max-sm:!text-[18px]",
            "max-sm:!leading-[1.55]",
            "max-sm:!tracking-[-0.01em]",

            // Desktop
            "sm:mt-8 sm:max-w-[53ch]",
          )}
        >
          Custom websites, online booking systems, and business software that
          help you serve customers and simplify daily operations.
        </Text>

        {/* Calls to action */}
        <div
          className={cn(
            "mx-auto mt-10 flex w-full flex-col gap-3",
            "sm:mt-9 sm:w-auto sm:flex-row",
            "sm:flex-wrap sm:justify-center",
          )}
        >
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 w-full justify-center px-5",
              "sm:h-13 sm:w-auto sm:px-6",
            )}
          >
            Start a Project
            <HugeiconsIcon icon={ArrowUpRight01Icon} size={18} />
          </Link>

          <Link
            href="#selected-work"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
              }),
              "h-14 w-full justify-center px-5",
              "sm:h-13 sm:w-auto sm:px-6",
            )}
          >
            Explore My Work
            <HugeiconsIcon icon={ArrowDown01Icon} size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
