"use client";

import { loadMoreTermsAction } from "@app/[locale]/public-actions";
import { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import { TermCategoryOption, TermDb } from "@root/dal/dal.types";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import TermCard from "./term-card";
import { TermDialog } from "./term-dialog";

interface TermListProps {
  initialTerms: TermDb[];
  categories: TermCategoryOption[];
  initialQuery: string;
  initialCategoryIds: number[];
  initialSort: "newest" | "oldest";
}

export function TermList({ initialTerms, categories, initialQuery, initialCategoryIds, initialSort }: TermListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [terms, setTerms] = useState<TermDb[]>(initialTerms);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialTerms.length > 0);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(initialCategoryIds);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">(initialSort);

  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [isFiltering, startFilteringTransition] = useTransition();
  const [isLoadingMore, startLoadMoreTransition] = useTransition();

  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.termsPage");
  const commonT = useTranslations("Common");
  const tableT = useTranslations("Dashboard.tables");

  useEffect(() => {
    const currentUrlQuery = searchParams.get("query") || "";
    const currentUrlSort = (searchParams.get("sort") as "newest" | "oldest") || "newest";
    const currentUrlCategories = searchParams.get("category") || "";
    const newCategories = selectedCategoryIds.join(",");

    if (debouncedQuery === currentUrlQuery && sortOrder === currentUrlSort && newCategories === currentUrlCategories) {
      return;
    }

    startFilteringTransition(async () => {
      const params = new URLSearchParams(searchParams);
      if (debouncedQuery) params.set("query", debouncedQuery);
      else params.delete("query");
      if (newCategories) params.set("category", newCategories);
      else params.delete("category");
      if (sortOrder) params.set("sort", sortOrder);
      else params.delete("sort");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });

      const newTerms = await loadMoreTermsAction(locale, 0, debouncedQuery, selectedCategoryIds, sortOrder);
      setTerms(newTerms);
      setPage(1);
      setHasMore(newTerms.length > 0);
    });
  }, [debouncedQuery, selectedCategoryIds, sortOrder, searchParams, pathname, router, locale]);

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setSelectedCategoryIds([]);
    } else {
      setSelectedCategoryIds((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
    }
  };

  const loadMore = () => {
    startLoadMoreTransition(async () => {
      try {
        const newTerms = await loadMoreTermsAction(locale, page, debouncedQuery, selectedCategoryIds, sortOrder);
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
      {/* --- FILTER CONTROLS --- */}
      <div className="flex flex-col md:flex-row items-center gap-4 mt-12">
        <div className="relative grow w-full">
          <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground rtl:left-auto rtl:right-4" />
          <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchPlaceholder")} className="w-full text-lg h-14 pl-12 rtl:pl-4 rtl:pr-12 rounded-full shadow-sm" disabled={isFiltering} />
        </div>
        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")} disabled={isFiltering}>
          {" "}
          {/* FIX: Disable during transition */}
          <SelectTrigger className="w-full md:w-[180px] h-14 rounded-full text-lg shadow-sm">
            <SelectValue placeholder={t("sort.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("sort.newest")}</SelectItem>
            <SelectItem value="oldest">{t("sort.oldest")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
        <Button variant={selectedCategoryIds.length === 0 ? "default" : "outline"} onClick={() => handleCategoryClick(null)} disabled={isFiltering}>
          {" "}
          {/* FIX: Disable during transition */}
          {t("allCategories")}
        </Button>
        {categories.map((cat) => (
          <Button key={cat.categoryId} variant={selectedCategoryIds.includes(cat.categoryId) ? "default" : "outline"} onClick={() => handleCategoryClick(cat.categoryId)} disabled={isFiltering}>
            {cat.name}
          </Button>
        ))}
      </div>

      {/* --- TERMS GRID & PAGINATION WRAPPER --- */}
      {/* FIX: This wrapper preserves the layout. Opacity is used to show loading state. */}
      <div className={cn("transition-opacity duration-200", isFiltering && "opacity-50 pointer-events-none")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-16">
          {terms.map((term) => (
            <TermCard key={term.termId} term={term} onSelect={() => setSelectedTermId(term.termId)} />
          ))}
        </div>

        {terms.length === 0 && <p className="text-center text-muted-foreground text-lg mt-16">{tableT("noResults")}</p>}

        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button onClick={loadMore} disabled={isLoadingMore || isFiltering} size="lg">
              {isLoadingMore ? commonT("loading") : t("loadMore")}
            </Button>
          </div>
        )}
      </div>

      <TermDialog termId={selectedTermId} onClose={() => setSelectedTermId(null)} />
    </>
  );
}
