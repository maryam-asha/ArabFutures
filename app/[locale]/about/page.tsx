import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import AboutSection from "../___blocks/about-section";
import OurWorkSection from "../___blocks/our-work-section";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "Public" });
  return {
    title: `${t("about.title")} | ${t("metadata.siteName")}`,
    alternates: { canonical: `/${locale}/about` },
  };
}

/** Interim About page built from the approved copy. Hero / Mission / Vision motion design follows once the About Us designs are supplied. */
export default function AboutPage() {
  return (
    <>
      <AboutSection />
      <OurWorkSection />
    </>
  );
}
