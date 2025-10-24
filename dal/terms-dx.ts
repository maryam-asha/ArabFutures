import { createSqlTranslationsSubquery } from "@i18n/Translatable";
import { AppLocale } from "@root/i18n/config";
import { cache } from "react";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema, TermTranslationDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

const findTermsFn = async (props: { status?: "pending" | "published"; locale: AppLocale }): Promise<TermDb[]> => {
  const { status, locale } = props;
  const translationsSubquery = createSqlTranslationsSubquery("t", "termId", "termTranslations", "termRef", TermTranslationDbSchema);

  let whereClause = "WHERE 1=1";
  const params: (string | number | boolean)[] = [locale, locale];

  if (status) {
    whereClause += " AND t.status = ?";
    params.push(status);
  }

  // This complex query uses LEFT JOIN for the one-to-one category relationship
  // and a JSON_ARRAYAGG subquery for the many-to-many tag relationship.
  // This is highly efficient and prevents N+1 query problems.
  const sql = `
    SELECT
      t.*,
      tct.name as categoryName,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT('tagId', tg.tagId, 'name', tt.name)
        )
        FROM termTags tt_j
        JOIN tags tg ON tt_j.tagId = tg.tagId
        LEFT JOIN tagTranslations tt ON tg.tagId = tt.tagRef AND tt.locale = ?
        WHERE tt_j.termId = t.termId
      ) as tags,
      ${translationsSubquery} as translations
    FROM terms t
    LEFT JOIN termCategories tc ON t.categoryRef = tc.categoryId
    LEFT JOIN termCategoryTranslations tct ON tc.categoryId = tct.categoryRef AND tct.locale = ?
    ${whereClause}
    ORDER BY t.termId DESC;
  `;

  const v = await dbClient.selectMany(sql, params, TermDbSchema);
  console.log(JSON.stringify(v));

  return v;
};
export const findTerms = cache(findTermsFn);

/**
 * Finds a single term by its ID for editing.
 * Fetches associated category and tag IDs.
 */
const findTermByIdFn = async (termId: number): Promise<TermForEditDb | null> => {
  const translationsSubquery = createSqlTranslationsSubquery("t", "termId", "termTranslations", "termRef", TermTranslationDbSchema);

  const sql = `
    SELECT
      t.*,
      (
        SELECT GROUP_CONCAT(tt_j.tagId)
        FROM termTags tt_j
        WHERE tt_j.termId = t.termId
      ) as tagIds,
      ${translationsSubquery} as translations
    FROM terms t
    WHERE t.termId = ?
    LIMIT 1;
  `;

  // We don't need categoryName or tags array here, just the raw data for the form
  const rawTerm = await dbClient.selectSingleOrDefault(sql, [termId], TermForEditDbSchema.omit({ categoryName: true, tags: true }));

  if (!rawTerm) return null;

  // Manually construct the final object to satisfy the full schema
  return {
    ...rawTerm,
    categoryName: null, // Not needed for the form
    tags: [], // Not needed for the form
  };
};
export const findTermById = cache(findTermByIdFn);

/**
 * Fetches only the terms marked as "featured" for the public-facing site.
 */
const findFeaturedTermsFn = async (locale: AppLocale): Promise<TermDb[]> => {
  const translationsSubquery = createSqlTranslationsSubquery("t", "termId", "termTranslations", "termRef", TermTranslationDbSchema);

  // This query is similar to findTerms, but simpler.
  // It filters for `isFeatured = TRUE` and `status = 'published'`.
  const sql = `
    SELECT
      t.termId,
      t.isFeatured,
      t.status,
      tc.categoryId as categoryRef,
      tct.name as categoryName,
      (
        SELECT JSON_ARRAYAGG(
          JSON_OBJECT('tagId', tg.tagId, 'name', tt.name)
        )
        FROM termTags tt_j
        JOIN tags tg ON tt_j.tagId = tg.tagId
        LEFT JOIN tagTranslations tt ON tg.tagId = tt.tagRef AND tt.locale = ?
        WHERE tt_j.termId = t.termId
      ) as tags,
      ${translationsSubquery} as translations
    FROM terms t
    LEFT JOIN termCategories tc ON t.categoryRef = tc.categoryId
    LEFT JOIN termCategoryTranslations tct ON tc.categoryId = tct.categoryRef AND tct.locale = ?
    WHERE t.isFeatured = TRUE AND t.status = 'published'
    ORDER BY t.termId DESC;
  `;

  return dbClient.selectMany(sql, [locale, locale], TermDbSchema);
};
export const findFeaturedTerms = cache(findFeaturedTermsFn);
