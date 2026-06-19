"use client";

import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { buttonVariants } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const projectTypes = [
  "Business website",
  "Web app / dashboard",
  "E-commerce",
  "Booking system",
  "AI / automation",
  "Redesign",
];

const budgetRanges = [
  "€500 – €1,000",
  "€1,000 – €2,500",
  "€2,500 – €5,000",
  "€5,000+",
  "Not sure yet",
];

export function ContactForm() {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const company = String(formData.get("company") ?? "");
    const projectType = String(formData.get("projectType") ?? "");
    const budget = String(formData.get("budget") ?? "");
    const message = String(formData.get("message") ?? "");

    const subject = encodeURIComponent("New project inquiry for Casevia");

    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company}`,
        `Project type: ${projectType}`,
        `Budget: ${budget}`,
        "",
        "Project details:",
        message,
      ].join("\n"),
    );

    window.location.href = `mailto:hello@casevia.io?subject=${subject}&body=${body}`;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <div>
        <Heading as="h2" variant="subsection">
          Project details
        </Heading>

        <Text variant="body-sm" className="mt-2">
          A few details are enough to start.
        </Text>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" placeholder="John Doe" required />

        <Field
          label="Email address"
          name="email"
          type="email"
          placeholder="john@company.com"
          required
        />

        <Field label="Company" name="company" placeholder="Company name" />

        <Select
          label="Project type"
          name="projectType"
          options={projectTypes}
        />
      </div>

      <div className="mt-4">
        <Select label="Budget range" name="budget" options={budgetRanges} />
      </div>

      <div className="mt-4">
        <Label htmlFor="message">Project details</Label>

        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What are you building? What should it solve? Any deadline, reference websites, or must-have features?"
          className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-4 text-sm font-medium leading-7 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
        />
      </div>

      <button
        type="submit"
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 h-12 w-full rounded-full font-semibold",
        )}
      >
        Send message
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          size={18}
          strokeWidth={1.8}
          className="ml-2"
        />
      </button>

      <Text variant="caption" className="mt-4">
        Opens your email client with the project details filled in.
      </Text>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>

      <select
        id={name}
        name={name}
        className="mt-2 h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-medium text-foreground outline-none transition-colors focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
      >
        <option value="">Select</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-semibold text-foreground", className)}
      {...props}
    />
  );
}
