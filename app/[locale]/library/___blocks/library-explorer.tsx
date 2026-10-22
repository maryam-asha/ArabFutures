"use client";

import { loadResourcesAction } from "@app/[locale]/library-actions";
import { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import type { CollectionOption, ResourceDb, ResourceType, TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { Checkbox } from "@ui/checkbox";
import { Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { ResourceCard } from "./resource-card";

type Facets = { authors: { name: string; count: number }[]; languages: string[] };
type CollectionGroup = { collectionId: number; name: string; resources: ResourceDb[] };

const TYPE_TABS: (ResourceType | "all")[] = ["all", "book", "article", "report", "video"];

interface LibraryExplorerProps {
  initialResources: ResourceDb[];
  initialHasMore: boolean;
  initialTotal: number;
  facets: Facets;
  categories: TermCategoryOption[];
  themes: TagOption[];
  collections: CollectionOption[];
  groups: CollectionGroup[];
}

export function LibraryExplorer({ initialResources, initialHasMore, initialTotal, facets, categories, themes, collections, groups }: LibraryExplorerProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.library");
  const commonT = useTranslations("Common");

  const [tab, setTab] = useState<(ResourceType | "all") | "collections">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [author, setAuthor] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [tagIds, setTagIds] = useState<number[]>([]);

  const [resources, setResources] = useState<ResourceDb[]>(initialResources);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [isFiltering, startFiltering] = useTransition();
  const [isLoadingMore, startLoadMore] = useTransition();

  const isCollections = tab === "collections";
  const typeFilter = tab === "all" || tab === "collections" ? undefined : tab;
  const filters = { type: typeFilter, query: debouncedQuery || undefined, categoryIds, tagIds, language: language || undefined, author: author || undefined } as const;

  // Re-query whenever a filter changes (collections view uses the pre-fetched groups instead).
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (isCollections) return;
    startFiltering(async () => {
      try {
        const result = await loadResourcesAction(locale, { page: 0, ...filters });
        setResources(result.resources);
        setHasMore(result.hasMore);
        setTotal(result.totalCount);
        setPage(1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, author, language, categoryIds, tagIds, tab, locale]);

  const loadMore = () => {
    startLoadMore(async () => {
      try {
        const result = await loadResourcesAction(locale, { page, ...filters });
        setResources((prev) => [...prev, ...result.resources]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
  };

  const toggle = (list: number[], set: (v: number[]) => void, id: number) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  return (
    <section id="explore" className="afs-container scroll-mt-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-light/15 pb-4">
        <span className="afs-label text-light/70 text-sm">{t("explore")}</span>
        {TYPE_TABS.map((value) => (
          <button key={value} type="button" onClick={() => setTab(value)} className={cn("afs-label text-sm transition-colors", tab === value ? "text-gold border-b-2 border-gold pb-1" : "text-light/70 hover:text-gold")}>
            {t(`tabs.${value}`)}
          </button>
        ))}
        {collections.length > 0 && (
          <button type="button" onClick={() => setTab("collections")} className={cn("afs-label text-sm transition-colors", isCollections ? "text-gold border-b-2 border-gold pb-1" : "text-light/70 hover:text-gold")}>
            {t("tabs.collections")}
          </button>
        )}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
        {/* Filter sidebar */}
        <aside className="space-y-6">
          <div className="relative">
            <Search aria-hidden className="text-light/70 pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search")}
              aria-label={t("search")}
              className="afs-label border-light/40 text-light placeholder:text-light/60 focus-visible:border-gold h-11 w-full border bg-transparent ps-11 pe-9 text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} aria-label={t("clearSearch")} className="text-light/70 hover:text-gold absolute end-3 top-1/2 -translate-y-1/2">
                <X className="size-4" />
              </button>
            )}
          </div>

          {facets.authors.length > 0 && (
            <FilterGroup title={t("filters.authors")}>
              {facets.authors.map((a) => (
                <label key={a.name} className="text-light/85 flex cursor-pointer items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <Checkbox checked={author === a.name} onCheckedChange={() => setAuthor(author === a.name ? "" : a.name)} className="border-light/50 rounded-none" />
                    {a.name}
                  </span>
                  <span className="text-light/50 text-xs">{a.count}</span>
                </label>
              ))}
            </FilterGroup>
          )}

          {facets.languages.length > 0 && (
            <FilterGroup title={t("filters.language")}>
              {facets.languages.map((lang) => (
                <label key={lang} className="text-light/85 flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={language === lang} onCheckedChange={() => setLanguage(language === lang ? "" : lang)} className="border-light/50 rounded-none" />
                  {lang}
                </label>
              ))}
            </FilterGroup>
          )}

          {categories.length > 0 && (
            <FilterGroup title={t("filters.category")}>
              {categories.map((cat) => (
                <label key={cat.categoryId} className="text-light/85 flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={categoryIds.includes(cat.categoryId)} onCheckedChange={() => toggle(categoryIds, setCategoryIds, cat.categoryId)} className="border-light/50 rounded-none" />
                  {cat.name}
                </label>
              ))}
            </FilterGroup>
          )}

          {themes.length > 0 && (
            <FilterGroup title={t("filters.themes")}>
              {themes.map((tg) => (
                <label key={tg.tagId} className="text-light/85 flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={tagIds.includes(tg.tagId)} onCheckedChange={() => toggle(tagIds, setTagIds, tg.tagId)} className="border-light/50 rounded-none" />
                  {tg.name}
                </label>
              ))}
            </FilterGroup>
          )}
        </aside>

        {/* Results */}
        <div>
          {isCollections ? (
            <div className="space-y-14">
              {groups.length === 0 && <p className="border-light/20 text-light/70 border py-16 text-center text-lg">{t("noResults")}</p>}
              {groups.map((group) => (
                <div key={group.collectionId}>
                  <h2 className="afs-display text-light text-[clamp(1.6rem,2.6vw,2.2rem)] uppercase">{group.name}</h2>
                  <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {group.resources.map((r) => (
                      <li key={r.resourceId}>
                        <ResourceCard resource={r} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <>
              <p aria-live="polite" className="text-light/70 mb-6 min-h-5 text-sm">
                {isFiltering ? <Loader2 className="size-4 animate-spin" /> : t("results", { count: total })}
              </p>
              <div className={cn("transition-opacity duration-200", isFiltering && "pointer-events-none opacity-50")}>
                {resources.length > 0 ? (
                  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {resources.map((r) => (
                      <li key={r.resourceId}>
                        <ResourceCard resource={r} locale={locale} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="border-light/20 text-light/70 border py-16 text-center text-lg">{t("noResults")}</p>
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
                      {isLoadingMore && <Loader2 className="size-4 animate-spin" />}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-light/15 border-t pt-4 first:border-t-0 first:pt-0">
      <legend className="afs-label text-gold mb-3 text-xs">{title}</legend>
      <div className="flex max-h-56 flex-col gap-3 overflow-y-auto">{children}</div>
    </fieldset>
  );
}
