import i18nAppConfig, { AppLocale, assertAppLocale } from "@i18n/config";
import { unstable_noStore as noStore } from "next/cache";
import { cache } from "react";
import { z } from "zod";

import { dbClient } from "./client";
import { CollectionDbSchema, CollectionOptionDbSchema, CollectionWithCountDbSchema } from "./dal.schema";
import { CollectionDb, CollectionOption, CollectionWithCount } from "./dal.types";

export interface PaginatedCollections {
  data: CollectionWithCount[];
  totalCount: number;
}

/** Paginated + searchable collection list for the dashboard. */
export const findCollections = async (props: { locale: AppLocale; query?: string; limit?: number; offset?: number }): Promise<PaginatedCollections> => {
  noStore();
  assertAppLocale(props.locale);
  const { query, limit, offset } = props;

  const params: string[] = [];
  const whereConditions: string[] = [];

  if (query) {
    const searchQuery = `%${query}%`;
    const searchClauses = i18nAppConfig.locales.map((loc) => `(c.name ->> '$.${loc}' LIKE ?)`).join(" OR ");
    whereConditions.push(`(${searchClauses})`);
    i18nAppConfig.locales.forEach(() => params.push(searchQuery));
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as count FROM collections c ${whereClause}`;
  const countResult = await dbClient.selectSingle(countSql, params, z.object({ count: z.number() }));

  const dataSql = `
    SELECT
      c.*,
      (SELECT COUNT(*) FROM resourceCollections rc WHERE rc.collectionId = c.collectionId) as resourceCount
    FROM collections c
    ${whereClause}
    ORDER BY c.displayOrder ASC, c.collectionId DESC
    ${limit ? `LIMIT ${limit}` : ""}
    ${offset ? `OFFSET ${offset}` : ""}
  `;
  const data = await dbClient.selectMany(dataSql, params, CollectionWithCountDbSchema);

  return { data, totalCount: countResult.count };
};

const findCollectionByIdFn = async (collectionId: number): Promise<CollectionDb | null> => {
  const sql = `SELECT * FROM collections WHERE collectionId = ? LIMIT 1;`;
  return dbClient.selectSingleOrDefault(sql, [collectionId], CollectionDbSchema);
};
export const findCollectionById = cache(findCollectionByIdFn);

/** Active collections as { collectionId, name } options for form multi-selects. */
const findCollectionOptionsFn = async (locale: AppLocale): Promise<CollectionOption[]> => {
  assertAppLocale(locale);
  const sql = `
    SELECT c.collectionId, c.name ->> '$.${locale}' AS name
    FROM collections c
    WHERE c.isActive = TRUE
    ORDER BY c.displayOrder ASC;
  `;
  return dbClient.selectMany(sql, [], CollectionOptionDbSchema);
};
export const findCollectionOptions = cache(findCollectionOptionsFn);
