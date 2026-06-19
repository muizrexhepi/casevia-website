import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight02Icon,
  GithubIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Business Websites", href: "/services/business-websites" },
  { label: "Web Apps & Dashboards", href: "/services/web-apps-dashboards" },
  { label: "E-commerce", href: "/services/ecommerce-websites" },
  { label: "AI & Automation", href: "/services/ai-automation" },
];

const company = [
  { label: "About Casevia", href: "/about" },
  { label: "Our Process", href: "/process" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blog" },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muiz-rexhepi",
    icon: Linkedin01Icon,
  },
  {
    label: "GitHub",
    href: "https://github.com/muizrexhepi",
    icon: GithubIcon,
  },
  {
    label: "X",
    href: "https://x.com/007lazi",
    icon: NewTwitterIcon,
  },
];

export function Footer() {
  return (
    <footer className=" bg-background">
      <div className="mx-auto w-full max-w-7xl px-5 pb-10 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent blur-2xl" />

            <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Heading as="h2" variant="subsection">
                  Ready to build something exceptional?
                </Heading>

                <Text variant="body" className="mt-3 max-w-2xl">
                  Let&apos;s turn your website, platform, dashboard, or product
                  idea into a premium digital experience.
                </Text>
              </div>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 w-full rounded-full px-6 font-semibold sm:w-auto",
                  )}
                >
                  Book a discovery call
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={18}
                    strokeWidth={1.8}
                    className="ml-2"
                  />
                </Link>

                <Link
                  href="mailto:hello@casevia.io"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 w-full rounded-full bg-card px-6 font-semibold sm:w-auto",
                  )}
                >
                  Send us a message
                  <HugeiconsIcon
                    icon={SentIcon}
                    size={18}
                    strokeWidth={1.8}
                    className="ml-2"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border pt-12 sm:mt-16 sm:pt-14">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
            <div>
              <Link href="/" aria-label="Casevia home" className="inline-flex">
                <Image
                  src="/logo.svg"
                  alt="Casevia"
                  width={152}
                  height={40}
                  className="h-9 w-auto"
                />
              </Link>

              <Text variant="body-sm" className="mt-5 max-w-sm">
                Premium software agency building websites, web apps, dashboards,
                e-commerce platforms, and AI products that help businesses stand
                out and grow.
              </Text>

              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:bg-accent hover:text-primary"
                  >
                    <HugeiconsIcon
                      icon={social.icon}
                      size={18}
                      strokeWidth={1.8}
                    />
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <FooterColumn title="Navigation" links={navigation} />
              <FooterColumn title="Services" links={services} />
              <FooterColumn title="Company" links={company} />

              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  Let&apos;s talk
                </h3>

                <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="mailto:hello@casevia.io"
                      className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                    >
                      <HugeiconsIcon
                        icon={Mail01Icon}
                        size={17}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />
                      hello@casevia.io
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                    >
                      <HugeiconsIcon
                        icon={SentIcon}
                        size={17}
                        strokeWidth={1.8}
                        className="shrink-0"
                      />
                      casevia.io
                    </Link>
                  </li>

                  <li className="inline-flex items-center gap-2">
                    <HugeiconsIcon
                      icon={Location01Icon}
                      size={17}
                      strokeWidth={1.8}
                      className="shrink-0"
                    />
                    <span>Tetovo, North Macedonia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Casevia. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="transition-colors hover:text-primary"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>

      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
