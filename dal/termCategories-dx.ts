import i18nAppConfig, { AppLocale } from "@i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { TermCategoryDbSchema, TermCategoryOptionDbSchema, TermCategoryWithCountDbSchema } from "./dal.schema";
import { TermCategoryDb, TermCategoryOption, TermCategoryWithCount } from "./dal.types";

export interface PaginatedTermCategories {
  data: TermCategoryWithCount[];
  totalCount: number;
}

/**
 * Fetches all term categories along with a count of how many terms are in each.
 */
export const findTermCategories = async (props: { locale: AppLocale; query?: string; limit?: number; offset?: number }): Promise<PaginatedTermCategories> => {
  noStore();
  const { locale, query, limit, offset } = props;

  const params: string[] = [];
  const whereConditions: string[] = [];

  if (query) {
    const searchQuery = `%${query}%`;
    const searchClauses = i18nAppConfig.locales.map((loc) => `(tc.name ->> '$.${loc}' LIKE ?)`).join(" OR ");
    whereConditions.push(`(${searchClauses})`);
    i18nAppConfig.locales.forEach(() => params.push(searchQuery));
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as count FROM termCategories tc ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));
  const totalCount = countResult.count;

  const dataSql = `
    SELECT
      tc.*,
      (SELECT COUNT(*) FROM terms t WHERE t.categoryRef = tc.categoryId) as termCount
    FROM termCategories tc
    ${whereClause}
    ORDER BY tc.displayOrder ASC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const data = await dbClient.selectMany(dataSql, params, TermCategoryWithCountDbSchema);

  return { data, totalCount };
};

/**
 * Finds a single term category by its ID. (No changes needed)
 */
const findCategoryByIdFn = async (categoryId: number): Promise<TermCategoryDb | null> => {
  const sql = `
    SELECT *
    FROM termCategories tc
    WHERE tc.categoryId = ?
    LIMIT 1;
  `;
  return dbClient.selectSingleOrDefault(sql, [categoryId], TermCategoryDbSchema);
};
export const findCategoryById = cache(findCategoryByIdFn);

/**
 * Fetches active categories for use in form select components. (No changes needed)
 */
const findActiveCategoryOptionsFn = async (locale: AppLocale): Promise<TermCategoryOption[]> => {
  const sql = `
    SELECT
      tc.categoryId,
      tc.name ->> '$.${locale}' AS name
    FROM termCategories tc
    WHERE tc.isActive = TRUE
    ORDER BY tc.displayOrder ASC;
  `;
  return dbClient.selectMany(sql, [], TermCategoryOptionDbSchema);
};
export const findActiveCategoryOptions = cache(findActiveCategoryOptionsFn);
