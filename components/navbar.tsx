"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowRight02Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Projects", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:h-20 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Casevia home" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Casevia"
            width={152}
            height={40}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <div className="hidden items-center lg:flex">
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-11 rounded-full px-5 font-semibold",
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
        </div>

        <button
          type="button"
          className="-mr-2 inline-flex size-10 items-center justify-center text-foreground transition-colors hover:text-primary lg:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((current) => !current)}
        >
          <HugeiconsIcon
            icon={isOpen ? Cancel01Icon : Menu01Icon}
            size={24}
            strokeWidth={1.9}
          />
        </button>
      </div>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 z-50 sm:top-20 lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 top-16 bg-foreground/5 backdrop-blur-[2px] sm:top-20"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative border-b border-border bg-background/95 px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-6">
            <div className="mx-auto w-full max-w-7xl">
              <nav className="overflow-hidden rounded-[1.75rem] border border-border bg-card p-2 shadow-sm">
                {navItems.map((item) => {
                  const isActive = isActivePath(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {item.label}
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={17}
                        strokeWidth={1.8}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  );
                })}

                <div className="mt-2 border-t border-border p-2">
                  <Link
                    href="/contact"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "h-12 w-full rounded-full font-semibold",
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
                </div>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: { label: string; href: string };
  pathname: string;
}) {
  const isActive = isActivePath(pathname, item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {item.label}
    </Link>
  );
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
