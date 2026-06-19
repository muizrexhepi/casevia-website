import Image from "next/image";
import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import type { Project } from "@/lib/projects";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="block h-full">
      <Card className="h-full">
        <ProjectCover project={project} priority={priority} />

        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Heading as="h3" variant="card">
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
        </CardHeader>

        <CardContent className="pt-3">
          <Text variant="body-sm">{project.summary}</Text>

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
        </CardContent>

        <CardFooter className="pt-6">
          <span className="inline-flex items-center text-sm font-semibold text-primary">
            View case study
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={17}
              strokeWidth={1.8}
              className="ml-2 transition-transform duration-300 group-hover/card:translate-x-1"
            />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

function ProjectCover({
  project,
  priority,
}: {
  project: Project;
  priority: boolean;
}) {
  return (
    <div
      className={cn(
        "relative h-[240px] overflow-hidden border-b border-border bg-muted sm:h-[270px]",
        project.visualTheme === "gobusly" &&
          "bg-[linear-gradient(135deg,#061b36,#0d2b55)]",
        project.visualTheme === "hakbus" &&
          "bg-[linear-gradient(135deg,#061237,#1742a8)]",
        project.visualTheme === "doros" &&
          "bg-[linear-gradient(135deg,#050507,#17120c)]",
        project.visualTheme === "nextloop" &&
          "bg-[linear-gradient(135deg,#07111f,#0d1b38)]",
        project.visualTheme === "logly" &&
          "bg-[linear-gradient(135deg,#f6f8ff,#ffffff)]",
        project.visualTheme === "speaksure" &&
          "bg-[linear-gradient(135deg,#06111f,#111827)]",
        project.visualTheme === "am" &&
          "bg-[linear-gradient(135deg,#f6f8ff,#ffffff)]",
      )}
    >
      <div
        className={cn(
          "absolute left-5 top-5 z-20 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur",
          project.visualTheme === "logly" || project.visualTheme === "am"
            ? "bg-primary/10 text-primary"
            : "bg-white/10 text-white",
        )}
      >
        {project.name}
      </div>

      {project.coverImage ? (
        <div className="absolute inset-x-5 bottom-0 top-16 overflow-hidden rounded-t-[1.5rem] border border-white/10 bg-white shadow-[0_28px_90px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover/card:-translate-y-2">
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
        <FallbackPreview project={project} />
      )}
    </div>
  );
}

function FallbackPreview({ project }: { project: Project }) {
  const isLight =
    project.visualTheme === "logly" || project.visualTheme === "am";

  return (
    <div
      className={cn(
        "absolute inset-x-5 bottom-0 rounded-t-[1.75rem] border p-5 shadow-[0_28px_90px_rgba(0,0,0,0.28)] transition-transform duration-500 group-hover/card:-translate-y-2",
        isLight
          ? "border-primary/10 bg-white"
          : "border-white/10 bg-white/10 backdrop-blur",
      )}
    >
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-red-400" />
        <span className="size-2 rounded-full bg-yellow-400" />
        <span className="size-2 rounded-full bg-emerald-400" />
        <div
          className={cn(
            "ml-3 h-2 flex-1 rounded-full",
            isLight ? "bg-slate-200" : "bg-white/10",
          )}
        />
      </div>

      <div className="mt-7 grid grid-cols-[1fr_0.85fr] gap-4">
        <div>
          <div
            className={cn(
              "h-6 w-40 rounded-full",
              isLight ? "bg-primary/20" : "bg-white/90",
            )}
          />
          <div
            className={cn(
              "mt-3 h-3 w-28 rounded-full",
              isLight ? "bg-primary/10" : "bg-white/35",
            )}
          />
          <div
            className={cn(
              "mt-3 h-3 w-36 rounded-full",
              isLight ? "bg-primary/10" : "bg-white/25",
            )}
          />
          <div
            className={cn(
              "mt-8 h-10 w-28 rounded-full",
              isLight ? "bg-primary" : "bg-white/10",
            )}
          />
        </div>

        <div
          className={cn(
            "rounded-2xl p-3",
            isLight ? "bg-primary/10" : "bg-white/10",
          )}
        >
          <div
            className={cn(
              "h-4 w-20 rounded-full",
              isLight ? "bg-primary/20" : "bg-white/25",
            )}
          />

          <div className="mt-4 grid grid-cols-3 items-end gap-2">
            <div
              className={cn(
                "h-16 rounded-xl",
                isLight ? "bg-primary/15" : "bg-white/15",
              )}
            />
            <div
              className={cn(
                "h-24 rounded-xl",
                isLight ? "bg-primary/25" : "bg-white/25",
              )}
            />
            <div
              className={cn(
                "h-12 rounded-xl",
                isLight ? "bg-primary/10" : "bg-white/10",
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
