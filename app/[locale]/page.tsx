import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findFeaturedTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";

import AboutSection from "./___blocks/about-section";
import { FeaturedTermsSection } from "./___blocks/featured-terms-section";
import FriendsSection from "./___blocks/friends-section";
import HeroSection from "./___blocks/hero-section";
import OurWorkSection from "./___blocks/our-work-section";
import ProjectsSection from "./___blocks/project-section";
import VisionMissionSection from "./___blocks/vision-mission-section";

export default async function LandingPage() {
  const locale = (await getLocale()) as AppLocale;
  const [featuredTerms, categories] = await Promise.all([findFeaturedTerms(locale), findActiveCategoryOptions(locale)]);

  const t = await getTranslations("Public");

  return (
    <div className="flex flex-col space-y-24 md:space-y-32 lg:space-y-40">
      <HeroSection categories={categories} />
      <VisionMissionSection />
      <OurWorkSection />
      <AboutSection />
      <ProjectsSection />
      <FeaturedTermsSection terms={featuredTerms} categories={categories} />
      <FriendsSection />
    </div>
  );
}
