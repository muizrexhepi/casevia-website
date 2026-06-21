"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function FooterCta() {
  const pathname = usePathname();

  if (pathname === "/contact") return null;

  return (
    <div className="border-b border-border pb-10 sm:pb-12">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Heading as="h2" variant="subsection" className="max-w-xl">
            Ready to build something clearer?
          </Heading>

          <Text variant="body-sm" className="mt-3 max-w-xl">
            Send the project details and we’ll help define the right scope,
            direction, and next step.
          </Text>
        </div>

        <Link
          href="/contact"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 w-full rounded-full px-5 font-semibold sm:w-auto",
          )}
        >
          Book a discovery call
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={17}
            strokeWidth={1.8}
            className="ml-2"
          />
        </Link>
      </div>
    </div>
  );
}
