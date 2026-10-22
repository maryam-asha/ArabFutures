import { AppLocale, assertAppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { MemberDbSchema } from "./dal.schema";
import { MemberDb } from "./dal.types";

export interface PaginatedMembers {
  data: MemberDb[];
  totalCount: number;
}

/**
 * Paginated + searchable member list for the dashboard. Search matches the member name in either
 * language via the generated name_en / name_ar columns.
 */
export const findMembers = async (props: { locale: AppLocale; query?: string; limit?: number; offset?: number }): Promise<PaginatedMembers> => {
  noStore();
  assertAppLocale(props.locale);
  const { query, limit, offset } = props;

  const params: (string | number)[] = [];
  const whereConditions: string[] = [];

  if (query) {
    const searchQuery = `%${query}%`;
    whereConditions.push("(m.name_en LIKE ? OR m.name_ar LIKE ?)");
    params.push(searchQuery, searchQuery);
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as count FROM members m ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));

  const dataSql = `
    SELECT m.*
    FROM members m
    ${whereClause}
    ORDER BY m.displayOrder ASC, m.memberId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;
  const data = await dbClient.selectMany(dataSql, params, MemberDbSchema);

  return { data, totalCount: countResult.count };
};

/** Finds a single member by id, in any state. Used by the dashboard editor. */
const findMemberByIdFn = async (memberId: number): Promise<MemberDb | null> => {
  const sql = `SELECT * FROM members WHERE memberId = ? LIMIT 1;`;
  return dbClient.selectSingleOrDefault(sql, [memberId], MemberDbSchema);
};
export const findMemberById = cache(findMemberByIdFn);

/** Finds a single ACTIVE member by slug. Used by the public member detail page. */
const findMemberBySlugFn = async (slug: string): Promise<MemberDb | null> => {
  const sql = `SELECT * FROM members WHERE slug = ? AND isActive = TRUE LIMIT 1;`;
  return dbClient.selectSingleOrDefault(sql, [slug], MemberDbSchema);
};
export const findMemberBySlug = cache(findMemberBySlugFn);

/** All active members, ordered for display. Used by the public network / collaborate sections. */
const findActiveMembersFn = async (): Promise<MemberDb[]> => {
  const sql = `
    SELECT *
    FROM members
    WHERE isActive = TRUE
    ORDER BY displayOrder ASC, memberId DESC;
  `;
  return dbClient.selectMany(sql, [], MemberDbSchema);
};
export const findActiveMembers = cache(findActiveMembersFn);

/** Active members marked featured, ordered for display. */
const findFeaturedMembersFn = async (): Promise<MemberDb[]> => {
  const sql = `
    SELECT *
    FROM members
    WHERE isActive = TRUE AND isFeatured = TRUE
    ORDER BY displayOrder ASC, memberId DESC;
  `;
  return dbClient.selectMany(sql, [], MemberDbSchema);
};
export const findFeaturedMembers = cache(findFeaturedMembersFn);

/** Active member slugs, for static params / sitemap. */
export const findActiveMemberSlugs = async (): Promise<string[]> => {
  const rows = await dbClient.selectMany(`SELECT slug FROM members WHERE isActive = TRUE;`, [], z.object({ slug: z.string() }));
  return rows.map((r) => r.slug);
};
