"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Why Casevia instead of a freelancer or AI website builder?",
    answer:
      "Because the work is not just putting pages together. We help define what the website or system should do for the business, then design and build around that goal.",
  },
  {
    question: "What kind of projects do you take on?",
    answer:
      "Premium business websites, dashboards, booking systems, e-commerce platforms, mobile apps, and AI workflows. We are best suited for businesses that need quality, trust, and a practical system behind the design.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A focused business website can take 2–5 weeks. Dashboards, booking systems, mobile apps, and larger platforms usually take longer depending on scope.",
  },
  {
    question: "Do you work with EU clients?",
    answer:
      "Yes. We work remotely and can support clients across EU time zones, especially businesses that need a serious digital presence or operational software.",
  },
  {
    question: "Can you improve an existing website?",
    answer:
      "Yes. If the foundation is solid, we can redesign, improve performance, clean up the structure, or add new features. If the foundation is weak, rebuilding properly may be the better option.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. We can support maintenance, content updates, performance checks, SEO improvements, and continued feature work after launch.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const leftColumn = faqs.filter((_, index) => index % 2 === 0);
  const rightColumn = faqs.filter((_, index) => index % 2 !== 0);

  return (
    <Section className="bg-background">
      <Container>
        <div className="mb-10 max-w-3xl">
          <Heading as="h2" variant="section">
            Questions before we start?
          </Heading>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="border-t border-border">
            {leftColumn.map((faq) => {
              const originalIndex = faqs.indexOf(faq);

              return (
                <FaqItem
                  key={faq.question}
                  faq={faq}
                  isOpen={openIndex === originalIndex}
                  onToggle={() =>
                    setOpenIndex(
                      openIndex === originalIndex ? null : originalIndex,
                    )
                  }
                />
              );
            })}
          </div>

          <div className="border-t border-border">
            {rightColumn.map((faq) => {
              const originalIndex = faqs.indexOf(faq);

              return (
                <FaqItem
                  key={faq.question}
                  faq={faq}
                  isOpen={openIndex === originalIndex}
                  onToggle={() =>
                    setOpenIndex(
                      openIndex === originalIndex ? null : originalIndex,
                    )
                  }
                />
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}

function FaqItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: {
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
      >
        <span className="text-base font-semibold tracking-tight text-foreground">
          {faq.question}
        </span>

        <span className="flex size-7 shrink-0 items-center justify-center text-xl leading-none text-muted-foreground transition-colors hover:text-primary">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <Text variant="body-sm" className="pb-5 pr-8">
            {faq.answer}
          </Text>
        </div>
      </div>
    </div>
  );
}
