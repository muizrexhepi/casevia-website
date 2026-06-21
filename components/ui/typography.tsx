import * as React from "react";

import { cn } from "@/lib/utils";

type HeadingVariant = "hero" | "section" | "subsection" | "card" | "small";

type TextVariant = "lead" | "body" | "body-sm" | "caption" | "muted";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  variant?: HeadingVariant;
};

type TextProps = React.HTMLAttributes<HTMLElement> & {
  as?: "p" | "span" | "div";
  variant?: TextVariant;
};

function Heading({
  as: Comp = "h2",
  variant = "section",
  className,
  ...props
}: HeadingProps) {
  return (
    <Comp
      className={cn(
        "font-heading font-semibold text-foreground",
        {
          hero: "text-[2.55rem] leading-[1.02] tracking-[-0.04em] sm:text-5xl sm:leading-[1] sm:tracking-[-0.045em] lg:text-6xl",
          section:
            "text-[2rem] leading-[1.08] tracking-[-0.035em] sm:text-4xl lg:text-5xl",
          subsection: "text-2xl leading-[1.15] tracking-[-0.025em] sm:text-3xl",
          card: "text-xl leading-[1.2] tracking-[-0.018em]",
          small: "text-lg leading-[1.25] tracking-[-0.015em]",
        }[variant],
        className,
      )}
      {...props}
    />
  );
}

function Text({
  as: Comp = "p",
  variant = "body",
  className,
  ...props
}: TextProps) {
  return (
    <Comp
      className={cn(
        {
          lead: "text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8",
          body: "text-[15px] leading-7 text-muted-foreground sm:text-base",
          "body-sm": "text-sm leading-6 text-muted-foreground",
          caption: "text-xs font-medium leading-5 text-muted-foreground",
          muted: "text-sm leading-6 text-muted-foreground",
        }[variant],
        className,
      )}
      {...props}
    />
  );
}

function Eyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.16em] text-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Heading, Text, Eyebrow };
