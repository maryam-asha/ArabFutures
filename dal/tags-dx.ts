import i18nAppConfig, { AppLocale } from "@i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { TagDbSchema, TagOptionDbSchema, TagWithCountDbSchema } from "./dal.schema";
import { TagDb, TagOption, TagWithCount } from "./dal.types";

export interface PaginatedTags {
  data: TagWithCount[];
  totalCount: number;
}

/**
 * Fetches all tags along with a count of how many terms use each tag.
 * UPDATED: Now supports pagination and filtering.
 */
export const findTags = async (props: { locale: AppLocale; query?: string; limit?: number; offset?: number }): Promise<PaginatedTags> => {
  noStore();
  const { locale, query, limit, offset } = props;

  const params: (string | number)[] = [];
  const whereConditions: string[] = [];

  if (query) {
    const searchQuery = `%${query}%`;
    const searchClauses = i18nAppConfig.locales.map((loc) => `(tg.name ->> '$.${loc}' LIKE ?)`).join(" OR ");
    whereConditions.push(`(${searchClauses})`);
    i18nAppConfig.locales.forEach(() => params.push(searchQuery));
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as count FROM tags tg ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));
  const totalCount = countResult.count;

  const dataSql = `
    SELECT
      tg.*,
      (SELECT COUNT(*) FROM termTags tt WHERE tt.tagId = tg.tagId) as termCount
    FROM tags tg
    ${whereClause}
    ORDER BY tg.tagId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const data = await dbClient.selectMany(dataSql, params, TagWithCountDbSchema);

  return { data, totalCount };
};

/**
 * Finds a single tag by its ID. (No changes needed here)
 */
const findTagByIdFn = async (tagId: number): Promise<TagDb | null> => {
  const sql = `
    SELECT *
    FROM tags tg
    WHERE tg.tagId = ?
    LIMIT 1;
  `;
  return dbClient.selectSingleOrDefault(sql, [tagId], TagDbSchema);
};
export const findTagById = cache(findTagByIdFn);

/**
 * Fetches all tags for use in form multi-select components. (No changes needed here)
 */
const findTagOptionsFn = async (locale: AppLocale): Promise<TagOption[]> => {
  const sql = `
    SELECT
      tg.tagId,
      tg.name ->> "$.${locale}" AS name
    FROM tags tg
    ORDER BY name ASC;
  `;
  return dbClient.selectMany(sql, [], TagOptionDbSchema);
};
export const findTagOptions = cache(findTagOptionsFn);
