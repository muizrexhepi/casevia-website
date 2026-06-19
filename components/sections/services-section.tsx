import Link from "next/link";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heading, Text } from "@/components/ui/typography";

const services = [
  {
    title: "Business Websites",
    description:
      "Premium websites that help restaurants, clinics, service businesses, and brands look credible and convert visitors.",
  },
  {
    title: "Web Apps & Dashboards",
    description:
      "Custom dashboards, admin panels, booking systems, portals, and tools built around real business workflows.",
  },
  {
    title: "E-commerce",
    description:
      "Fast, polished product catalogs and online stores with strong presentation and clean buying flows.",
  },
  {
    title: "AI & Automation",
    description:
      "AI-powered features and automations that reduce manual work, improve operations, and create leverage.",
  },
];

export function ServicesSection() {
  return (
    <Section>
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <SectionHeader
            eyebrow="Services"
            title="End-to-end software solutions tailored to you."
            description="From strategy to launch, we build digital products that are clean, scalable, and focused on business outcomes."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => (
              <Link key={service.title} href="/services" className="block">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-accent font-heading text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <Heading as="h3" variant="card" className="mt-6">
                      {service.title}
                    </Heading>
                  </CardHeader>

                  <CardContent className="pt-3">
                    <Text variant="body-sm">{service.description}</Text>
                  </CardContent>

                  <CardFooter className="pt-6">
                    <span className="inline-flex items-center text-sm font-semibold text-primary">
                      Learn more
                      <HugeiconsIcon
                        icon={ArrowRight02Icon}
                        size={17}
                        strokeWidth={1.8}
                        className="ml-2 transition-transform duration-300 group-hover/card:translate-x-1"
                      />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
