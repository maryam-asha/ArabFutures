import { AppLocale } from "@root/i18n/config";
import { cache } from "react";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

/**
 * Creates a robust SQL LEFT JOIN clause using a LATERAL derived table to safely fetch and aggregate translations.
 * This pattern bypasses a suspected query planner bug in some MySQL/MariaDB versions by isolating the aggregation logic.
 * It uses the highly compatible GROUP_CONCAT method internally to build the JSON.
 * @param outerTableAlias The alias of the main 'terms' table (e.g., "outer_t").
 * @returns A SQL string for a LEFT JOIN clause.
 */
const createSafeLateralTranslationsJoin = (outerTableAlias: string): string => {
  return `
    LEFT JOIN LATERAL (
      SELECT
        JSON_MERGE_PATCH(
          IFNULL((
            SELECT CONCAT('{', GROUP_CONCAT(json_kvp), '}')
            FROM (
              SELECT
                CONCAT('"', locale, '":', JSON_OBJECT('title', title, 'briefDescription', briefDescription, 'fullDetail', fullDetail)) AS json_kvp
              FROM termTranslations
              WHERE termRef = ${outerTableAlias}.termId
            ) AS translations_sub
          ), '{}'
          ),
          IFNULL((
            SELECT CONCAT('{', GROUP_CONCAT(json_kvp), '}')
            FROM (
              SELECT
                CONCAT('"', locale, '":', JSON_ARRAYAGG(JSON_OBJECT('referenceId', referenceId, 'content', content, 'url', url))) as json_kvp
              FROM termReferences
              WHERE termRef = ${outerTableAlias}.termId
              GROUP BY locale
            ) AS refs_sub
          ), '{}')
        ) AS translations
    ) AS translations_data ON TRUE
  `;
};

/**
 * Finds a list of terms with filtering, searching, and pagination.
 */
const findTermsFn = async (props: { locale: AppLocale; status?: "pending" | "published"; categoryIds?: number[]; query?: string; limit?: number; offset?: number }): Promise<TermDb[]> => {
  const { status, locale, categoryIds, query, limit, offset } = props;
  const translationsJoinSql = createSafeLateralTranslationsJoin("outer_t");

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
    ${query ? `LEFT JOIN termTranslations AS tt_search ON outer_t.termId = tt_search.termRef AND tt_search.locale = ?` : ""}
    LEFT JOIN LATERAL (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tt_tags.name)) as tags
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      LEFT JOIN tagTranslations AS tt_tags ON tg.tagId = tt_tags.tagRef AND tt_tags.locale = ?
      WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    ${translationsJoinSql}
  `;

  const params: (string | number | number[])[] = [locale, locale, locale];
  if (query) params.push(locale);

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
    whereConditions.push("tt_search.title LIKE ?");
    params.push(`%${query}%`);
  }
  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(" AND ")}`;
  }

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
