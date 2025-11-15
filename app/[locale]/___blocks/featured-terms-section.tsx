"use client";

// The component remains a Client Component for state management
import { Button } from "@components/ui/button";
import { Link } from "@i18n/navigation";
import { TermCategoryOption, TermDb } from "@root/dal/dal.types";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { SuggestTermDialog } from "./suggest-term-dialog";
import TermCard from "./term-card";
import { TermDialog } from "./term-dialog";

// The component now receives its data directly as props
interface FeaturedTermsSectionProps {
  terms: TermDb[];
  categories: TermCategoryOption[];
}

export function FeaturedTermsSection({ terms, categories }: FeaturedTermsSectionProps) {
  const t = useTranslations("Public.featuredTerms");
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  // If there are no terms (due to an error or just no data), we can show a message.
  const hasTerms = terms && terms.length > 0;

  return (
    <section id="featured-terms" className="scroll-mt-36">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-start">
            <h2 className="text-3xl md:text-4xl font-bold">{t("title")}</h2>
            <p className="text-muted-foreground mt-2">{t("description")}</p>
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

        {hasTerms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {terms.map((term) => (
              <TermCard key={term.termId} term={term} onSelect={() => setSelectedTermId(term.termId)} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground p-8 mt-8 bg-muted/50 rounded-lg">
            <p>Could not load featured terms at this time.</p>
          </div>
        )}
      </div>

      <TermDialog termId={selectedTermId} onClose={() => setSelectedTermId(null)} />
    </section>
  );
}
