import * as React from "react";

import { cn } from "@/lib/utils";

type SectionProps = React.HTMLAttributes<HTMLElement> & {
  spacing?: "default" | "sm" | "lg";
};

function Section({ className, spacing = "default", ...props }: SectionProps) {
  return (
    <section
      className={cn(
        "bg-background",
        {
          sm: "py-16 sm:py-20",
          default: "py-20 sm:py-24",
          lg: "py-24 sm:py-28",
        }[spacing],
        className,
      )}
      {...props}
    />
  );
}

export { Section };
