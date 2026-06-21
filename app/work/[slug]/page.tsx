import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { WorkProjectCard } from "@/components/work/work-project-card";
import {
  getNextProject,
  getProject,
  getRelatedProjects,
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

  const relatedProjects = getRelatedProjects(project.slug, 2);
  const nextProject = getNextProject(project.slug);
  const storySections = project.caseStudy.length
    ? project.caseStudy
    : [
        {
          eyebrow: "The challenge",
          title: "What the business needed to solve.",
          body: project.challenge,
        },
        {
          eyebrow: "The response",
          title: "How Casevia approached it.",
          body: project.solution,
        },
      ];

  return (
    <main className="overflow-hidden">
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectMetrics project={project} />
      <ProjectStory project={project} sections={storySections} />
      <ProjectCapabilities project={project} />

      {relatedProjects.length ? (
        <RelatedWork
          projects={relatedProjects}
          nextProject={nextProject}
        />
      ) : null}
    </main>
  );
}

function ProjectHero({ project }: { project: Project }) {
  const image = project.heroImage ?? project.coverImage;

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <Eyebrow>{project.name}</Eyebrow>

          <Heading
            as="h1"
            variant="hero"
            className="mx-auto mt-5 max-w-5xl lg:text-7xl"
          >
            {project.headline}
          </Heading>

          <Text variant="lead" className="mx-auto mt-6 max-w-3xl">
            {project.subheadline}
          </Text>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm font-medium text-muted-foreground">
            <span>{project.period}</span>
            <span aria-hidden="true" className="size-1 rounded-full bg-border" />
            <span>{project.status}</span>
            {project.liveUrl ? (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary/75"
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

        {image ? (
          <div className="mt-12 overflow-hidden rounded-3xl bg-muted sm:mt-16">
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
              sizes="(min-width: 1280px) 1216px, 100vw"
              className={cn(
                "h-auto max-h-[760px] w-full object-cover object-top",
                project.coverImageClassName,
              )}
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.58fr_0.42fr] lg:gap-20">
          <div>
            <Eyebrow>The work</Eyebrow>
            <Heading as="h2" variant="section" className="mt-4 max-w-3xl">
              {project.summary}
            </Heading>
            <Text variant="lead" className="mt-6 max-w-2xl text-foreground/80">
              {project.description}
            </Text>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <MetaList title="Services" items={project.services} />
            <MetaList title="Deliverables" items={project.deliverables} />

            <div className="grid grid-cols-2 gap-6">
              <MetaValue title="Client" value={project.clientType} />
              <MetaValue title="Role" value={project.role} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function MetaList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
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
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-foreground/75">{value}</p>
    </div>
  );
}

function ProjectMetrics({ project }: { project: Project }) {
  if (!project.metrics.length) return null;

  return (
    <section className="bg-muted/60 py-16 sm:py-20">
      <Container>
        <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <p className="font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
                {metric.value}
              </p>
              <p className="mt-4 text-sm font-semibold text-foreground">
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
    <section className="py-16 sm:py-20 lg:py-28">
      <Container>
        <div className="space-y-20 sm:space-y-28">
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

  return (
    <article>
      <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr] lg:gap-14">
        <Eyebrow className="text-muted-foreground">
          {section.eyebrow ?? `Chapter ${index + 1}`}
        </Eyebrow>

        <div>
          <Heading as="h2" variant="section" className="max-w-3xl">
            {section.title}
          </Heading>
          <Text variant="lead" className="mt-6 max-w-2xl">
            {section.body}
          </Text>

          {section.quote ? (
            <blockquote className="mt-10 max-w-2xl">
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
        <div className="mt-12 overflow-hidden rounded-3xl bg-muted sm:mt-16">
          <Image
            src={image}
            alt={imageAlt}
            width={1800}
            height={1125}
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="h-auto w-full object-cover object-top"
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
        <div className="grid gap-8 rounded-3xl bg-muted/60 p-6 sm:p-10 lg:grid-cols-[0.4fr_0.6fr] lg:p-14">
          <div>
            <Eyebrow>Built with</Eyebrow>
            <Heading as="h2" variant="subsection" className="mt-4 max-w-sm">
              Technology and capabilities behind the work.
            </Heading>
          </div>

          <div className="flex flex-wrap content-start gap-2">
            {project.stack.map((item) => (
              <span
                key={item}
                className="rounded-full bg-background px-4 py-2 text-sm font-medium text-foreground/75"
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

function RelatedWork({
  projects,
  nextProject,
}: {
  projects: Project[];
  nextProject: Project | null;
}) {
  return (
    <section className="bg-muted/40 py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <Eyebrow>More work</Eyebrow>
            <Heading as="h2" variant="section" className="mt-4">
              Continue exploring.
            </Heading>
          </div>

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:inline-flex",
              )}
            >
              Next project
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={17}
                strokeWidth={1.8}
              />
            </Link>
          ) : null}
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 lg:grid-cols-2">
          {projects.map((project, index) => (
            <WorkProjectCard
              key={project.slug}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
