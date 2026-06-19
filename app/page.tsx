import { FaqSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyCaseviaSection } from "@/components/sections/why-casevia-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <SelectedWorkSection />
      <ProcessSection />
      <WhyCaseviaSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
