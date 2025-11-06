import { loadMoreTermsAction } from "@app/public-actions";
import { AppLocale } from "@root/i18n/config";
import { getLocale, getTranslations } from "next-intl/server";

import { TermList } from "../___blocks/term-list";

export default async function TermsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.featuredTerms");
  const query = searchParams?.query || "";

  const initialTerms = await loadMoreTermsAction(locale, 0, query);

  return (
    <div className="container mx-auto mt-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <TermList initialTerms={initialTerms} initialQuery={query} />
    </div>
  );
}
