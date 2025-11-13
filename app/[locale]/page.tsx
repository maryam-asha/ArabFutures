import CsrfManager from "@app/dashboard/___blocks/csrf-provider-client";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findFeaturedTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

import AboutSection from "./___blocks/about-section";
import { FeaturedTermsSection } from "./___blocks/featured-terms-section";
import FriendsSection from "./___blocks/friends-section";
import HeroSection from "./___blocks/hero-section";
import OurWorkSection from "./___blocks/our-work-section";
import ProjectsSection from "./___blocks/projects-section";

export default async function LandingPage() {
  const locale = (await getLocale()) as AppLocale;
  const [featuredTerms, categories] = await Promise.all([findFeaturedTerms(locale), findActiveCategoryOptions(locale)]);

  const t = await getTranslations("Public");

  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("csrf_token")?.value ?? "";

  return (
    <div className="flex flex-col space-y-8 md:space-y-16 lg:space-y-24 px-2 md:px-8">
      <CsrfManager initialToken={csrfToken}>
        <HeroSection categories={categories} />
        <AboutSection />
        <OurWorkSection />
        <ProjectsSection />
        <FeaturedTermsSection terms={featuredTerms} categories={categories} />
      </CsrfManager>
      <FriendsSection />
    </div>
  );
}
