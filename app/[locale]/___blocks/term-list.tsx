"use client";

import { loadMoreTermsAction } from "@app/[locale]/public-actions";
import { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import { TermCategoryOption, TermDb } from "@root/dal/dal.types";
import { Checkbox } from "@ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { ArrowRight, Loader2, Search, Star, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { SuggestTermDialog } from "./suggest-term-dialog";
import TermCard from "./term-card";
import { TermDialog } from "./term-dialog";

type SortOrder = "newest" | "oldest";

const LATIN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ARABIC_LETTERS = ["ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م", "ن", "ه", "و", "ي"];

interface TermListProps {
  initialTerms: TermDb[];
  initialHasMore: boolean;
  initialTotal: number;
  categories: TermCategoryOption[];
  initialQuery: string;
  initialCategoryIds: number[];
  initialSort: SortOrder;
  initialLetter: string;
}

/** The Lexicon explorer: search, filter, A–Z / ا–ي index and the term grid. State is mirrored in the URL. */
export function TermList({ initialTerms, initialHasMore, initialTotal, categories, initialQuery, initialCategoryIds, initialSort, initialLetter }: TermListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [terms, setTerms] = useState<TermDb[]>(initialTerms);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(initialCategoryIds);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialSort);
  const [letter, setLetter] = useState(initialLetter);

  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [isFiltering, startFilteringTransition] = useTransition();
  const [isLoadingMore, startLoadMoreTransition] = useTransition();

  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.termsPage");
  const tl = useTranslations("Public.termsPage.lexicon");
  const commonT = useTranslations("Common");

  const filters = { query: debouncedQuery || undefined, categoryIds: selectedCategoryIds, orderBy: sortOrder, letter: letter || undefined };
  const activeFilterCount = selectedCategoryIds.length + (sortOrder !== "newest" ? 1 : 0);

  useEffect(() => {
    const current = {
      query: searchParams.get("query") || "",
      sort: searchParams.get("sort") || "newest",
      category: searchParams.get("category") || "",
      letter: searchParams.get("letter") || "",
    };
    const next = { query: debouncedQuery, sort: sortOrder, category: selectedCategoryIds.join(","), letter };
    if (current.query === next.query && current.sort === next.sort && current.category === next.category && current.letter === next.letter) return;

    startFilteringTransition(async () => {
      const params = new URLSearchParams(searchParams);
      for (const [key, value] of Object.entries(next)) {
        if (value && !(key === "sort" && value === "newest")) params.set(key, value);
        else params.delete(key);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

      try {
        const result = await loadMoreTermsAction(locale, { page: 0, ...filters });
        setTerms(result.terms);
        setHasMore(result.hasMore);
        setTotal(result.totalCount);
        setPage(1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
    // `filters` is derived from the listed values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedCategoryIds, sortOrder, letter, searchParams, pathname, router, locale]);

  const toggleCategory = (categoryId: number) => setSelectedCategoryIds((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
  const toggleLetter = (value: string) => setLetter((prev) => (prev === value ? "" : value));

  const loadMore = () => {
    startLoadMoreTransition(async () => {
      try {
        const result = await loadMoreTermsAction(locale, { page, ...filters });
        setTerms((prev) => [...prev, ...result.terms]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
  };

  const letterButton = (value: string, lang: "en" | "ar") => (
    <li key={value}>
      <button
        type="button"
        lang={lang}
        aria-pressed={letter === value}
        onClick={() => toggleLetter(value)}
        className={cn(
          "flex size-9 items-center justify-center text-lg font-semibold transition-colors",
          letter === value ? "bg-gold text-ink" : "text-light hover:text-gold",
        )}
      >
        {value}
      </button>
    </li>
  );

  return (
    <section id="explore" aria-label={t("exploreTitle")} className="afs-container scroll-mt-6">
      {/* Search · Filter · Suggest */}
      <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
        <div className="relative w-full md:max-w-[31.25rem]">
          <Search aria-hidden className="text-light/80 pointer-events-none absolute start-7 top-1/2 size-5 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={tl("search")}
            aria-label={tl("search")}
            className="afs-label border-light/70 text-light placeholder:text-light/70 focus-visible:border-gold h-14 w-full border bg-transparent ps-[5.25rem] pe-14 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="text-light/80 hover:text-gold absolute end-5 top-1/2 -translate-y-1/2" aria-label={tl("clearSearch")}>
              <X className="size-5" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger className="afs-label border-light/70 text-light hover:border-gold hover:text-gold data-[state=open]:border-gold inline-flex h-14 items-center gap-3 self-start border px-4 text-base transition-colors md:self-auto">
            {tl("filter")}
            {activeFilterCount > 0 ? <span className="bg-gold text-ink px-1.5 text-xs">{activeFilterCount}</span> : <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />}
          </PopoverTrigger>
          <PopoverContent align="start" className="bg-ink border-light/30 w-72 rounded-none p-5">
            <fieldset>
              <legend className="afs-label text-gold mb-3 text-xs">{tl("categories")}</legend>
              <div className="flex max-h-60 flex-col gap-3 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat.categoryId} className="text-light flex cursor-pointer items-center gap-3 text-sm">
                    <Checkbox checked={selectedCategoryIds.includes(cat.categoryId)} onCheckedChange={() => toggleCategory(cat.categoryId)} className="border-light/60 rounded-none" />
                    {cat.name}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="border-light/20 mt-5 border-t pt-4">
              <legend className="afs-label text-gold mb-3 pt-4 text-xs">{tl("sortBy")}</legend>
              <div className="flex gap-2">
                {(["newest", "oldest"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={sortOrder === value}
                    onClick={() => setSortOrder(value)}
                    className={cn("border px-3 py-1.5 text-sm capitalize transition-colors", sortOrder === value ? "border-gold bg-gold text-ink" : "border-light/40 text-light hover:border-gold")}
                  >
                    {t(`sort.${value}`)}
                  </button>
                ))}
              </div>
            </fieldset>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryIds([]);
                  setSortOrder("newest");
                }}
                className="text-light/70 hover:text-gold mt-5 text-sm underline underline-offset-4"
              >
                {tl("clearFilters")}
              </button>
            )}
          </PopoverContent>
        </Popover>

        <SuggestTermDialog categories={categories}>
          <button type="button" className="afs-label border-gold text-gold hover:bg-gold hover:text-ink inline-flex h-14 items-center gap-3 self-start border px-5 text-base transition-colors md:ms-auto md:self-auto">
            <Star aria-hidden className="size-5" />
            {tl("suggestTerm")}
          </button>
        </SuggestTermDialog>
      </div>

      {/* A–Z and ا–ي index. The Latin row always reads left-to-right. */}
      <div className="mt-10 flex flex-col gap-3">
        <ul dir="ltr" aria-label={tl("browseLatin")} className="grid grid-cols-7 justify-items-center gap-y-1 md:flex md:justify-between">
          {LATIN_LETTERS.map((value) => letterButton(value, "en"))}
        </ul>
        <ul aria-label={tl("browseArabic")} className="grid grid-cols-7 justify-items-center gap-y-1 md:flex md:justify-between">
          {ARABIC_LETTERS.map((value) => letterButton(value, "ar"))}
        </ul>
      </div>

      <div className="mt-10 flex min-h-6 items-center justify-between gap-4 text-sm">
        <p aria-live="polite" className="text-light/70">
          {isFiltering ? <Loader2 className="size-4 animate-spin" /> : tl("results", { count: total })}
        </p>
        {letter && (
          <button type="button" onClick={() => setLetter("")} className="text-light/70 hover:text-gold underline underline-offset-4">
            {tl("showAllLetters")}
          </button>
        )}
      </div>

      <div className={cn("mt-4 transition-opacity duration-200", isFiltering && "pointer-events-none opacity-50")}>
        {terms.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {terms.map((term, index) => (
              <li key={term.termId}>
                <TermCard term={term} index={index} onSelect={() => setSelectedTermId(term.termId)} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-light/20 text-light/70 border py-16 text-center text-lg">{tl("noResults")}</p>
        )}

        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={isLoadingMore || isFiltering}
              className="afs-label border-light/70 text-light hover:border-gold hover:text-gold inline-flex items-center gap-3 border px-5 py-3 transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? commonT("loading") : t("loadMore")}
              {isLoadingMore ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />}
            </button>
          </div>
        )}
      </div>

      <TermDialog termId={selectedTermId} onClose={() => setSelectedTermId(null)} />
    </section>
  );
}
