import { AppLocale, assertAppLocale } from "@root/i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { ResourceDbSchema, ResourceForEditDbSchema } from "./dal.schema";
import { ResourceDb, ResourceForEditDb, ResourceType } from "./dal.types";

const SQL_SELECT_COLUMNS = (locale: AppLocale) => `
  r.resourceId,
  r.type,
  r.categoryRef,
  r.language,
  r.isActive,
  r.displayOrder,
  r.content,
  r.createdAt,
  r.updatedAt,
  tc.name ->> '$.${locale}' AS categoryName,
  (
    SELECT JSON_ARRAYAGG(JSON_OBJECT('tagId', tg.tagId, 'name', JSON_OBJECT('${locale}', tg.name ->> '$.${locale}')))
    FROM resourceTags AS rt JOIN tags AS tg ON rt.tagId = tg.tagId
    WHERE rt.resourceId = r.resourceId
  ) as tags
`;

const SQL_JOINS = `
  FROM resources AS r
  LEFT JOIN termCategories AS tc ON r.categoryRef = tc.categoryId
`;

export interface ResourceFilters {
  locale: AppLocale;
  type?: ResourceType;
  categoryIds?: number[];
  tagIds?: number[];
  collectionId?: number;
  language?: string;
  author?: string;
  query?: string;
  orderBy?: "newest" | "oldest";
  limit?: number;
  offset?: number;
  /** Public pages pass true to only ever see active resources. */
  activeOnly?: boolean;
}

/** Builds the shared WHERE clause + params for the resource filters. */
function buildWhere(props: ResourceFilters) {
  const params: (string | number | number[])[] = [];
  const where: string[] = [];

  if (props.activeOnly) where.push("r.isActive = TRUE");
  if (props.type) {
    where.push("r.type = ?");
    params.push(props.type);
  }
  if (props.categoryIds && props.categoryIds.length > 0) {
    where.push("r.categoryRef IN (?)");
    params.push(props.categoryIds);
  }
  if (props.tagIds && props.tagIds.length > 0) {
    where.push("EXISTS (SELECT 1 FROM resourceTags rt WHERE rt.resourceId = r.resourceId AND rt.tagId IN (?))");
    params.push(props.tagIds);
  }
  if (props.collectionId) {
    where.push("EXISTS (SELECT 1 FROM resourceCollections rc WHERE rc.resourceId = r.resourceId AND rc.collectionId = ?)");
    params.push(props.collectionId);
  }
  if (props.language) {
    where.push("r.language = ?");
    params.push(props.language);
  }
  if (props.author) {
    where.push("JSON_CONTAINS(r.content->'$.authors', JSON_QUOTE(?))");
    params.push(props.author);
  }
  if (props.query) {
    const searchQuery = props.query
      .split(" ")
      .filter(Boolean)
      .map((word) => `+${word}`)
      .join(" ");
    where.push("MATCH(r.title_en, r.title_ar) AGAINST(? IN BOOLEAN MODE)");
    params.push(searchQuery);
  }

  return { whereClause: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "", params };
}

export const findResources = async (props: ResourceFilters): Promise<{ data: ResourceDb[]; totalCount: number }> => {
  noStore();
  const locale = assertAppLocale(props.locale);
  const { orderBy = "newest", limit, offset } = props;

  const { whereClause, params } = buildWhere(props);
  const orderByClause = orderBy === "oldest" ? "ORDER BY r.resourceId ASC" : "ORDER BY r.displayOrder ASC, r.resourceId DESC";

  const countSql = `SELECT COUNT(r.resourceId) as count ${SQL_JOINS} ${whereClause}`;
  const dataSql = `
    SELECT ${SQL_SELECT_COLUMNS(locale)}
    ${SQL_JOINS}
    ${whereClause}
    ${orderByClause}
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;

  const [countResult, data] = await Promise.all([dbClient.selectSingle(countSql, params, z.object({ count: z.number() })), dbClient.selectMany(dataSql, params, ResourceDbSchema)]);

  return { data, totalCount: countResult.count };
};

const findResourceByIdFn = async ({ resourceId, locale }: { resourceId: number; locale: AppLocale }): Promise<ResourceForEditDb | null> => {
  assertAppLocale(locale);
  const sql = `
    SELECT
      ${SQL_SELECT_COLUMNS(locale)},
      (SELECT JSON_ARRAYAGG(rt.tagId) FROM resourceTags rt WHERE rt.resourceId = r.resourceId) as tagIds,
      (SELECT JSON_ARRAYAGG(rc.collectionId) FROM resourceCollections rc WHERE rc.resourceId = r.resourceId) as collectionIds
    ${SQL_JOINS}
    WHERE r.resourceId = ?
    LIMIT 1;
  `;
  return dbClient.selectSingleOrDefault(sql, [resourceId], ResourceForEditDbSchema);
};
export const findResourceById = cache(findResourceByIdFn);

export interface ResourceFacets {
  authors: { name: string; count: number }[];
  languages: string[];
}

/** Distinct author names (with counts) and languages across active resources, for the filter sidebar. */
export const findResourceFacets = cache(async (): Promise<ResourceFacets> => {
  noStore();
  const authors = await dbClient.selectMany(
    `
    SELECT jt.author AS name, COUNT(*) AS count
    FROM resources r
    JOIN JSON_TABLE(r.content->'$.authors', '$[*]' COLUMNS (author VARCHAR(255) PATH '$')) jt
    WHERE r.isActive = TRUE AND jt.author IS NOT NULL AND jt.author <> ''
    GROUP BY jt.author
    ORDER BY jt.author ASC
  `,
    [],
    z.object({ name: z.string(), count: z.coerce.number() }),
  );

  const languages = await dbClient.selectMany(`SELECT DISTINCT language FROM resources WHERE isActive = TRUE AND language IS NOT NULL AND language <> '' ORDER BY language ASC`, [], z.object({ language: z.string() }));

  return { authors, languages: languages.map((l) => l.language) };
});

export interface CollectionGroup {
  collectionId: number;
  name: string;
  resources: ResourceDb[];
}

/** Active resources grouped by active collection, ordered for the Library "Collections" view. */
export const findResourcesGroupedByCollection = cache(async (locale: AppLocale): Promise<CollectionGroup[]> => {
  noStore();
  assertAppLocale(locale);

  const collections = await dbClient.selectMany(`SELECT collectionId, name ->> '$.${locale}' AS name FROM collections WHERE isActive = TRUE ORDER BY displayOrder ASC`, [], z.object({ collectionId: z.number(), name: z.string().nullable() }));

  const groups: CollectionGroup[] = [];
  for (const c of collections) {
    const { data } = await findResources({ locale, collectionId: c.collectionId, activeOnly: true, limit: 12 });
    if (data.length > 0) groups.push({ collectionId: c.collectionId, name: c.name ?? "", resources: data });
  }
  return groups;
});
