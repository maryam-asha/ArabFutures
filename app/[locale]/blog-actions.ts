"use server";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { findBlogPosts } from "@root/dal/blog-dx";
import { BlogPostDb } from "@root/dal/dal.types";
import { z } from "zod";

const POSTS_PER_PAGE = 9;

const LoadPostsSchema = z.object({
  page: z.number().int().min(0).default(0),
  query: z.string().max(200).optional(),
  categoryIds: z.array(z.number().int().positive()).max(50).optional(),
  orderBy: z.enum(["newest", "oldest"]).optional(),
});

export type LoadPostsOptions = z.input<typeof LoadPostsSchema>;

export async function loadPostsAction(locale: AppLocale, options: LoadPostsOptions): Promise<{ posts: BlogPostDb[]; hasMore: boolean; totalCount: number }> {
  // The locale is interpolated into SQL JSON paths by the DAL, so it must be a known locale.
  if (!i18nAppConfig.locales.includes(locale)) throw new Error("Invalid locale");
  const { page, query, categoryIds, orderBy } = LoadPostsSchema.parse(options);
  const offset = page * POSTS_PER_PAGE;

  const { data, totalCount } = await findBlogPosts({
    locale,
    activeOnly: true,
    query,
    categoryIds,
    orderBy,
    limit: POSTS_PER_PAGE,
    offset,
  });

  return { posts: data, hasMore: offset + data.length < totalCount, totalCount };
}
