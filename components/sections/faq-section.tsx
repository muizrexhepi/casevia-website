"use client";

import { useState } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Heading, Text } from "@/components/ui/typography";

const faqs = [
  {
    question: "Where are you based, and where do you work?",
    answer:
      "Casevia is based in Europe and works remotely with businesses across Europe and internationally. Projects are run in English with clear written communication and regular working sessions.",
  },
  {
    question: "What kind of project is a good fit?",
    answer:
      "The best fit is a business with a meaningful website, platform, or workflow problem—not a fixed list of pages that only needs styling. We are most useful when product thinking, design, and engineering all matter.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "A focused business website usually takes 3–6 weeks. A custom platform or product commonly takes 8–16+ weeks. After an initial conversation, we break the work into a clear scope and realistic delivery stages.",
  },
  {
    question: "Can you join an existing product or team?",
    answer:
      "Yes. We can redesign an existing product, take ownership of a specific workstream, or collaborate with your internal product, design, engineering, or marketing team.",
  },
  {
    question: "What happens after launch?",
    answer:
      "We can stay involved for maintenance, product iteration, analytics, conversion improvements, and new features. The goal is a product that keeps becoming more useful, not a handoff that goes quiet after launch.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.38fr_0.62fr] lg:gap-20">
          <div>
            <Heading as="h2" variant="section" className="max-w-md">
              Before we start, a few straight answers.
            </Heading>
            <Text className="mt-5 max-w-sm">
              Where we work, how projects run, and what a useful collaboration
              looks like.
            </Text>
          </div>

          <div className="border-t border-border">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.question} className="border-b border-border">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-5 py-6 text-left sm:py-7"
                  >
                    <span className="font-heading text-lg font-semibold tracking-tight text-foreground">
                      {faq.question}
                    </span>
                    <span className="flex size-9 shrink-0 items-center justify-center text-xl font-medium text-primary">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <Text variant="body-sm" className="max-w-2xl pb-6 sm:pb-7">
                        {faq.answer}
                      </Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
