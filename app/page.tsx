import { FaqSection } from "@/components/sections/faq-section";
import { ClientLogoMarquee } from "@/components/sections/client-logo-marquee";
import { HeroSection } from "@/components/sections/hero-section";
import { SelectedWorkSection } from "@/components/sections/selected-work-section";
import { StudioOverviewSection } from "@/components/sections/studio-overview-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ClientLogoMarquee />
      <SelectedWorkSection />
      <StudioOverviewSection />
      <FaqSection />
    </>
  );
}
