import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import z from "zod";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

/**
 * Finds a list of terms with filtering, searching, and pagination.
 */
export const findTerms = async (props: {
  locale: AppLocale;
  status?: "pending" | "published";
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

  const baseSql = `
    FROM terms AS outer_t
    LEFT JOIN termCategories AS tc ON outer_t.categoryRef = tc.categoryId
  `;

  const params: (string | number | number[])[] = [];
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
    const searchQuery = `%${query}%`;
    const searchClauses = i18nAppConfig.locales.map((loc) => `(outer_t.title ->> '$.${loc}[0].value' LIKE ? OR outer_t.briefDescription ->> '$.${loc}' LIKE ? OR outer_t.fullDetail ->> '$.${loc}' LIKE ?)`).join(" OR ");
    whereConditions.push(`(${searchClauses})`);
    i18nAppConfig.locales.forEach(() => params.push(searchQuery, searchQuery, searchQuery));
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  // QUERY 1: Get the total count of matching records
  const countSql = `SELECT COUNT(DISTINCT outer_t.termId) as count ${baseSql} ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));
  const totalCount = countResult.count;

  // QUERY 2: Get the actual data for the current page
  const dataSql = `
    SELECT
      outer_t.*,
      tc.name ->> '$.${locale}' AS categoryName,
      tags_data.tags
    ${baseSql}
    LEFT JOIN LATERAL (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tg.name ->> '$.${locale}')) as tags
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    ${whereClause}
    ORDER BY outer_t.termId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const data = await dbClient.selectMany(dataSql, params, TermDbSchema);

  return { data, totalCount };
};

/**
 * Finds a single, specific term by its ID for editing.
 */
const findTermByIdFn = async (termId: number, locale: AppLocale): Promise<TermForEditDb | null> => {
  const sql = `
    SELECT
      outer_t.*,
      tc.name ->> '$.${locale}' AS categoryName,
      tags_data.tagIds
    FROM terms AS outer_t
    LEFT JOIN termCategories AS tc ON outer_t.categoryRef = tc.categoryId
    LEFT JOIN LATERAL (
        SELECT JSON_ARRAYAGG(tt_j.tagId) as tagIds
        FROM termTags AS tt_j
        WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    WHERE outer_t.termId = ?
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
      outer_t.*,
      tc.name ->>'$.${locale}' AS categoryName,
      tags_data.tags
    FROM terms AS outer_t
    LEFT JOIN termCategories AS tc ON outer_t.categoryRef = tc.categoryId
    LEFT JOIN LATERAL (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', tg.name ->>'$.${locale}')) as tags
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      WHERE tt_j.termId = outer_t.termId
    ) AS tags_data ON TRUE
    WHERE outer_t.isFeatured = TRUE AND outer_t.status = 'published'
    ORDER BY outer_t.termId DESC;
  `;

  return dbClient.selectMany(sql, [], TermDbSchema);
};
export const findFeaturedTerms = cache(findFeaturedTermsFn);
