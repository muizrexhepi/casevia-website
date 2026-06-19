import { Eyebrow, Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}

      <Heading as="h2" variant="section" className="mt-4">
        {title}
      </Heading>

      {description ? (
        <Text variant="body" className="mt-5 max-w-2xl">
          {description}
        </Text>
      ) : null}
    </div>
  );
}

export { SectionHeader };
