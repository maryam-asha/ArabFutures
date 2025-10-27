"use client";

import TermCard from "@app/[locale]/___blocks/term-card";
import { loadMoreTermsAction } from "@app/public-actions";
import { usePathname, useRouter } from "@i18n/navigation";
import { TermDb } from "@root/dal/dal.types";
import { AppLocale } from "@root/i18n/config";
import { Button } from "@ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { TermDialog } from "./term-dialog";

interface TermListProps {
  initialTerms: TermDb[];
  query: string;
}

export function TermList({ initialTerms, query }: TermListProps) {
  const [terms, setTerms] = useState<TermDb[]>(initialTerms);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTerms.length > 0);
  const [selectedTerm, setSelectedTerm] = useState<TermDb | null>(null);
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.featuredTerms");
  const commonT = useTranslations("Common");
  const tableT = useTranslations("Dashboard.tables");

  // Effect to update URL when text search changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) {
      params.set("query", debouncedQuery);
    } else {
      params.delete("query");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router]);

  // Reset list when the initial props change (because the URL has changed)
  useEffect(() => {
    setTerms(initialTerms);
    setPage(1);
    setHasMore(initialTerms.length > 0);
  }, [initialTerms]);

  const loadMore = () => {
    startTransition(async () => {
      try {
        // Updated to only pass query, not categories
        const newTerms = await loadMoreTermsAction(locale, page, query);
        if (newTerms.length > 0) {
          setPage(page + 1);
          setTerms((prev) => [...prev, ...newTerms]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        toast.error("Failed to load more terms.");
      }
    });
  };

  return (
    <>
      {/*
        =====================================================================
        CATEGORY FILTER UI - Temporarily hidden for initial launch.
        To re-enable, uncomment this block and restore the props 
        (allCategories, initialSelectedCategories) to this component.
        =====================================================================

        <div className="mt-12">
            <div className="flex flex-wrap justify-center gap-2">
                {allCategories.map(cat => (
                    <Button 
                        key={cat.categoryId} 
                        variant={selectedCategories.includes(cat.categoryId) ? "default" : "outline"}
                        onClick={() => toggleCategory(cat.categoryId)}
                    >
                        {cat.name}
                        {selectedCategories.includes(cat.categoryId) && <X className="ms-2 h-4 w-4" />}
                    </Button>
                ))}
            </div>
        </div>
      */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        {terms.map((term) => (
          <TermCard key={term.termId} term={term} onSelect={() => setSelectedTerm(term)} />
        ))}
      </div>

      {terms.length === 0 && <p className="text-center text-muted-foreground text-lg mt-16">{tableT("noResults")}</p>}

      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button onClick={loadMore} disabled={isPending} size="lg">
            {isPending ? commonT("loading") : t("loadMore")}
          </Button>
        </div>
      )}

      <TermDialog term={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </>
  );
}
