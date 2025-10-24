import { createSqlTranslationsSubquery } from "@i18n/Translatable";
import { AppLocale } from "@i18n/config";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { TagDbSchema, TagOptionSchema, TagTranslationDbSchema } from "./dal.schema";
import { TagDb, TagOption } from "./dal.types";

// Schema for the main list, which includes a count of associated terms
const TagWithCountDbSchema = TagDbSchema.extend({
  termCount: z.number(),
});

export type TagWithCount = z.infer<typeof TagWithCountDbSchema>;

/**
 * Fetches all tags along with a count of how many terms use each tag.
 */
const findTagsFn = async (): Promise<TagWithCount[]> => {
  const translationsSubquery = createSqlTranslationsSubquery("tg", "tagId", "tagTranslations", "tagRef", TagTranslationDbSchema);

  const sql = `
    SELECT
      tg.*,
      (SELECT COUNT(*) FROM termTags tt WHERE tt.tagId = tg.tagId) as termCount,
      ${translationsSubquery} as translations
    FROM tags tg
    ORDER BY tg.tagId DESC;
  `;

  return dbClient.selectMany(sql, [], TagWithCountDbSchema);
};
export const findTags = cache(findTagsFn);

/**
 * Finds a single tag by its ID.
 * Returns the tag object or null if not found.
 */
const findTagByIdFn = async (tagId: number): Promise<TagDb | null> => {
  const translationsSubquery = createSqlTranslationsSubquery("tg", "tagId", "tagTranslations", "tagRef", TagTranslationDbSchema);

  const sql = `
    SELECT
      tg.*,
      ${translationsSubquery} as translations
    FROM tags tg
    WHERE tg.tagId = ?
    LIMIT 1;
  `;

  return dbClient.selectSingleOrDefault(sql, [tagId], TagDbSchema);
};
export const findTagById = cache(findTagByIdFn);

/**
 * Fetches all tags for use in form multi-select components.
 */
const findTagOptionsFn = async (locale: AppLocale): Promise<TagOption[]> => {
  const sql = `
    SELECT
      tg.tagId,
      tt.name
    FROM tags tg
    JOIN tagTranslations tt ON tg.tagId = tt.tagRef
    WHERE tt.locale = ?
    ORDER BY tt.name ASC;
  `;

  return dbClient.selectMany(sql, [locale], TagOptionSchema);
};
export const findTagOptions = cache(findTagOptionsFn);
