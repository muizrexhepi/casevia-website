import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";

const testimonials = [
  {
    quote:
      "Casevia built our platform from the ground up. The design is beautiful, the performance is outstanding, and the final product feels premium.",
    name: "Hamza R.",
    role: "Founder",
  },
  {
    quote:
      "Their attention to detail and communication is unmatched. The experience they created is clean, fast, and easy for our users.",
    name: "Sara K.",
    role: "Product Lead",
  },
  {
    quote:
      "Professional, reliable, and results-driven. Casevia delivered beyond our expectations and helped us move faster.",
    name: "Usman A.",
    role: "Business Owner",
  },
];

export function TestimonialsSection() {
  return (
    <Section>
      <Container>
        <SectionHeader
          title="Trusted by businesses that care about quality."
          description="We work with founders, operators, and business owners who want a serious digital presence — not another generic template."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="h-full">
              <CardContent className="pt-6">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-accent font-heading text-3xl font-semibold leading-none text-primary">
                  “
                </div>

                <Text variant="body-sm" className="mt-7">
                  {testimonial.quote}
                </Text>

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-semibold text-primary">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
