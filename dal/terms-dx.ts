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

/** Arabic letters that share an index entry, as in a printed dictionary (hamza forms under alif, etc.). */
const ARABIC_LETTER_VARIANTS: Record<string, string[]> = {
  ا: ["ا", "أ", "إ", "آ"],
  ه: ["ه", "ة"],
  ي: ["ي", "ى"],
};

/**
 * WHERE fragment for the A–Z / ا–ي index. Latin letters match the English name; Arabic letters match the Arabic
 * name, ignoring the definite article "ال" the way Arabic dictionaries are ordered.
 */
function buildLetterCondition(letter: string): { sql: string; param: string | string[] } | null {
  if (/^[A-Za-z]$/.test(letter)) {
    return { sql: "t.name_en LIKE ?", param: `${letter}%` };
  }
  if (/^[ء-ي]$/.test(letter)) {
    return {
      sql: "LEFT(IF(t.name_ar LIKE 'ال%', SUBSTRING(t.name_ar, 3), t.name_ar), 1) IN (?)",
      param: ARABIC_LETTER_VARIANTS[letter] ?? [letter],
    };
  }
  return null;
}

export const findTerms = async (props: {
  locale: AppLocale;
  status?: "pending" | "published" | "rejected" | "has-pending-review";
  categoryIds?: number[];
  query?: string;
  /** Initial letter, Latin (matched on the English name) or Arabic (matched on the Arabic name). */
  letter?: string;
  orderBy?: "newest" | "oldest";
  limit?: number;
  offset?: number;
}): Promise<{
  data: TermDb[];
  totalCount: number;
}> => {
  noStore();
  const { status, locale, categoryIds, query, letter, orderBy = "newest", limit, offset } = props;

  const params: (string | number | number[] | string[])[] = [];
  const whereConditions: string[] = [];

  //we deal witht has pending to show as publidhed
  if (status) {
    if (status === "published") {
      whereConditions.push("t.status IN ('published', 'has-pending-review')");
    } else {
      whereConditions.push("t.status = ?");
      params.push(status);
    }
  }

  if (categoryIds && categoryIds.length > 0) {
    whereConditions.push("t.categoryRef IN (?)");
    params.push(categoryIds);
  }

  if (query) {
    const searchQuery = query
      .split(" ")
      .map((word) => `+${word}`)
      .join(" ");
    whereConditions.push("(MATCH(t.name_en, t.name_ar) AGAINST(? IN BOOLEAN MODE))");
    params.push(searchQuery);
  }

  if (letter) {
    const letterCondition = buildLetterCondition(letter);
    if (letterCondition) {
      whereConditions.push(letterCondition.sql);
      params.push(letterCondition.param);
    }
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
    WHERE t.isFeatured = TRUE AND t.status IN ('published', 'has-pending-review')
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
