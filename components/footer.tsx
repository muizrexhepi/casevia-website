import Image from "next/image";
import Link from "next/link";
import {
  Globe02Icon,
  GithubIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { FooterCta } from "@/components/footer-cta";
import { Text } from "@/components/ui/typography";

const navigation = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const services = [
  { label: "Business Websites", href: "/services#business-websites" },
  { label: "Web Apps & Dashboards", href: "/services#web-apps-dashboards" },
  { label: "E-commerce", href: "/services#ecommerce" },
  { label: "AI & Automation", href: "/services#ai-automation" },
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
    href: "https://x.com/muiz_rexhepi",
    icon: NewTwitterIcon,
  },
];

export function Footer() {
  return (
    <footer className="bg-muted/35">
      <div className="mx-auto w-full max-w-7xl px-5 pb-8 pt-10 sm:px-6 sm:pt-12 lg:px-8 lg:pt-14">
        <FooterCta />

        <div className="pt-10 sm:pt-12">
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
                An independent European software studio designing and building
                digital products for ambitious businesses.
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

            <div className="grid gap-10 sm:grid-cols-3">
              <FooterColumn title="Navigation" links={navigation} />
              <FooterColumn title="Services" links={services} />

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
                      href="https://casevia.io"
                      className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                    >
                      <HugeiconsIcon
                        icon={Globe02Icon}
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
                    <span>Europe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Casevia. All rights reserved.</p>

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
