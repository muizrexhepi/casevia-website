import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { getHeroStripProjects, type Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type LogoProject = Pick<
  Project,
  "slug" | "name" | "logoImage" | "logoAlt" | "logoImageClassName"
>;

export function ClientLogoMarquee() {
  const projects = getHeroStripProjects();

  if (!projects.length) return null;

  return (
    <Section spacing="xs" aria-label="Clients and products">
      <Container>
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="casevia-logo-track flex w-max">
            <LogoGroup projects={projects} />
            <LogoGroup projects={projects} hidden />
          </div>
        </div>
      </Container>
    </Section>
  );
}

function LogoGroup({
  projects,
  hidden = false,
}: {
  projects: LogoProject[];
  hidden?: boolean;
}) {
  return (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
    >
      {projects.map((project) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          aria-label={hidden ? undefined : `View ${project.name} case study`}
          title={hidden ? undefined : project.name}
          tabIndex={hidden ? -1 : undefined}
          className="flex h-12 w-[145px] shrink-0 items-center justify-center opacity-40 transition-opacity hover:opacity-70"
        >
          <Image
            src={project.logoImage || "/logo.svg"}
            alt={hidden ? "" : (project.logoAlt ?? `${project.name} logo`)}
            width={160}
            height={48}
            className={cn(
              "max-h-7 w-auto max-w-[130px] object-contain grayscale brightness-0",
              project.logoImageClassName,
            )}
          />
        </Link>
      ))}
    </div>
  );
}
