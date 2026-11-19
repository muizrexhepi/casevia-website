"use client";

import { useState } from "react";

import { WorkProjectCard } from "@/components/work/work-project-card";
import type { Project, ProjectCategory } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Filter = "All" | ProjectCategory;

export function WorkPageClient({
  projects,
  categories,
}: {
  projects: Project[];
  categories: ProjectCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState<Filter>("All");
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) =>
          project.categories.includes(activeCategory),
        );

  const flagships =
    activeCategory === "All"
      ? filteredProjects.filter((project) => project.flag === "Flagship project")
      : [];
  const flagshipSlugs = new Set(flagships.map((project) => project.slug));
  const gridProjects = filteredProjects.filter((project) => !flagshipSlugs.has(project.slug));

  return (
    <div className="mt-8 sm:mt-10">
      <div className="relative mt-7 mb-7 sm:mt-9 sm:mb-9">
        <div
          role="group"
          aria-label="Filter projects by category"
          className={cn(
            "-mx-5 overflow-x-auto overscroll-x-contain px-5 pb-2",
            "sm:mx-0 sm:px-0",
            "[scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
          )}
        >
          <div className="flex w-max min-w-full flex-nowrap gap-2">
            {(["All", ...categories] as Filter[]).map((category) => {
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center",
                    "justify-center whitespace-nowrap rounded-full",
                    "border px-5 py-2.5 text-sm font-semibold",
                    "transition-all duration-200",
                    "focus-visible:outline-2",
                    "focus-visible:outline-offset-2",
                    "focus-visible:outline-primary",

                    isActive
                      ? "border-[var(--pink)] bg-[var(--pink)] text-[var(--ink)]"
                      : [
                          "border-border bg-card text-foreground",
                          "hover:border-[var(--pink)]",
                          "hover:text-[var(--pink)]",
                        ],
                  )}
                >
                  {category === "All" ? "All projects" : category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {flagships.length > 0 && (
        <div className="mb-5 grid gap-5 sm:mb-6 sm:gap-6">
          {flagships.map((project, index) => (
            <WorkProjectCard key={project.slug} project={project} large edgeToEdge priority={index === 0} heading="h2" />
          ))}
        </div>
      )}

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {gridProjects.map((project) => (
          <WorkProjectCard
            key={project.slug}
            project={project}
            heading="h2"
            edgeToEdge
            imageSizes="(min-width: 1280px) 610px, (min-width: 768px) 48vw, 100vw"
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No projects in this category yet.
        </p>
      )}
    </div>
  );
}
