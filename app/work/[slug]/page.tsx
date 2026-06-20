import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { WorkProjectCard } from "@/components/work/work-project-card";
import { Heading, Text } from "@/components/ui/typography";
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
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project not found — Casevia",
    };
  }

  return {
    title: project.seoTitle ?? `${project.name} Case Study — Casevia`,
    description: project.seoDescription ?? project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.slug, 2);
  const nextProject = getNextProject(project.slug);

  const storySections =
    project.caseStudy?.length > 0
      ? project.caseStudy
      : [
          {
            eyebrow: "Starting point",
            title: "What needed to be solved",
            body: project.challenge,
          },
          {
            eyebrow: "Solution",
            title: "How it was approached",
            body: project.solution,
          },
        ];

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <CaseStudyHero project={project} />

      <CaseStudyIntro project={project} />

      <CaseStudyMetrics project={project} />

      <CaseStudyStory project={project} sections={storySections} />

      <CaseStudyStack project={project} />

      {relatedProjects.length > 0 ? (
        <RelatedWork
          relatedProjects={relatedProjects}
          nextProject={nextProject}
        />
      ) : null}
    </main>
  );
}

function CaseStudyHero({ project }: { project: Project }) {
  const heroImage = project.heroImage ?? project.coverImage;

  return (
    <section className="relative pb-10 pt-8 sm:pb-14 sm:pt-10 lg:pb-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--primary)_0,transparent_34%)] opacity-[0.055]" />

      <Container className="relative">
        {/* <Link
          href="/work"
          className="inline-flex items-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
        >
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            size={17}
            strokeWidth={1.8}
            className="mr-2"
          />
          Back to work
        </Link> */}

        <div
          className={cn(
            "mt-8 overflow-hidden rounded-[2rem] border border-border p-3 shadow-[0_24px_90px_rgba(15,23,42,0.08)] sm:p-4 lg:p-5",
            getProjectGradient(project.visualTheme),
          )}
        >
          {heroImage ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/30 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.16)]">
              <Image
                src={heroImage}
                alt={
                  project.heroAlt ??
                  project.coverAlt ??
                  `${project.name} project preview`
                }
                width={1800}
                height={1100}
                priority
                sizes="100vw"
                className={cn(
                  "h-auto max-h-[680px] w-full object-cover object-top",
                  project.coverImageClassName,
                )}
              />
            </div>
          ) : (
            <div className="h-[360px] rounded-[1.5rem] border border-white/30 bg-white/50 sm:h-[520px]" />
          )}
        </div>
      </Container>
    </section>
  );
}

function CaseStudyIntro({ project }: { project: Project }) {
  return (
    <section className="pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <p className="font-heading text-2xl font-semibold tracking-tight text-muted-foreground sm:text-3xl">
            {project.name}.
          </p>

          <Heading as="h1" variant="section" className="mt-2 max-w-3xl">
            {project.headline}
          </Heading>

          <Text variant="body" className="mt-5 max-w-2xl">
            {project.subheadline}
          </Text>

          <p className="mt-5 text-sm font-medium text-muted-foreground">
            {project.period}
          </p>

          <ProjectDetails project={project} />

          <Text variant="lead" className="mt-10 max-w-2xl text-foreground">
            {project.description}
          </Text>
        </div>
      </Container>
    </section>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <div className="mt-10 border-y border-border py-7">
      <div className="grid gap-8 sm:grid-cols-3">
        <MetaList title="Services" items={project.services} />

        <MetaList title="Deliverables" items={project.deliverables} />

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Links
          </p>

          {project.liveUrl ? (
            <Link
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center text-sm font-semibold text-primary"
            >
              {project.liveLabel ?? "Open project"}
              <HugeiconsIcon
                icon={LinkSquare02Icon}
                size={16}
                strokeWidth={1.8}
                className="ml-2"
              />
            </Link>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Private project
            </p>
          )}

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Client type
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {project.clientType}
            </p>
          </div>

          <div className="mt-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Role
            </p>
            <p className="mt-3 text-sm font-medium text-foreground">
              {project.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </p>

      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm font-medium text-foreground/75">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaseStudyMetrics({ project }: { project: Project }) {
  return (
    <section className="pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="mx-auto max-w-3xl border-b border-border pb-10">
          <div className="grid gap-7 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <div className="font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {metric.value}
                </div>

                <p className="mt-3 text-sm font-semibold text-foreground">
                  {metric.label}
                </p>

                {metric.description ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {metric.description}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CaseStudyStory({
  project,
  sections,
}: {
  project: Project;
  sections: ProjectCaseSection[];
}) {
  return (
    <section className="pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="mx-auto max-w-3xl">
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
  const galleryImage = project.galleryImages?.[index];

  const image = section.image ?? galleryImage?.src;
  const imageAlt =
    section.imageAlt ?? galleryImage?.alt ?? `${project.name} project detail`;

  return (
    <article className="py-10 first:pt-0 last:pb-0 sm:py-12">
      {section.eyebrow ? (
        <p className="text-sm font-semibold text-muted-foreground">
          {section.eyebrow}
        </p>
      ) : null}

      <Heading as="h2" variant="subsection" className="mt-3 max-w-2xl">
        {section.title}
      </Heading>

      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
        {section.body}
      </p>

      {image ? (
        <div className="mt-9 overflow-hidden rounded-[1.5rem] border border-border bg-muted shadow-sm">
          <Image
            src={image}
            alt={imageAlt}
            width={1400}
            height={900}
            sizes="(min-width: 1024px) 760px, 100vw"
            className="h-auto w-full object-cover object-top"
          />
        </div>
      ) : null}

      {section.quote ? (
        <blockquote className="mt-9 border-l border-border pl-5">
          <p className="font-heading text-2xl font-semibold leading-tight tracking-tight text-foreground">
            “{section.quote.text}”
          </p>

          {section.quote.author ? (
            <footer className="mt-5">
              <p className="text-sm font-semibold text-foreground">
                {section.quote.author}
              </p>

              {section.quote.role ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {section.quote.role}
                </p>
              ) : null}
            </footer>
          ) : null}
        </blockquote>
      ) : null}
    </article>
  );
}

function CaseStudyStack({ project }: { project: Project }) {
  return (
    <section className="pb-10 sm:pb-14 lg:pb-16">
      <Container>
        <div className="mx-auto max-w-3xl border-y border-border py-10">
          <div className="grid gap-8 sm:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Stack
              </p>

              <Heading as="h2" variant="subsection" className="mt-4">
                Tools used to build it.
              </Heading>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function RelatedWork({
  relatedProjects,
  nextProject,
}: {
  relatedProjects: Project[];
  nextProject: Project | null;
}) {
  return (
    <section className="border-t border-border bg-background py-14 text-foreground sm:py-16 lg:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              More work
            </p>

            <Heading as="h2" variant="section" className="mt-4">
              Related projects
            </Heading>
          </div>

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug}`}
              className="hidden items-center text-sm font-semibold text-primary sm:inline-flex"
            >
              Next project
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={17}
                strokeWidth={1.8}
                className="ml-2"
              />
            </Link>
          ) : null}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {relatedProjects.map((relatedProject, index) => (
            <WorkProjectCard
              key={relatedProject.slug}
              project={relatedProject}
              priority={index === 0}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

function getProjectGradient(theme: Project["visualTheme"]) {
  switch (theme) {
    case "gobusly":
      return "bg-[linear-gradient(135deg,#061b36,#0d2b55)]";
    case "hakbus":
      return "bg-[linear-gradient(135deg,#061237,#1742a8)]";
    case "doros":
      return "bg-[linear-gradient(135deg,#050507,#17120c)]";
    case "nextloop":
      return "bg-[linear-gradient(135deg,#07111f,#0d1b38)]";
    case "speaksure":
      return "bg-[linear-gradient(135deg,#06111f,#111827)]";
    case "logly":
    case "am":
    default:
      return "bg-[linear-gradient(135deg,#f6f8ff,#ffffff)]";
  }
}
