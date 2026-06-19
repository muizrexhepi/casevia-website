"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How long does a project take?",
    answer:
      "Most business websites take 2–5 weeks. Larger web apps, dashboards, booking systems, or custom platforms usually take 6–12+ weeks depending on scope.",
  },
  {
    question: "Do you provide post-launch support?",
    answer:
      "Yes. Casevia can handle maintenance, small edits, performance checks, analytics review, SEO basics, hosting support, and ongoing product improvements.",
  },
  {
    question: "Which technologies do you use?",
    answer:
      "We mainly work with Next.js, React, TypeScript, Tailwind CSS, Supabase, Convex, Firebase, Node.js, Stripe, Resend, and modern AI APIs.",
  },
  {
    question: "Can you work with an existing website or team?",
    answer:
      "Yes. We can redesign an existing website, improve performance, add new features, or work alongside your current designer, developer, or marketing team.",
  },
  {
    question: "Do you build only websites or full web apps too?",
    answer:
      "Both. We build premium marketing websites, e-commerce websites, dashboards, booking systems, CMS platforms, internal tools, and custom web applications.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section>
      <Container className="max-w-4xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions before we start?"
          description="Clear answers about timelines, support, technology, and how we work with businesses."
          align="center"
        />

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={cn(
                  "overflow-hidden rounded-[1.5rem] border bg-card shadow-sm transition-colors",
                  isOpen ? "border-primary/25" : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-base font-semibold tracking-tight text-foreground">
                    {faq.question}
                  </span>

                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full text-lg font-medium transition-colors",
                      isOpen
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-primary",
                    )}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <Text variant="body-sm" className="px-5 pb-5 sm:px-6">
                      {faq.answer}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
