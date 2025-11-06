import i18nAppConfig from "@root/i18n/config";
import { z } from "zod";

export const LocaleKeySchema = z.enum(i18nAppConfig.locales);

/**
 * A simple translatable string, stored as a JSON object.
 * Validates: { "en": "Name", "ar": "اسم" }
 */
export const TranslatableStringSchema = z.record(LocaleKeySchema, z.string().optional());

/**
 * A reference for a term title. URL and content are optional, but at least one should exist.
 */
export const TermReferenceSchema = z
  .object({
    content: z.string().optional(),
    url: z.url().or(z.literal("")).optional(),
  })
  .refine((data) => data.content || data.url, {
    message: "Reference must have content or a URL.",
  });
export type TermReference = z.infer<typeof TermReferenceSchema>;

/**
 * A single, translatable title entry for a term.
 */
export const TermTitleEntrySchema = z.object({
  value: z.string(),
  references: z.array(TermReferenceSchema).optional().default([]),
});

export type TermTitleEntry = z.infer<typeof TermTitleEntrySchema>;

/**
 * The full schema for the `title` JSON object in the `terms` table.
 * Validates: { "en": [ { value: "...", references: [...] } ], "ar": [ ... ] }
 */
export const TranslatableTermTitleSchema = z.record(LocaleKeySchema, z.array(TermTitleEntrySchema).optional());
type test = z.infer<typeof TranslatableTermTitleSchema>;

const safeJsonParse = (val: unknown) => (typeof val === "string" ? JSON.parse(val) : val);

export const TermCategoryDbSchema = z.object({
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean(),
  name: z.preprocess(safeJsonParse, TranslatableStringSchema),
});

export const TermCategoryOptionSchema = z.object({
  categoryId: z.number(),
  name: z.string(),
});

export const TermCategoryWithCountDbSchema = TermCategoryDbSchema.extend({
  termCount: z.number(),
});

export const TagDbSchema = z.object({
  tagId: z.number(),
  name: z.preprocess(safeJsonParse, TranslatableStringSchema),
});

export const TagOptionSchema = z.object({
  tagId: z.number(),
  name: z.string(),
});

export const TermDbSchema = z.object({
  termId: z.number(),
  categoryRef: z.number().nullable(),
  status: z.enum(["pending", "published"]),
  isFeatured: z.coerce.boolean(),
  title: z.preprocess(safeJsonParse, TranslatableTermTitleSchema),
  briefDescription: z.preprocess(safeJsonParse, TranslatableStringSchema.nullable()),
  fullDetail: z.preprocess(safeJsonParse, TranslatableStringSchema.nullable()),
  categoryName: z.string().nullable(),
  tags: z.preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : []), z.array(z.object({ tagId: z.number(), name: z.string() })).nullable()),
});

export const TermForEditDbSchema = TermDbSchema.extend({
  tagIds: z
    .preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : val), z.array(z.number()))
    .nullable()
    .transform((arr) => arr || []),
});
