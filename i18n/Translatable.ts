import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { z } from "zod";

/**
 * Creates a flexible Zod schema for a translations object.
 *
 * The resulting schema is a `z.partial(...)` object. This means any number of
 * locale keys (from none to all) can be present, making it ideal for both
 * fetching partial data and for form submissions where not all languages are required.
 *
 * @param contentSchema The Zod schema for the fields of a single translation (e.g., `{ name: z.string() }`).
 * @returns A Zod schema representing a partial mapping of locales to content.
 */
export function createTranslationsSchema<T extends z.ZodRawShape>(contentSchema: z.ZodObject<T>) {
  const { locales } = i18nAppConfig;
  const localeSchemas = Object.fromEntries(locales.map((locale) => [locale, contentSchema.nullable()])) as Record<AppLocale, z.ZodNullable<z.ZodObject<T>>>;
  return z.object(localeSchemas).partial();
}
