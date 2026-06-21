import { FaqSection } from "@/components/sections/faq-section";
import { ClientLogoMarquee } from "@/components/sections/client-logo-marquee";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { ServicesSection } from "@/components/sections/services-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ClientLogoMarquee />
      <SelectedWorkSection />
      <ServicesSection />
      <ProcessSection />
      <FaqSection />
    </>
  );
}
