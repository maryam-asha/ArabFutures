import { z } from "zod";

/**
 * Zod schemas for Term and its translations/names.
 * Re-use these on server and (some) client validation.
 */
export const LocaleKeySchema = z.string().min(2).max(6);

export const TermNameReferenceSchema = z.object({
  label: z.string().min(0).optional(),
  url: z.url().optional(),
});

export type TermNameReference = z.infer<typeof TermNameReferenceSchema>;

export const TermNameEntrySchema = z.object({
  value: z.string().min(1),
  references: z.array(TermNameReferenceSchema).optional(),
});

export type TermNameEntry = z.infer<typeof TermNameEntrySchema>;

/**
 * For the 'name' special field we accept an object with locale keys,
 * where each locale maps to an array of TermNameEntry
 * e.g. { en: [{ value: 'Foresight', references: [...] }], ar: [...] }
 */
export const TermNameTranslationsSchema = z.record(LocaleKeySchema, z.array(TermNameEntrySchema).min(1));

export type TermNameTranslations = z.infer<typeof TermNameTranslationsSchema>;

/**
 * Term translations for other text fields per-locale.
 * Keep brief and full as optional for each locale.
 */
export const TermOtherTranslationsSchema = z.record(
  LocaleKeySchema,
  z.object({
    brief: z.string().optional(),
    full: z.string().optional(),
  }),
);

export type TermOtherTranslations = z.infer<typeof TermOtherTranslationsSchema>;

/**
 * Term create payload expected from the client action.
 */
export const TermCreateSchema = z.object({
  slug: z.string().min(1),
  status: z.enum(["draft", "published", "archived"]).optional(),
  name: TermNameTranslationsSchema,
  translations: TermOtherTranslationsSchema.optional(),
});

export type TermCreate = z.infer<typeof TermCreateSchema>;

export const TagSchema = z.object({
  tagId: z.number(),
  name: z.string(),
});

export type TermTag = z.infer<typeof TagSchema>;
