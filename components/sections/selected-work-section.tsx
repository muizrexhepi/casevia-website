import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { ProjectCard } from "@/components/work/project-card";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { getHomepageProjects } from "@/lib/projects";

export function SelectedWorkSection() {
  const projects = getHomepageProjects();

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <Eyebrow>Selected work</Eyebrow>

            <Heading as="h2" variant="section" className="mt-4">
              Work that blends strategy, design, and engineering.
            </Heading>

            <Text variant="body" className="mt-5 max-w-2xl">
              A focused look at websites, platforms, and digital products built
              for real businesses — not template demos.
            </Text>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center text-sm font-semibold text-primary"
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

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard
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
