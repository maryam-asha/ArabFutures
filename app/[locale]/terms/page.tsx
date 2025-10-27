import { loadMoreTermsAction } from "@app/public-actions";
import { AppLocale } from "@root/i18n/config";
import { Input } from "@ui/input";
import { Search } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { TermList } from "../___blocks/term-list";

export default async function TermsPage({ searchParams }: { searchParams?: { query?: string } }) {
  const locale = (await getLocale()) as AppLocale;
  const t = await getTranslations("Public.featuredTerms");
  const query = searchParams?.query || "";

  const initialTerms = await loadMoreTermsAction(locale, 0, query);

  return (
    <div className="container mx-auto py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
        <div className="relative mt-8">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
          <Input defaultValue={query} placeholder={t("searchPlaceholder")} className="w-full text-lg h-14 pl-12 rounded-full shadow-sm" name="query" form="search-form" />
        </div>
        <form id="search-form" className="hidden"></form>
      </div>

      <TermList initialTerms={initialTerms} query={query} />
    </div>
  );
}
