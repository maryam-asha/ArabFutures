import { loadMoreTermsAction } from "@app/[locale]/public-actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { AppLocale } from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { FailedToLoad } from "../___blocks/failed-to-load";
import { GetInvolvedSection } from "../___blocks/home/closing-sections";
import { TermList } from "../___blocks/term-list";
import { LexiconHero, LexiconStatement, ReadyToCollaborate, WhatMakesItDifferent, WhyItMatters } from "./___blocks/lexicon-sections";
import { LexiconMotion } from "./___blocks/lexicon-motion";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Public.metadata.terms" });
  const siteName = await getTranslations({ locale, namespace: "Public.metadata" }).then((t) => t("siteName"));

  return {
    title: `${t("title")} | ${siteName}`,
    description: t("description"),

    openGraph: {
      title: `${t("title")} | ${siteName}`,
      description: t("description"),
      url: `/${locale}/terms`,
    },

    twitter: {
      title: `${t("title")} | ${siteName}`,
      description: t("description"),
    },

    alternates: {
      canonical: `/${locale}/terms`,
      languages: {
        en: "/en/terms",
        ar: "/ar/terms",
      },
    },
  };
}

const LETTER_PATTERN = /^[A-Za-zء-ي]$/;

/** The term explorer, fed from the database. A failed query degrades to an inline message, not a broken page. */
async function TermExplorer({ searchParams }: { searchParams: Awaited<SearchParamsProps> }) {
  const locale = (await getLocale()) as AppLocale;
  const query = searchParams?.query?.toString() || "";
  const sort = searchParams?.sort?.toString() === "oldest" ? "oldest" : "newest";
  const letterParam = searchParams?.letter?.toString() || "";
  const letter = LETTER_PATTERN.test(letterParam) ? letterParam : "";
  const categoryIds =
    typeof searchParams?.category === "string"
      ? searchParams.category
          .split(",")
          .map(Number)
          .filter((id) => Number.isInteger(id) && id > 0)
      : [];

  const data = await Promise.all([
    getActiveCategoryOptionsAction(locale),
    loadMoreTermsAction(locale, { page: 0, query: query || undefined, categoryIds, orderBy: sort, letter: letter || undefined }),
  ]).catch((error) => {
    console.error("Lexicon: failed to load terms", error);
    return null;
  });

  if (!data) {
    return (
      <div className="afs-container">
        <FailedToLoad />
      </div>
    );
  }

  const [categories, initial] = data;
  return (
    <TermList
      initialTerms={initial.terms}
      initialHasMore={initial.hasMore}
      initialTotal={initial.totalCount}
      categories={categories}
      initialQuery={query}
      initialCategoryIds={categoryIds}
      initialSort={sort}
      initialLetter={letter}
    />
  );
}

export default async function TermsPage(params: { searchParams: SearchParamsProps }) {
  const searchParams = await params.searchParams;

  return (
    <LexiconMotion>
      <LexiconHero />
      <TermExplorer searchParams={searchParams} />
      <LexiconStatement />
      <WhyItMatters />
      <WhatMakesItDifferent />
      <ReadyToCollaborate />
      <GetInvolvedSection />
    </LexiconMotion>
  );
}
