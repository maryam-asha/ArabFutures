import { loadMoreTermsAction } from "@app/public-actions";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { AppLocale } from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { getLocale, getTranslations } from "next-intl/server";

import { TermList } from "../___blocks/term-list";

export default async function TermsPage(params: { searchParams: SearchParamsProps }) {
  const searchParamsObject = await params.searchParams;

  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.featuredTerms");
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
    <div className="container mx-auto py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      {/* The client component handles all interactivity from here. */}
      <TermList initialTerms={initialTerms} categories={categories} initialQuery={query} initialCategoryIds={categoryIds} initialSort={sort as any} />
    </div>
  );
}
