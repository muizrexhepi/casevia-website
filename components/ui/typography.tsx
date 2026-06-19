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
        "font-heading font-semibold text-foreground tracking-tight",
        {
          hero: "text-4xl leading-[1.02] tracking-[-0.05em] sm:text-5xl lg:text-6xl",
          section:
            "text-3xl leading-[1.08] tracking-[-0.045em] sm:text-4xl lg:text-5xl",
          subsection: "text-2xl leading-[1.15] tracking-[-0.035em] sm:text-3xl",
          card: "text-xl leading-[1.2] tracking-[-0.025em]",
          small: "text-lg leading-[1.25] tracking-[-0.02em]",
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
          lead: "text-base leading-8 text-muted-foreground sm:text-lg",
          body: "text-base leading-7 text-muted-foreground",
          "body-sm": "text-sm leading-7 text-muted-foreground",
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
        "text-xs font-semibold uppercase tracking-[0.18em] text-primary",
        className,
      )}
      {...props}
    />
  );
}

export { Heading, Text, Eyebrow };
