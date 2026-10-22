import HeroSection from "./___blocks/hero-section";
import { GetInvolvedSection, QuoteSection } from "./___blocks/home/closing-sections";
import { HomeMotion } from "./___blocks/home/home-motion";
import LanguageSection from "./___blocks/home/language-section";
import NetworkSection from "./___blocks/home/network-section";
import ProjectsSection from "./___blocks/projects-section";

/**
 * Homepage, in the order of the Figma design. The travelling square links Hero → Growing Network →
 * the constellation statement → Projects (see ___blocks/home/home-motion.tsx).
 * About / What We Do now live on /about; the newsletter bar is part of the site footer.
 */
export default function LandingPage() {
  return (
    <HomeMotion>
      <HeroSection />
      <NetworkSection />
      <LanguageSection />
      <ProjectsSection />
      <QuoteSection />
      <GetInvolvedSection />
    </HomeMotion>
  );
}
