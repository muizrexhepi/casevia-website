import type { Metadata } from "next";

import { WorkPageClient } from "@/components/work/work-page-client";
import { getFeaturedProjects, projectCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work — Casevia",
  description:
    "Explore Casevia work across websites, web apps, booking platforms, e-commerce, AI products, marketplaces, and client platforms.",
};

export default function WorkPage() {
  const projects = getFeaturedProjects();

  return <WorkPageClient projects={projects} categories={projectCategories} />;
}
