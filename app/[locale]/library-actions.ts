"use server";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { ResourceDb } from "@root/dal/dal.types";
import { findResources } from "@root/dal/resources-dx";
import { z } from "zod";

const RESOURCES_PER_PAGE = 12;

const LoadResourcesSchema = z.object({
  page: z.number().int().min(0).default(0),
  type: z.enum(["book", "article", "report", "video"]).optional(),
  query: z.string().max(200).optional(),
  categoryIds: z.array(z.number().int().positive()).max(50).optional(),
  tagIds: z.array(z.number().int().positive()).max(50).optional(),
  language: z.string().max(10).optional(),
  author: z.string().max(200).optional(),
  orderBy: z.enum(["newest", "oldest"]).optional(),
});

export type LoadResourcesOptions = z.input<typeof LoadResourcesSchema>;

export async function loadResourcesAction(locale: AppLocale, options: LoadResourcesOptions): Promise<{ resources: ResourceDb[]; hasMore: boolean; totalCount: number }> {
  // The locale is interpolated into SQL JSON paths by the DAL, so it must be a known locale.
  if (!i18nAppConfig.locales.includes(locale)) throw new Error("Invalid locale");
  const { page, type, query, categoryIds, tagIds, language, author, orderBy } = LoadResourcesSchema.parse(options);
  const offset = page * RESOURCES_PER_PAGE;

  const { data, totalCount } = await findResources({
    locale,
    activeOnly: true,
    type,
    query,
    categoryIds,
    tagIds,
    language,
    author,
    orderBy,
    limit: RESOURCES_PER_PAGE,
    offset,
  });

  return { resources: data, hasMore: offset + data.length < totalCount, totalCount };
}
