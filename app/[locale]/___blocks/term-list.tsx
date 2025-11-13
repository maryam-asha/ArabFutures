"use client";

import { loadMoreTermsAction } from "@app/public-actions";
import { TermDb } from "@root/dal/dal.types";
import { AppLocale } from "@root/i18n/config";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import TermCard from "./term-card";
import { TermDialog } from "./term-dialog";

// <-- 1. Import the new, smart dialog

interface TermListProps {
  initialTerms: TermDb[];
  initialQuery: string;
}

export function TermList({ initialTerms, initialQuery }: TermListProps) {
  const [terms, setTerms] = useState<TermDb[]>(initialTerms);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTerms.length > 0);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const [isSearching, startSearchTransition] = useTransition();
  const [isLoadingMore, startLoadMoreTransition] = useTransition();

  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.featuredTerms");
  const commonT = useTranslations("Common");
  const tableT = useTranslations("Dashboard.tables");

  // Effect for handling search query changes
  useEffect(() => {
    const currentUrlQuery = new URLSearchParams(window.location.search).get("query") || "";
    if (debouncedQuery === currentUrlQuery) {
      return;
    }

    startSearchTransition(async () => {
      const params = new URLSearchParams(window.location.search);
      if (debouncedQuery) {
        params.set("query", debouncedQuery);
      } else {
        params.delete("query");
      }
      window.history.pushState(null, "", `${window.location.pathname}?${params.toString()}`);

      const newTerms = await loadMoreTermsAction(locale, 0, debouncedQuery);
      setTerms(newTerms);
      setPage(1);
      setHasMore(newTerms.length > 0);
    });
  }, [debouncedQuery, locale]);

  // Effect to reset state if initial props change (e.g., navigating back)
  useEffect(() => {
    setTerms(initialTerms);
    setSearchQuery(initialQuery);
    setPage(1);
    setHasMore(initialTerms.length > 0);
  }, [initialTerms, initialQuery]);

  const loadMore = () => {
    startLoadMoreTransition(async () => {
      try {
        const newTerms = await loadMoreTermsAction(locale, page, debouncedQuery);
        if (newTerms.length > 0) {
          setPage((prev) => prev + 1);
          setTerms((prev) => [...prev, ...newTerms]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        toast.error(commonT("loadError"));
      }
    });
  };

  return (
    <>
      <div className="relative mt-12 max-w-2xl mx-auto">
        <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full text-lg h-14 pl-12 rtl:pl-4 rtl:pr-12 rounded-full shadow-sm" />
      </div>

      {isSearching ? (
        <p className="text-center text-muted-foreground text-lg mt-16">{commonT("loading")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {terms.map((term) => (
              <TermCard key={term.termId} term={term} onSelect={() => setSelectedTermId(term.termId)} />
            ))}
          </div>

          {terms.length === 0 && !isSearching && <p className="text-center text-muted-foreground text-lg mt-16">{tableT("noResults")}</p>}

          {hasMore && (
            <div className="flex justify-center mt-12">
              <Button onClick={loadMore} disabled={isLoadingMore} size="lg">
                {isLoadingMore ? commonT("loading") : t("loadMore")}
              </Button>
            </div>
          )}
        </>
      )}

      {/* 2. Replace the old loader with the new dialog component */}
      <TermDialog termId={selectedTermId} onClose={() => setSelectedTermId(null)} />
    </>
  );
}
