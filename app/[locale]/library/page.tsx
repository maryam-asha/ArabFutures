import { getCollectionOptionsAction } from "@app/dashboard/collections/actions";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { findResourceFacets, findResources, findResourcesGroupedByCollection } from "@root/dal/resources-dx";
import { AppLocale } from "@root/i18n/config";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { FailedToLoad } from "../___blocks/failed-to-load";
import { GetInvolvedSection } from "../___blocks/home/closing-sections";
import { LibraryExplorer } from "./___blocks/library-explorer";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.library" });
  const siteName = await getTranslations({ locale, namespace: "Public.metadata" }).then((tt) => tt("siteName"));

  return {
    title: `${t("title")} | ${siteName}`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/library`,
      languages: { en: "/en/library", ar: "/ar/library" },
    },
  };
}

async function LibraryHero() {
  const t = await getTranslations("Public.library");
  return (
    <section className="afs-container grid items-center gap-10 pt-12 pb-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:pt-16">
      <div>
        <h1 className="afs-display text-light text-[clamp(2.6rem,5.4vw,4.75rem)] uppercase leading-[0.95]">{t("title")}</h1>
        <p className="text-light/90 mt-4 max-w-[38rem] text-lg leading-relaxed">{t("subtitle")}</p>
      </div>
      <div aria-hidden className="relative hidden h-44 md:block">
        <span className="bg-gold absolute end-28 top-6 size-36" />
        <span className="border-light/40 absolute end-0 top-0 size-32 border" />
      </div>
    </section>
  );
}

async function LibraryContent() {
  const locale = (await getLocale()) as AppLocale;

  const data = await Promise.all([
    findResources({ locale, activeOnly: true, limit: 12 }),
    findResourceFacets(),
    getActiveCategoryOptionsAction(locale),
    getTagOptionsAction(locale),
    getCollectionOptionsAction(locale),
    findResourcesGroupedByCollection(locale),
  ]).catch((error) => {
    console.error("Library: failed to load", error);
    return null;
  });

  if (!data) {
    return (
      <div className="afs-container">
        <FailedToLoad />
      </div>
    );
  }

  const [initial, facets, categories, themes, collections, groups] = data;

  return <LibraryExplorer initialResources={initial.data} initialHasMore={initial.data.length < initial.totalCount} initialTotal={initial.totalCount} facets={facets} categories={categories} themes={themes} collections={collections} groups={groups} />;
}

export default async function LibraryPage() {
  return (
    <>
      <LibraryHero />
      <LibraryContent />
      <GetInvolvedSection />
    </>
  );
}
