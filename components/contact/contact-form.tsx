"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      budget: String(formData.get("budget") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        success?: boolean;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send message.");
      }

      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again or email us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={26}
            strokeWidth={1.8}
          />
        </div>

        <Heading as="h2" variant="subsection" className="mt-6">
          Message received.
        </Heading>

        <Text variant="body" className="mt-3">
          Thanks for reaching out. We will review your project details and reply
          with the clearest next step.
        </Text>

        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-7 h-11 rounded-full bg-card px-5 font-semibold",
          )}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6 lg:p-8"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

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

      {error ? (
        <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          buttonVariants({ size: "lg" }),
          "mt-6 h-12 w-full rounded-full font-semibold disabled:pointer-events-none disabled:opacity-60",
        )}
      >
        {isSubmitting ? (
          <>
            <span className="mr-2 size-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={18}
              strokeWidth={1.8}
              className="ml-2"
            />
          </>
        )}
      </button>

      <Text variant="caption" className="mt-4">
        Prefer email? Contact{" "}
        <Link
          href="mailto:hello@casevia.io"
          className="font-semibold text-primary"
        >
          hello@casevia.io
        </Link>
        .
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
