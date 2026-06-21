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
    <div className="pb-16 sm:pb-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Heading as="h2" variant="section" className="max-w-2xl">
            Let&apos;s make the next move count.
          </Heading>

          <Text variant="lead" className="mt-4 max-w-xl">
            Tell us where the business is going and what the product needs to
            make possible.
          </Text>
        </div>

        <Link
          href="/contact"
          className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
        >
          Start a conversation
          <HugeiconsIcon icon={ArrowRight02Icon} size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </div>
  );
}
