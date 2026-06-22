import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Heading, Text } from "@/components/ui/typography";
import { WorkProjectCard } from "@/components/work/work-project-card";
import {
  getNextProject,
  getProject,
  projects,
  type Project,
  type ProjectCaseSection,
} from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) return { title: "Project not found — Casevia" };

  return {
    title: project.seoTitle ?? `${project.name} Case Study — Casevia`,
    description: project.seoDescription ?? project.summary,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const nextProject = getNextProject(project.slug);
  const storySections = project.caseStudy.length
    ? project.caseStudy
    : [
        {
          title: "What the business needed to solve.",
          body: project.challenge,
        },
        {
          title: "How Casevia approached it.",
          body: project.solution,
        },
      ];

  return (
    <main className="overflow-hidden">
      <ProjectHero project={project} />
      <ProjectDetails project={project} />
      <ProjectImpact project={project} />
      <ProjectStory project={project} sections={storySections} />
      <ProjectCapabilities project={project} />
      {nextProject ? <NextProject project={nextProject} /> : null}
    </main>
  );
}

function ProjectHero({ project }: { project: Project }) {
  const image = project.heroImage ?? project.coverImage;

  return (
    <section className="pb-14 pt-4 sm:pb-18 sm:pt-6 lg:pb-20 lg:pt-8">
      {image ? (
        <div className="mx-auto max-w-[96rem] sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-muted sm:rounded-3xl">
            <Image
              src={image}
              alt={
                project.heroAlt ??
                project.coverAlt ??
                `${project.name} project preview`
              }
              width={1920}
              height={1080}
              priority
              sizes="(min-width: 1536px) 1536px, 100vw"
              className={cn(
                "h-auto max-h-[860px] w-full object-cover object-top",
                project.coverImageClassName,
              )}
            />
          </div>
        </div>
      ) : null}

      <Container className="pt-10 sm:pt-14 lg:pt-16">
        <div className="grid gap-7 lg:grid-cols-[0.35fr_0.65fr] lg:gap-16">
          <div>
            <Heading as="h1" variant="hero" className="lg:text-7xl">
              {project.name}.
            </Heading>
            <p className="mt-5 text-sm font-medium text-muted-foreground">
              {project.period}
            </p>
          </div>

          <div>
            <Heading as="h2" variant="section" className="max-w-4xl">
              {project.headline}
            </Heading>
            <Text variant="lead" className="mt-6 max-w-3xl">
              {project.subheadline}
            </Text>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <section className="border-y border-border py-10 sm:py-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <MetaList title="Services" items={project.services} />
          <MetaList title="Deliverables" items={project.deliverables} />
          <div className="space-y-8">
            <MetaValue title="Client" value={project.clientType} />
            <MetaValue title="Industry" value={project.industry} />
          </div>
          <div className="space-y-8">
            <MetaValue title="Engagement" value={project.role} />
            <MetaValue title="Status" value={project.status} />
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-opacity hover:opacity-70"
              >
                {project.liveLabel ?? "View project"}
                <HugeiconsIcon
                  icon={LinkSquare02Icon}
                  size={16}
                  strokeWidth={1.8}
                />
              </Link>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}

function MetaList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-foreground/75">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MetaValue({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-foreground/75">{value}</p>
    </div>
  );
}

function ProjectImpact({ project }: { project: Project }) {
  return (
    <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.5fr_0.5fr] lg:gap-20">
          <div>
            <Heading as="h2" variant="section" className="max-w-3xl">
              {project.summary}
            </Heading>
            <Text variant="lead" className="mt-6 max-w-2xl">
              {project.description}
            </Text>
          </div>

          {project.metrics.length ? (
            <div className="grid content-start gap-8 border-t border-foreground/15 pt-8 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label}>
                  <p className="font-heading text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
                    {metric.value}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-foreground">
                    {metric.label}
                  </p>
                  {metric.description ? (
                    <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                      {metric.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

function ProjectStory({
  project,
  sections,
}: {
  project: Project;
  sections: ProjectCaseSection[];
}) {
  return (
    <section className="py-16 sm:py-24 lg:py-28">
      <Container>
        <div className="space-y-20 sm:space-y-28 lg:space-y-36">
          {sections.map((section, index) => (
            <StorySection
              key={`${section.title}-${index}`}
              project={project}
              section={section}
              index={index}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function StorySection({
  project,
  section,
  index,
}: {
  project: Project;
  section: ProjectCaseSection;
  index: number;
}) {
  const galleryImage = project.galleryImages[index];
  const image = section.image ?? galleryImage?.src;
  const imageAlt =
    section.imageAlt ?? galleryImage?.alt ?? `${project.name} project detail`;
  const imageType = section.image ? undefined : galleryImage?.type;

  return (
    <article>
      <div className="grid gap-6 lg:grid-cols-[0.18fr_0.82fr] lg:gap-16">
        <p className="text-sm font-semibold text-primary">
          {String(index + 1).padStart(2, "0")}
        </p>

        <div className="max-w-4xl">
          <Heading as="h2" variant="section">
            {section.title}
          </Heading>
          <Text variant="lead" className="mt-6 max-w-3xl">
            {section.body}
          </Text>

          {section.quote ? (
            <blockquote className="mt-10 max-w-3xl border-l-2 border-primary pl-6 sm:pl-8">
              <p className="font-heading text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-3xl">
                “{section.quote.text}”
              </p>
              {section.quote.author ? (
                <footer className="mt-5 text-sm text-muted-foreground">
                  {section.quote.author}
                  {section.quote.role ? `, ${section.quote.role}` : ""}
                </footer>
              ) : null}
            </blockquote>
          ) : null}
        </div>
      </div>

      {image ? (
        <div
          className={cn(
            "mt-12 overflow-hidden rounded-2xl bg-muted sm:mt-16 sm:rounded-3xl",
            imageType === "mobile" && "px-6 py-8 sm:px-12 sm:py-12 lg:px-16",
          )}
        >
          <Image
            src={image}
            alt={imageAlt}
            width={imageType === "mobile" ? 1206 : 1800}
            height={imageType === "mobile" ? 2622 : 1125}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className={cn(
              "h-auto w-full object-cover object-top",
              imageType === "mobile" &&
                "mx-auto max-h-[980px] w-auto max-w-full rounded-xl object-contain shadow-[0_24px_80px_rgba(15,23,42,0.12)]",
            )}
          />
        </div>
      ) : null}
    </article>
  );
}

function ProjectCapabilities({ project }: { project: Project }) {
  return (
    <section className="pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid gap-8 border-y border-border py-10 sm:py-12 lg:grid-cols-[0.35fr_0.65fr] lg:items-start lg:gap-16">
          <Heading as="h2" variant="subsection" className="max-w-sm">
            What the work brought together.
          </Heading>

          <div className="flex flex-wrap content-start gap-x-6 gap-y-3">
            {project.stack.map((item) => (
              <span
                key={item}
                className="text-sm font-medium leading-7 text-foreground/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function NextProject({ project }: { project: Project }) {
  return (
    <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="mb-10 flex items-end justify-between gap-6">
          <Heading as="h2" variant="section">
            Next project.
          </Heading>
          <Link
            href="/work"
            className="hidden text-sm font-semibold text-primary sm:inline-flex"
          >
            View all projects
          </Link>
        </div>

        <div className="max-w-5xl">
          <WorkProjectCard project={project} />
        </div>
      </Container>
    </section>
  );
}
