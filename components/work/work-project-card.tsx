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
      className="group/card block h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-transform duration-300 ease-out hover:-translate-y-1"
    >
      <ProjectPreview project={project} priority={priority} />

      <div className="flex min-h-[250px] flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Heading as="h2" variant="card">
              {project.name}
            </Heading>

            <Text variant="caption" className="mt-1">
              {project.status}
            </Text>
          </div>

          <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {project.categories[0]}
          </span>
        </div>

        <Text variant="body-sm" className="mt-4 line-clamp-3">
          {project.summary}
        </Text>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.proof.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-7">
          <span className="inline-flex items-center text-sm font-semibold text-primary">
            View case study
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={17}
              strokeWidth={1.8}
              className="ml-2 transition-transform duration-300 group-hover/card:translate-x-1"
            />
          </span>
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
    <div className="relative h-[230px] overflow-hidden border-b border-border bg-[radial-gradient(circle_at_76%_16%,rgba(37,99,235,0.16),transparent_44%),linear-gradient(135deg,#f6f8ff,#ffffff)] sm:h-[255px]">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35),rgba(255,255,255,0))]" />

      {project.coverImage ? (
        <div className="absolute inset-x-4 -bottom-3 top-8 translate-y-3 overflow-hidden rounded-t-[1.35rem] border border-black/5 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-transform duration-500 ease-out group-hover/card:translate-y-0">
          <Image
            src={project.coverImage}
            alt={project.coverAlt ?? `${project.name} project preview`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={cn(
              "object-cover object-top",
              project.coverImageClassName,
            )}
          />
        </div>
      ) : (
        <FallbackPreview />
      )}
    </div>
  );
}

function FallbackPreview() {
  return (
    <div className="absolute inset-x-4 -bottom-3 top-8 translate-y-3 overflow-hidden rounded-t-[1.35rem] border border-black/5 bg-white p-4 shadow-[0_18px_55px_rgba(15,23,42,0.12)] transition-transform duration-500 ease-out group-hover/card:translate-y-0">
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
