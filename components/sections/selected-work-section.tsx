import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { WorkProjectCard } from "@/components/work/work-project-card";
import { Heading, Text } from "@/components/ui/typography";
import { getHomepageProjects } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export function SelectedWorkSection() {
  const projects = getHomepageProjects();

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Heading as="h2" variant="section">
              Selected work.
            </Heading>

            {/* <Text variant="body" className="mt-4 max-w-2xl">
              Platforms, websites, and mobile products built for real businesses
              with real users, operations, and outcomes.
            </Text> */}
          </div>

          <Link
            href="/work"
            className={cn(
              buttonVariants({ size: "lg", variant: "secondary" }),
              "h-11 w-full rounded-full px-5 font-semibold sm:w-auto hidden sm:flex",
            )}
          >
            View all projects
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={17}
              strokeWidth={1.8}
              className="ml-2"
            />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <WorkProjectCard
              key={project.slug}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
