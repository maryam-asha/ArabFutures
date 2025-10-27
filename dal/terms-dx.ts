// File: dal/terms-dx.ts
import { AppLocale } from "@root/i18n/config";
import { cache } from "react";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

/**
 * Creates a robust SQL LEFT JOIN clause using a LATERAL derived table and native JSON aggregation functions.
 * This version correctly nests the 'references' array inside each locale's translation object.
 * @param outerTableAlias The alias of the main 'terms' table (e.g., "outer_t").
 * @returns A SQL string for a LEFT JOIN clause.
 */
const createSafeLateralTranslationsJoin = (outerTableAlias: string): string => {
  return `
    LEFT JOIN LATERAL (
      SELECT
        COALESCE((
          SELECT JSON_OBJECTAGG(
            tt.locale,
            JSON_OBJECT(
              'title', tt.title,
              'briefDescription', tt.briefDescription,
              'fullDetail', tt.fullDetail,
              'references', COALESCE((
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT('referenceId', tr.referenceId, 'content', tr.content, 'url', tr.url)
                )
                FROM termReferences tr
                WHERE tr.termRef = tt.termRef AND tr.locale = tt.locale
              ), JSON_ARRAY())
            )
          )
          FROM termTranslations tt
          WHERE tt.termRef = ${outerTableAlias}.termId
        ), '{}') AS translations
    ) AS translations_data ON TRUE
  `;
};

/**
 * Finds a list of terms with filtering, searching, and pagination.
 */
const findTermsFn = async (props: { locale: AppLocale; status?: "pending" | "published"; categoryIds?: number[]; query?: string; limit?: number; offset?: number }): Promise<TermDb[]> => {
  const { status, locale, categoryIds, query, limit, offset } = props;
  const translationsJoinSql = createSafeLateralTranslationsJoin("outer_t");

  // --- 3. CROSS-LOCALE SEARCH FIX ---
  // The tt_search join is now more generic to find a match in ANY locale.
  let sql = `
    SELECT
      outer_t.termId,
      outer_t.status,
      outer_t.isFeatured,
      outer_t.categoryRef,
      tct.name AS categoryName,
      tags_data.tags,
      translations_data.translations
    FROM terms AS outer_t
    LEFT JOIN termCategories AS tc ON outer_t.categoryRef = tc.categoryId
    LEFT JOIN termCategoryTranslations AS tct ON tc.categoryId = tct.categoryRef AND tct.locale = ?
    ${query ? `LEFT JOIN termTranslations AS tt_search ON outer_t.termId = tt_search.termRef` : ""}
    LEFT JOIN LATERAL (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tt_tags.name)) as tags
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      LEFT JOIN tagTranslations AS tt_tags ON tg.tagId = tt_tags.tagRef AND tt_tags.locale = ?
      WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    ${translationsJoinSql}
  `;

  const params: (string | number | number[])[] = [locale, locale];

  const whereConditions: string[] = [];
  if (status) {
    whereConditions.push("outer_t.status = ?");
    params.push(status);
  }
  if (categoryIds && categoryIds.length > 0) {
    whereConditions.push("outer_t.categoryRef IN (?)");
    params.push(categoryIds);
  }
  if (query) {
    // The query now checks for a match in any translation.
    const searchQuery = `%${query}%`;
    whereConditions.push("(tt_search.title LIKE ? OR tt_search.briefDescription LIKE ? OR tt_search.fullDetail LIKE ?)");
    params.push(searchQuery, searchQuery, searchQuery);
  }
  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(" AND ")}`;
  }

  // We must GROUP BY termId to avoid getting duplicate terms if the query matches in both 'en' and 'ar' translations.
  sql += ` GROUP BY outer_t.termId, tct.name, tags_data.tags, translations_data.translations`;

  sql += `
    ORDER BY outer_t.termId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  return dbClient.selectMany(sql, params, TermDbSchema);
};
export const findTerms = cache(findTermsFn);

/**
 * Finds a single, specific term by its ID for editing.
 */
const findTermByIdFn = async (termId: number, locale: AppLocale): Promise<TermForEditDb | null> => {
  const translationsJoinSql = createSafeLateralTranslationsJoin("outer_t");

  const sql = `
    SELECT
      outer_t.*,
      tct.name AS categoryName,
      tags_data.tagIds,
      translations_data.translations
    FROM terms AS outer_t
   LEFT JOIN termCategoryTranslations AS tct ON tct.categoryRef = outer_t.categoryRef AND tct.locale = ?
    LEFT JOIN LATERAL (
        SELECT JSON_ARRAYAGG(tt_j.tagId) as tagIds
        FROM termTags AS tt_j
        WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    ${translationsJoinSql}
    WHERE outer_t.termId = ?
    LIMIT 1;
  `;

  return await dbClient.selectSingleOrDefault(sql, [locale, termId], TermForEditDbSchema);
};
export const findTermById = cache(findTermByIdFn);

/**
 * Finds featured and published terms for public display.
 */
const findFeaturedTermsFn = async (locale: AppLocale): Promise<TermDb[]> => {
  const translationsJoinSql = createSafeLateralTranslationsJoin("outer_t");

  const sql = `
    SELECT
      outer_t.termId,
      outer_t.isFeatured,
      outer_t.status,
      outer_t.categoryRef,
      tct.name AS categoryName,
      tags_data.tags,
      translations_data.translations
    FROM terms AS outer_t
    LEFT JOIN termCategories AS tc ON outer_t.categoryRef = tc.categoryId
    LEFT JOIN termCategoryTranslations AS tct ON tc.categoryId = tct.categoryRef AND tct.locale = ?
    LEFT JOIN LATERAL (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tt.name)) as tags
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      LEFT JOIN tagTranslations AS tt ON tg.tagId = tt.tagRef AND tt.locale = ?
      WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    ${translationsJoinSql}
    WHERE outer_t.isFeatured = TRUE AND outer_t.status = 'published'
    ORDER BY outer_t.termId DESC;
  `;

  return dbClient.selectMany(sql, [locale, locale], TermDbSchema);
};
export const findFeaturedTerms = cache(findFeaturedTermsFn);
