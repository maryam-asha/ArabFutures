"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Link } from "@i18n/navigation";
import { TermCategoryOption, TermDb } from "@root/dal/dal.types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SuggestTermDialog } from "./suggest-term-dialog";
import TermCard from "./term-card";
import { TermDialog } from "./term-dialog";

export function FeaturedTermsSection({ terms, categories }: { terms: TermDb[]; categories: TermCategoryOption[] }) {
  const t = useTranslations("Public.featuredTerms");
  const [selectedTerm, setSelectedTerm] = useState<TermDb | null>(null);

  return (
    <section className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
        <div className="text-center md:text-start">
          <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <SuggestTermDialog categories={categories}>
            <Button variant="outline">{t("suggestTerm")}</Button>
          </SuggestTermDialog>
          <Button asChild>
            <Link href="/terms">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t("searchPlaceholder")} className="w-full text-lg h-14 pl-12 rounded-full shadow-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {terms.map((term) => (
          <TermCard key={term.termId} term={term} onSelect={() => setSelectedTerm(term)} />
        ))}
      </div>

      <TermDialog term={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </section>
  );
}
