import { AppLocale, assertAppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { BlogPostDbSchema, BlogPostForEditDbSchema } from "./dal.schema";
import { BlogPostDb, BlogPostForEditDb } from "./dal.types";

const SQL_SELECT_COLUMNS = (locale: AppLocale) => `
  b.postId,
  b.slug,
  b.categoryRef,
  b.isActive,
  b.isFeatured,
  b.displayOrder,
  b.content,
  b.createdAt,
  b.updatedAt,
  tc.name ->> '$.${locale}' AS categoryName,
  (
    SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', JSON_OBJECT('${locale}', tg.name ->> '$.${locale}')))
    FROM blogPostTags AS bt JOIN tags AS tg ON bt.tagId = tg.tagId
    WHERE bt.postId = b.postId
  ) as tags
`;

const SQL_JOINS = `
  FROM blogPosts AS b
  LEFT JOIN termCategories AS tc ON b.categoryRef = tc.categoryId
`;

export interface BlogFilters {
  locale: AppLocale;
  categoryIds?: number[];
  tagIds?: number[];
  query?: string;
  orderBy?: "newest" | "oldest";
  limit?: number;
  offset?: number;
  activeOnly?: boolean;
}

function buildWhere(props: BlogFilters) {
  const params: (string | number | number[])[] = [];
  const where: string[] = [];

  if (props.activeOnly) where.push("b.isActive = TRUE");
  if (props.categoryIds && props.categoryIds.length > 0) {
    where.push("b.categoryRef IN (?)");
    params.push(props.categoryIds);
  }
  if (props.tagIds && props.tagIds.length > 0) {
    where.push("EXISTS (SELECT 1 FROM blogPostTags bt WHERE bt.postId = b.postId AND bt.tagId IN (?))");
    params.push(props.tagIds);
  }
  if (props.query) {
    const searchQuery = props.query
      .split(" ")
      .filter(Boolean)
      .map((word) => `+${word}`)
      .join(" ");
    where.push("MATCH(b.title_en, b.title_ar) AGAINST(? IN BOOLEAN MODE)");
    params.push(searchQuery);
  }

  return { whereClause: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "", params };
}

export const findBlogPosts = async (props: BlogFilters): Promise<{ data: BlogPostDb[]; totalCount: number }> => {
  noStore();
  const locale = assertAppLocale(props.locale);
  const { orderBy = "newest", limit, offset } = props;

  const { whereClause, params } = buildWhere(props);
  const orderByClause = orderBy === "oldest" ? "ORDER BY b.postId ASC" : "ORDER BY b.displayOrder ASC, b.postId DESC";

  const countSql = `SELECT COUNT(b.postId) as count ${SQL_JOINS} ${whereClause}`;
  const dataSql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_JOINS}
    ${whereClause}
    ${orderByClause}
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const [countResult, data] = await Promise.all([dbClient.selectSingle(countSql, params, z.object({ count: z.number() })), dbClient.selectMany(dataSql, params, BlogPostDbSchema)]);

  return { data, totalCount: countResult.count };
};

/** Active featured posts for the "Featured" rail on the blog landing page. */
export const findFeaturedBlogPosts = cache(async (locale: AppLocale, limit = 3): Promise<BlogPostDb[]> => {
  noStore();
  assertAppLocale(locale);
  const sql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_JOINS}
    WHERE b.isActive = TRUE AND b.isFeatured = TRUE
    ORDER BY b.displayOrder ASC, b.postId DESC
    LIMIT ?;
  `;
  return dbClient.selectMany(sql, [limit], BlogPostDbSchema);
});

const findBlogPostByIdFn = async ({ postId, locale }: { postId: number; locale: AppLocale }): Promise<BlogPostForEditDb | null> => {
  assertAppLocale(locale);
  const sql = `
    SELECT
      ${SQL_SELECT_COLUMNS(locale)},
      (SELECT JSON_ARRAYAGG(bt.tagId) FROM blogPostTags bt WHERE bt.postId = b.postId) as tagIds
    ${SQL_JOINS}
    WHERE b.postId = ?
    LIMIT 1;
  `;
  return dbClient.selectSingleOrDefault(sql, [postId], BlogPostForEditDbSchema);
};
export const findBlogPostById = cache(findBlogPostByIdFn);

/** Active post by slug, for the public article page. */
const findBlogPostBySlugFn = async ({ slug, locale }: { slug: string; locale: AppLocale }): Promise<BlogPostDb | null> => {
  assertAppLocale(locale);
  const sql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_JOINS}
    WHERE b.slug = ? AND b.isActive = TRUE
    LIMIT 1;
  `;
  return dbClient.selectSingleOrDefault(sql, [slug], BlogPostDbSchema);
};
export const findBlogPostBySlug = cache(findBlogPostBySlugFn);
