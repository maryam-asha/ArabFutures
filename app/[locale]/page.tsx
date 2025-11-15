import CsrfManager from "@app/dashboard/___blocks/csrf-provider-client";
import { TermCategoryOption } from "@root/dal/dal.types";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findFeaturedTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

import AboutSection from "./___blocks/about-section";
import { FailedToLoad } from "./___blocks/failed-to-load";
import { FeaturedTermsLoading } from "./___blocks/featured-terms-loading";
import { FeaturedTermsSection } from "./___blocks/featured-terms-section";
import FriendsSection from "./___blocks/friends-section";
import HeroSection from "./___blocks/hero-section";
import OurWorkSection from "./___blocks/our-work-section";
import ProjectsSection from "./___blocks/projects-section";

// This is our new self-contained, async component
async function FeaturedTermsDataWrapper() {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.featuredTerms");

  try {
    const [featuredTerms, categories] = await Promise.all([findFeaturedTerms(locale), findActiveCategoryOptions(locale)]);
    return <FeaturedTermsSection terms={featuredTerms} categories={categories} />;
  } catch (error) {
    console.error("Database fetch failed for FeaturedTermsDataWrapper:", error);
    return <FailedToLoad />;
  }
}

export default async function LandingPage() {
  const locale = (await getLocale()) as AppLocale;
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("csrf_token")?.value ?? "";

  let categories: TermCategoryOption[] = [];
  try {
    categories = await findActiveCategoryOptions(locale);
  } catch (error) {
    console.error("Could not fetch categories for Hero section:", error);
  }

  return (
    <CsrfManager initialToken={csrfToken}>
      <div className="flex flex-col space-y-8 md:space-y-16 lg:space-y-24 px-2 md:px-8">
        <HeroSection categories={categories} />
        <AboutSection />
        <OurWorkSection />
        <ProjectsSection />
        <Suspense fallback={<FeaturedTermsLoading />}>
          <FeaturedTermsDataWrapper />
        </Suspense>
        <FriendsSection />
      </div>
    </CsrfManager>
  );
}
