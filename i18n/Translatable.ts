import { AppLocale } from "@root/i18n/config";
import { routing } from "@root/i18n/routing";
import { z } from "zod";

/**
 * Creates a flexible Zod schema for a translations object.
 *
 * The resulting schema is a `z.partial(...)` object. This means any number of
 * locale keys (from none to all) can be present, making it ideal for both
 * fetching partial data (e.g., only 'en') and for form submissions where
 * not all languages are required.
 *
 * @param contentSchema The Zod schema for the fields of a single translation (e.g., `{ name: z.string() }`).
 * @returns A Zod schema representing a partial mapping of locales to content.
 * @example
 * const TranslationContent = z.object({ name: z.string() });
 * const Schema = createTranslationsSchema(TranslationContent);
 * // Schema will validate:
 * // {}
 * // { en: { name: "Hello" } }
 * // { en: { name: "Hello" }, de: null }
 */
export function createTranslationsSchema<T extends z.ZodRawShape>(contentSchema: z.ZodObject<T>) {
  const { locales } = routing;

  const localeSchemas = Object.fromEntries(locales.map((locale) => [locale, contentSchema.nullable()])) as Record<AppLocale, z.ZodNullable<z.ZodObject<T>>>;

  // Use .partial() to allow any subset of locales to be present.
  return z.object(localeSchemas).partial();
}

/**
 * Generates a SQL subquery to fetch translations as a nested JSON object.
 *
 * This powerful helper constructs a `JSON_OBJECT(...)` clause that can be embedded
 * directly into a `SELECT` statement. It efficiently aggregates translations from a
 * separate table into a single JSON field, avoiding the N+1 query problem.
 *
 * @param mainTableAlias The SQL alias for the main table (e.g., `p` for `products`).
 * @param pkColumn The name of the primary key column on the main table (e.g., `'productId'`).
 * @param translationTable The full name of the translations table (e.g., `'productTranslations'`).
 * @param refColumn The foreign key column on the translation table that points back to the main table (e.g., `'productRef'`).
 * @param translationSchema The Zod schema for the fields within a single translation. This is used to dynamically get the field names.
 * @param locales An optional array of `AppLocale`s to fetch. If omitted, translations for all configured locales will be fetched.
 * @returns A string containing the complete `JSON_OBJECT(...)` SQL subquery.
 *
 * @example
 * // To fetch only English and Turkish translations for products:
 * const subquery = createSqlTranslationsSubquery(
 *   'p',
 *   'productId',
 *   'productTranslations',
 *   'productRef',
 *   ProductTranslationDbSchema, // z.object({ name: z.string(), ... })
 *   ['en', 'tr']
 * );
 * //
 * // const sql = `SELECT p.*, ${subquery} as translations FROM products p`;
 * // `subquery` will be:
 * // JSON_OBJECT(
 * //   'en', (SELECT JSON_OBJECT('name', name, 'details', details, ...) FROM productTranslations t WHERE t.productRef = p.productId AND t.locale = 'en'),
 * //   'tr', (SELECT JSON_OBJECT('name', name, 'details', details, ...) FROM productTranslations t WHERE t.productRef = p.productId AND t.locale = 'tr')
 * // )
 */
export function createSqlTranslationsSubquery<T extends z.ZodRawShape>(mainTableAlias: string, pkColumn: string, translationTable: string, refColumn: string, translationSchema: z.ZodObject<T>, locales?: AppLocale[]): string {
  const translationFields = Object.keys(translationSchema.shape);
  const fieldsObject = translationFields.map((field) => `'${field}', ${field}`).join(", ");
  const localesToQuery = locales && locales.length > 0 ? locales : routing.locales;

  const subqueries = localesToQuery?.map((locale) => `'${locale}', (SELECT JSON_OBJECT(${fieldsObject}) FROM ${translationTable} t WHERE t.${refColumn} = ${mainTableAlias}.${pkColumn} AND t.locale = '${locale}')`).join(", ");

  return `JSON_OBJECT(${subqueries})`;
}
