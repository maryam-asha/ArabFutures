import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import z from "zod";

import { dbClient } from "./client";
import { TermDbSchema, TermForEditDbSchema } from "./dal.schema";
import { TermDb, TermForEditDb } from "./dal.types";

const SQL_SELECT_COLUMNS = (locale: AppLocale) => `
  t.termId,
  t.categoryRef,
  t.status,
  t.isFeatured,
  t.content,
  t.createdAt,
  t.updatedAt,
  tc.name ->> '$.${locale}' AS categoryName,
  (
      SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', JSON_OBJECT('${locale}', tg.name ->> '$.${locale}')))
      FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
      WHERE tt_j.termId = t.termId
  ) as tags
    `;

const SQL_STANDARD_JOINS = `
  FROM terms AS t
  LEFT JOIN termCategories AS tc ON t.categoryRef = tc.categoryId
`;

export const findTerms = async (props: {
  locale: AppLocale;
  status?: "pending" | "published" | "rejected" | "has-pending-review";
  categoryIds?: number[];
  query?: string;
  orderBy?: "newest" | "oldest"; // <-- ADDED: New sorting parameter
  limit?: number;
  offset?: number;
}): Promise<{
  data: TermDb[];
  totalCount: number;
}> => {
  noStore();
  const { status, locale, categoryIds, query, orderBy = "newest", limit, offset } = props;

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
    const searchClauses: string[] = [];

    i18nAppConfig.locales.forEach((loc) => {
      searchClauses.push(`t.content->>'$.default.${loc}.name' LIKE ?`);
      searchClauses.push(`t.content->>'$.default.${loc}.briefDescription' LIKE ?`);
      searchClauses.push(`t.content->>'$.default.${loc}.fullDescription' LIKE ?`);
      params.push(searchQuery, searchQuery, searchQuery);
    });

    whereConditions.push(`(${searchClauses.join(" OR ")})`);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const orderByClause = orderBy === "oldest" ? "ORDER BY t.termId ASC" : "ORDER BY t.termId DESC";

  const countSql = `SELECT COUNT(t.termId) as count ${SQL_STANDARD_JOINS} ${whereClause}`;
  const dataSql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_STANDARD_JOINS}
    ${whereClause}
    ${orderByClause}
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const [countResult, data] = await Promise.all([dbClient.selectSingle(countSql, params, z.object({ count: z.number() })), dbClient.selectMany(dataSql, params, TermDbSchema)]);

  return { data, totalCount: countResult.count };
};

const findTermByIdFn = async ({ termId, locale }: { termId: number; locale: AppLocale }): Promise<TermForEditDb | null> => {
  const sql = `
    SELECT
      t.*,
      tc.name ->> '$.${i18nAppConfig.defaultLocale}' AS categoryName,
      (
          SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', JSON_OBJECT('${locale}', tg.name ->> '$.${locale}')))
          FROM termTags AS tt_j JOIN tags AS tg ON tt_j.tagId = tg.tagId
          WHERE tt_j.termId = t.termId
      ) as tags,

      (SELECT JSON_ARRAYAGG(tt_j.tagId) FROM termTags AS tt_j WHERE tt_j.termId = t.termId) as tagIds
    ${SQL_STANDARD_JOINS}
    WHERE t.termId = ?
    LIMIT 1;
  `;
  return await dbClient.selectSingleOrDefault(sql, [termId], TermForEditDbSchema);
};
export const findTermById = cache(findTermByIdFn);

const findFeaturedTermsFn = async (locale: AppLocale): Promise<TermDb[]> => {
  const sql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_STANDARD_JOINS}
    WHERE t.isFeatured = TRUE AND t.status = 'published'
    ORDER BY t.termId DESC;
  `;

  return dbClient.selectMany(sql, [], TermDbSchema);
};
export const findFeaturedTerms = cache(findFeaturedTermsFn);

/**
 * Finds the most recently created terms for the dashboard homepage.
 */
export const findRecentTerms = async (locale: AppLocale, limit: number = 5): Promise<TermDb[]> => {
  noStore();
  const sql = `
      SELECT ${SQL_SELECT_COLUMNS(locale)}
      ${SQL_STANDARD_JOINS}
      ORDER BY t.termId DESC
      LIMIT ?;
    `;

  return dbClient.selectMany(sql, [limit], TermDbSchema);
};
