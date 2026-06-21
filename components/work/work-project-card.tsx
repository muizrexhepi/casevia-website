import Image from "next/image";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Project } from "@/lib/projects";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function WorkProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group/card block h-full"
    >
      <ProjectPreview project={project} priority={priority} />

      <div className="pt-5 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Heading as="h2" variant="card">
              {project.name}
            </Heading>

            <Text variant="body-sm" className="mt-2 line-clamp-2 max-w-md">
              {project.summary}
            </Text>
          </div>

          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            strokeWidth={1.6}
            className="mt-1 shrink-0 text-muted-foreground transition-transform duration-300 group-hover/card:translate-x-1 group-hover/card:text-primary"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
          <span>{project.categories[0]}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-border" />
          <span>{project.status}</span>
        </div>
      </div>
    </Link>
  );
}

function ProjectPreview({
  project,
  priority,
}: {
  project: Project;
  priority: boolean;
}) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-muted">
      {project.coverImage ? (
        <Image
          src={project.coverImage}
          alt={project.coverAlt ?? `${project.name} project preview`}
          fill
          priority={priority}
          sizes="(min-width: 1280px) 31vw, (min-width: 768px) 50vw, 100vw"
          className={cn(
            "object-cover object-top transition-transform duration-500 ease-out group-hover/card:scale-[1.015]",
            project.coverImageClassName,
          )}
        />
      ) : (
        <FallbackPreview />
      )}
    </div>
  );
}

function FallbackPreview() {
  return (
    <div className="absolute inset-0 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-yellow-400" />
        <span className="size-2 rounded-full bg-emerald-400" />
        <div className="ml-3 h-2 flex-1 rounded-full bg-slate-200" />
      </div>

      <div className="mt-7">
        <div className="h-7 w-48 max-w-full rounded-full bg-primary/18" />
        <div className="mt-3 h-3 w-36 rounded-full bg-primary/10" />
        <div className="mt-3 h-3 w-56 max-w-full rounded-full bg-primary/10" />

        <div className="mt-7 grid grid-cols-3 items-end gap-2">
          <div className="h-16 rounded-xl bg-primary/10" />
          <div className="h-24 rounded-xl bg-primary/20" />
          <div className="h-12 rounded-xl bg-primary/10" />
        </div>
      </div>
    </div>
  );
}
