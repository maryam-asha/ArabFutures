"use client";

import TermCard from "@app/[locale]/___blocks/term-card";
import { loadMoreTermsAction } from "@app/public-actions";
import { TermDb } from "@root/dal/dal.types";
import { AppLocale } from "@root/i18n/config";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { TermDialog } from "./term-dialog";

interface TermListProps {
  initialTerms: TermDb[];
  initialQuery: string;
}

export function TermList({ initialTerms, initialQuery }: TermListProps) {
  const [terms, setTerms] = useState<TermDb[]>(initialTerms);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTerms.length > 0);
  const [selectedTerm, setSelectedTerm] = useState<TermDb | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const [isSearching, startSearchTransition] = useTransition();
  const [isLoadingMore, startLoadMoreTransition] = useTransition();

  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.featuredTerms");
  const commonT = useTranslations("Common");
  const tableT = useTranslations("Dashboard.tables");

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
      window.history.pushState(null, "", `?${params.toString()}`);

      const newTerms = await loadMoreTermsAction(locale, 0, debouncedQuery);
      setTerms(newTerms);
      setPage(1);
      setHasMore(newTerms.length > 0);
    });
  }, [debouncedQuery, locale]);

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
        toast.error("Failed to load more terms.");
      }
    });
  };

  return (
    <>
      <div className="relative mt-12 max-w-2xl mx-auto">
        <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full text-lg h-14 pl-12 rtl:pl-4 rtl:pr-12 rounded-full shadow-sm" />
      </div>

      {/* --- 1. FIX FOR "NO RESULTS" FLICKERING --- */}
      {/* We only show the loading state. The "No Results" message is now handled below. */}
      {isSearching ? (
        <p className="text-center text-muted-foreground text-lg mt-16">{commonT("loading")}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
            {terms.map((term) => (
              <TermCard key={term.termId} term={term} onSelect={() => setSelectedTerm(term)} />
            ))}
          </div>

          {/* Show "No Results" only when NOT searching and the terms array is empty */}
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

      <TermDialog term={selectedTerm} onClose={() => setSelectedTerm(null)} />
    </>
  );
}
