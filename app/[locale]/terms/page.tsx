import { loadMoreTermsAction } from "@app/public-actions";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { AppLocale } from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { TermList } from "../___blocks/term-list";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
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

const ListItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <CheckCircle className="h-5 w-5 mt-1 shrink-0 text-primary" />
    <span className="text-muted-foreground">{children}</span>
  </li>
);

export default async function TermsPage(params: { searchParams: SearchParamsProps }) {
  const searchParamsObject = await params.searchParams;

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.termsPage");
  const query = searchParamsObject?.query?.toString() || "";
  const sort = searchParamsObject?.sort?.toString() || "newest";
  const categoryIds =
    searchParamsObject?.category && typeof searchParamsObject.category === "string"
      ? searchParamsObject.category
          .split(",")
          .map(Number)
          .filter((id) => !isNaN(id))
      : [];

  const [categories, initialTerms] = await Promise.all([findActiveCategoryOptions(locale), loadMoreTermsAction(locale, 0, query, categoryIds, sort as any)]);
  return (
    <div className="container mx-auto py-16 sm:py-24">
      {/* Centered header section for title and description. */}
      <header className="max-w-5xl mx-auto mb-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-center">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description_1")}</p>
        <p className="mt-4 text-lg text-muted-foreground">{t("description_2")}</p>
        <p className="mt-4 text-lg text-muted-foreground">{t("description_3")}</p>
      </header>

      {/* Grid layout for "Why it Matters" and "What Makes it Different" sections. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-24">
        <section className="space-y-6 p-8 bg-muted/30 rounded-2xl">
          <h2 className="text-3xl font-bold tracking-tight">{t("why_it_matters.title")}</h2>
          <p className="font-medium text-foreground">{t("why_it_matters.intro")}</p>
          <p className="text-muted-foreground">{t("why_it_matters.subtitle")}</p>
          <ul className="space-y-4">
            <ListItem>{t("why_it_matters.points.0")}</ListItem>
            <ListItem>{t("why_it_matters.points.1")}</ListItem>
            <ListItem>{t("why_it_matters.points.2")}</ListItem>
            <ListItem>{t("why_it_matters.points.3")}</ListItem>
          </ul>
        </section>

        <section className="space-y-6 p-8 bg-muted/30 rounded-2xl">
          <h2 className="text-3xl font-bold tracking-tight">{t("what_makes_it_different.title")}</h2>
          <ul className="space-y-4">
            <ListItem>{t("what_makes_it_different.points.0")}</ListItem>
            <ListItem>{t("what_makes_it_different.points.1")}</ListItem>
            <ListItem>{t("what_makes_it_different.points.2")}</ListItem>
            <ListItem>{t("what_makes_it_different.points.3")}</ListItem>
          </ul>
        </section>
      </div>

      {/* The client component handles all interactivity from here, separated by a title. */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight">{t("exploreTitle")}</h2>
        <p className="mt-2 text-muted-foreground">{t("exploreDescription")}</p>
      </div>
      <TermList initialTerms={initialTerms} categories={categories} initialQuery={query} initialCategoryIds={categoryIds} initialSort={sort as any} />
    </div>
  );
}
