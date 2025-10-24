import { createSqlTranslationsSubquery } from "@i18n/Translatable";
import { AppLocale } from "@i18n/config";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { TermCategoryDbSchema, TermCategoryOptionSchema, TermCategoryTranslationDbSchema } from "./dal.schema";
import { TermCategoryDb, TermCategoryOption } from "./dal.types";

// Schema for the main list, which includes a count of associated terms
const TermCategoryWithCountDbSchema = TermCategoryDbSchema.extend({
  termCount: z.number(),
});

export type TermCategoryWithCount = z.infer<typeof TermCategoryWithCountDbSchema>;

/**
 * Fetches all term categories along with a count of how many terms are in each.
 */
const findTermCategoriesFn = async (): Promise<TermCategoryWithCount[]> => {
  const translationsSubquery = createSqlTranslationsSubquery("tc", "categoryId", "termCategoryTranslations", "categoryRef", TermCategoryTranslationDbSchema);

  const sql = `
    SELECT
      tc.*,
      (SELECT COUNT(*) FROM terms t WHERE t.categoryRef = tc.categoryId) as termCount,
      ${translationsSubquery} as translations
    FROM termCategories tc
    ORDER BY tc.displayOrder ASC;
  `;

  return dbClient.selectMany(sql, [], TermCategoryWithCountDbSchema);
};
export const findTermCategories = cache(findTermCategoriesFn);

/**
 * Finds a single term category by its ID.
 * Returns the category object or null if not found.
 */
const findCategoryByIdFn = async (categoryId: number): Promise<TermCategoryDb | null> => {
  const translationsSubquery = createSqlTranslationsSubquery("tc", "categoryId", "termCategoryTranslations", "categoryRef", TermCategoryTranslationDbSchema);

  const sql = `
    SELECT
      tc.*,
      ${translationsSubquery} as translations
    FROM termCategories tc
    WHERE tc.categoryId = ?
    LIMIT 1;
  `;

  return dbClient.selectSingleOrDefault(sql, [categoryId], TermCategoryDbSchema);
};
export const findCategoryById = cache(findCategoryByIdFn);

const findActiveCategoryOptionsFn = async (locale: AppLocale): Promise<TermCategoryOption[]> => {
  const sql = `
    SELECT
      tc.categoryId,
      tct.name
    FROM termCategories tc
    JOIN termCategoryTranslations tct ON tc.categoryId = tct.categoryRef
    WHERE tc.isActive = TRUE AND tct.locale = ?
    ORDER BY tc.displayOrder ASC;
  `;

  return dbClient.selectMany(sql, [locale], TermCategoryOptionSchema);
};
export const findActiveCategoryOptions = cache(findActiveCategoryOptionsFn);
