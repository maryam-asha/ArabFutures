"use client";

import { loadPostsAction } from "@app/[locale]/blog-actions";
import { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import type { BlogPostDb, TermCategoryOption } from "@root/dal/dal.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Loader2, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

import { BlogCard } from "./blog-card";

const ALL = "all";

interface BlogExplorerProps {
  initialPosts: BlogPostDb[];
  initialHasMore: boolean;
  categories: TermCategoryOption[];
}

export function BlogExplorer({ initialPosts, initialHasMore, categories }: BlogExplorerProps) {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Public.blog");
  const commonT = useTranslations("Common");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [category, setCategory] = useState<string>(ALL);
  const [orderBy, setOrderBy] = useState<"newest" | "oldest">("newest");

  const [posts, setPosts] = useState<BlogPostDb[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isFiltering, startFiltering] = useTransition();
  const [isLoadingMore, startLoadMore] = useTransition();

  const categoryIds = category !== ALL ? [Number(category)] : [];
  const filters = { query: debouncedQuery || undefined, categoryIds, orderBy } as const;

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    startFiltering(async () => {
      try {
        const result = await loadPostsAction(locale, { page: 0, ...filters });
        setPosts(result.posts);
        setHasMore(result.hasMore);
        setPage(1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, orderBy, locale]);

  const loadMore = () => {
    startLoadMore(async () => {
      try {
        const result = await loadPostsAction(locale, { page, ...filters });
        setPosts((prev) => [...prev, ...result.posts]);
        setHasMore(result.hasMore);
        setPage((prev) => prev + 1);
      } catch {
        toast.error(commonT("loadError"));
      }
    });
  };

  return (
    <section id="explore" className="afs-container scroll-mt-6">
      <h2 className="afs-display text-light text-[clamp(2.2rem,4vw,3.4rem)]">{t("exploreAll")}</h2>

      {/* Search + Category + Order */}
      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[45rem]">
          <Search aria-hidden className="text-light/70 pointer-events-none absolute start-6 top-1/2 size-5 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="afs-label border-light/40 text-light placeholder:text-light/60 focus-visible:border-gold h-14 w-full border bg-transparent ps-16 pe-12 text-base outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} aria-label={t("clearSearch")} className="text-light/70 hover:text-gold absolute end-5 top-1/2 -translate-y-1/2">
              <X className="size-5" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="afs-label border-light/40 text-light h-14 min-w-[10rem] rounded-none border bg-transparent uppercase">
              <SelectValue placeholder={t("category")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{t("allCategories")}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={orderBy} onValueChange={(v) => setOrderBy(v as "newest" | "oldest")}>
            <SelectTrigger className="afs-label border-light/40 text-light h-14 min-w-[9rem] rounded-none border bg-transparent uppercase">
              <SelectValue placeholder={t("order")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sort.newest")}</SelectItem>
              <SelectItem value="oldest">{t("sort.oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className={cn("mt-10 transition-opacity duration-200", isFiltering && "pointer-events-none opacity-50")}>
        {posts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.postId}>
                <BlogCard post={post} locale={locale} />
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
    </section>
  );
}
