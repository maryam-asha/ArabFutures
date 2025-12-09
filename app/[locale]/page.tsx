import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { findFeaturedTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";
import { Suspense } from "react";

import AboutSection from "./___blocks/about-section";
import { FailedToLoad } from "./___blocks/failed-to-load";
import { FeaturedTermsLoading } from "./___blocks/featured-terms-loading";
import { FeaturedTermsSection } from "./___blocks/featured-terms-section";
import HeroSection from "./___blocks/hero-section";
import NewsletterSection from "./___blocks/newsletter-section";
import OurWorkSection from "./___blocks/our-work-section";
import ProjectsSection from "./___blocks/projects-section";

async function FeaturedTermsWrapper() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.featuredTerms");

  try {
    const [featuredTerms, categories] = await Promise.all([findFeaturedTerms(locale), getActiveCategoryOptionsAction(locale)]);
    return <FeaturedTermsSection terms={featuredTerms} categories={categories} />;
  } catch (error) {
    console.error("Database fetch failed for FeaturedTermsDataWrapper:", error);
    return <FailedToLoad />;
  }
}

export default async function LandingPage() {
  return (
    <div className="flex flex-col space-y-8 md:space-y-16 lg:space-y-24 px-2 md:px-8">
      <HeroSection />
      <AboutSection />
      <OurWorkSection />
      <ProjectsSection />
      <Suspense fallback={<FeaturedTermsLoading />}>
        <FeaturedTermsWrapper />
      </Suspense>
      {/* <FriendsSection /> */}
      <NewsletterSection />
    </div>
  );
}
