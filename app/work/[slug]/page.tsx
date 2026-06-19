import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
  LinkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { WorkProjectCard } from "@/components/work/work-project-card";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import {
  getNextProject,
  getProject,
  getRelatedProjects,
  projects,
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
    title: `${project.name} — Casevia Work`,
    description: project.summary,
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

  return (
    <>
      <Section
        spacing="lg"
        className="relative overflow-hidden pt-10 sm:pt-14 lg:pt-16"
      >
        <div className="pointer-events-none absolute right-0 top-0 h-[440px] w-[440px] rounded-full bg-primary/7 blur-3xl" />

        <Container className="relative">
          <Link
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
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div>
              <Eyebrow>Case study</Eyebrow>

              <Heading as="h1" variant="hero" className="mt-4 max-w-4xl">
                {project.name}
              </Heading>

              <Text variant="lead" className="mt-6 max-w-2xl">
                {project.description}
              </Text>

              <div className="mt-8 flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <dl className="space-y-5">
                  <ProjectMeta label="Role" value={project.role} />
                  <ProjectMeta label="Period" value={project.period} />
                  <ProjectMeta label="Status" value={project.status} />

                  {project.liveUrl ? (
                    <div className="pt-2">
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
                      >
                        {project.liveLabel ?? "Open project"}
                        <HugeiconsIcon
                          icon={LinkSquare02Icon}
                          size={17}
                          strokeWidth={1.8}
                          className="ml-2"
                        />
                      </Link>
                    </div>
                  ) : null}
                </dl>
              </CardContent>
            </Card>
          </div>

          <ProjectHeroImage project={project} />
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 md:grid-cols-3">
            {project.metrics.map((metric) => (
              <Card key={metric.label}>
                <CardContent className="pt-6">
                  <div className="font-heading text-3xl font-semibold tracking-tight text-foreground">
                    {metric.value}
                  </div>

                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {metric.label}
                  </p>

                  {metric.description ? (
                    <Text variant="body-sm" className="mt-2">
                      {metric.description}
                    </Text>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <CaseTextBlock
              eyebrow="The challenge"
              title="What needed to be solved"
              body={project.challenge}
            />

            <CaseTextBlock
              eyebrow="Our solution"
              title="How we approached it"
              body={project.solution}
            />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <Eyebrow>Project scope</Eyebrow>

              <Heading as="h2" variant="section" className="mt-4">
                Built across design, product, and engineering.
              </Heading>

              <Text variant="body" className="mt-5">
                Each project is shaped around the business need, not around a
                generic template. The scope depends on what the product needs to
                work properly in the real world.
              </Text>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {project.scope.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={18}
                      strokeWidth={1.8}
                    />
                  </div>

                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            <ListBlock
              eyebrow="Key highlights"
              title="What was delivered"
              items={project.highlights}
            />

            <ListBlock
              eyebrow="Outcome"
              title="Why it matters"
              items={project.outcome}
            />
          </div>
        </Container>
      </Section>

      <Section className="pt-0">
        <Container>
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <Eyebrow>Tech stack</Eyebrow>

                <Heading as="h2" variant="subsection" className="mt-4">
                  Tools used on this project.
                </Heading>
              </div>

              <div className="flex max-w-3xl flex-wrap gap-2">
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
      </Section>

      {relatedProjects.length > 0 ? (
        <Section className="pt-0">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <div>
                <Eyebrow>More work</Eyebrow>

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
        </Section>
      ) : null}
    </>
  );
}

function ProjectMeta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function ProjectHeroImage({
  project,
}: {
  project: NonNullable<ReturnType<typeof getProject>>;
}) {
  return (
    <div
      className={cn(
        "relative mt-12 min-h-[360px] overflow-hidden rounded-[2rem] border border-border bg-muted shadow-sm sm:min-h-[520px]",
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
      {project.coverImage ? (
        <div className="absolute inset-x-4 bottom-0 top-10 overflow-hidden rounded-t-[1.5rem] border border-white/15 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:inset-x-10 sm:top-16">
          <Image
            src={project.coverImage}
            alt={project.coverAlt ?? `${project.name} project preview`}
            fill
            priority
            sizes="100vw"
            className={cn(
              "object-cover object-top",
              project.coverImageClassName,
            )}
          />
        </div>
      ) : (
        <div className="absolute inset-x-4 bottom-0 top-10 rounded-t-[1.5rem] border border-white/15 bg-white/10 backdrop-blur sm:inset-x-10 sm:top-16" />
      )}
    </div>
  );
}

function CaseTextBlock({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6 sm:pt-8">
        <Eyebrow>{eyebrow}</Eyebrow>

        <Heading as="h2" variant="subsection" className="mt-4">
          {title}
        </Heading>

        <Text variant="body" className="mt-5">
          {body}
        </Text>
      </CardContent>
    </Card>
  );
}

function ListBlock({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardContent className="pt-6 sm:pt-8">
        <Eyebrow>{eyebrow}</Eyebrow>

        <Heading as="h2" variant="subsection" className="mt-4">
          {title}
        </Heading>

        <div className="mt-7 space-y-4">
          {items.map((item) => (
            <div key={item} className="flex gap-3">
              <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={15}
                  strokeWidth={1.8}
                />
              </div>

              <Text variant="body-sm">{item}</Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
