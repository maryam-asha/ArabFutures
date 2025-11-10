import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import z from "zod";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

/**
 * Finds a list of terms, adapted for the new JSON content structure.
 */
export const findTerms = async (props: {
  locale: AppLocale;
  status?: "pending" | "published" | "rejected" | "has-pending-review";
  categoryIds?: number[];
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<{
  data: TermDb[];
  totalCount: number;
}> => {
  noStore();
  const { status, locale, categoryIds, query, limit, offset } = props;

  const baseSql = `FROM terms AS t`;
  const params: (string | number | number[])[] = [];
  let whereConditions: string[] = [];

  if (status) {
    whereConditions.push("t.status = ?");
    params.push(status);
  }
  if (categoryIds && categoryIds.length > 0) {
    whereConditions.push("t.categoryRef IN (?)");
    params.push(categoryIds);
  }
  if (query) {
    const searchQuery = `%${query}%`;
    // Search across default English and Arabic names and brief descriptions.
    // NOTE: For production at scale, a full-text index on a generated column is recommended.
    const searchClause = `(
      t.content->>'$.default.en.name' LIKE ? OR 
      t.content->>'$.default.ar.name' LIKE ? OR
      t.content->>'$.default.en.briefDescription' LIKE ? OR
      t.content->>'$.default.ar.briefDescription' LIKE ?
    )`;
    whereConditions.push(searchClause);
    params.push(searchQuery, searchQuery, searchQuery, searchQuery);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(t.termId) as count ${baseSql} ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));
  const totalCount = countResult.count;

  const dataSql = `
    SELECT
      t.*,
      tc.name ->> '$.${locale}' AS categoryName,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tg.name ->> '$.${locale}'))
        FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
        WHERE tt_j.termId = t.termId
      ) as tags
    ${baseSql}
    LEFT JOIN termCategories AS tc ON t.categoryRef = tc.categoryId
    ${whereClause}
    ORDER BY t.termId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const data = await dbClient.selectMany(dataSql, params, TermDbSchema);

  return { data, totalCount };
};

/**
 * Finds a single, specific term by its ID for editing.
 */
const findTermByIdFn = async (termId: number): Promise<TermForEditDb | null> => {
  const sql = `
    SELECT
      t.*,
      tc.name ->> '$.${i18nAppConfig.defaultLocale}' AS categoryName,
      (SELECT JSON_ARRAYAGG(tt_j.tagId) FROM termTags AS tt_j WHERE tt_j.termId = t.termId) as tagIds
    FROM terms AS t
    LEFT JOIN termCategories AS tc ON t.categoryRef = tc.categoryId
    WHERE t.termId = ?
    LIMIT 1;
  `;

  return await dbClient.selectSingleOrDefault(sql, [termId], TermForEditDbSchema);
};
export const findTermById = cache(findTermByIdFn);

/**
 * Finds featured and published terms for public display.
 */
const findFeaturedTermsFn = async (locale: AppLocale): Promise<TermDb[]> => {
  const sql = `
    SELECT
      t.*,
      tc.name ->> '$.${locale}' AS categoryName,
      (
        SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tg.name ->> '$.${locale}'))
        FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
        WHERE tt_j.termId = t.termId
      ) as tags
    FROM terms AS t
    LEFT JOIN termCategories AS tc ON t.categoryRef = tc.categoryId
    WHERE t.isFeatured = TRUE AND t.status = 'published'
    ORDER BY t.termId DESC;
  `;

  return dbClient.selectMany(sql, [], TermDbSchema);
};
export const findFeaturedTerms = cache(findFeaturedTermsFn);
