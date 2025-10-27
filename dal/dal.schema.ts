import { createTranslationsSchema } from "@i18n/Translatable";
import { z } from "zod";

// =================================================================
// TERM CATEGORIES
// =================================================================
export const TermCategoryTranslationDbSchema = z.object({
  name: z.string(),
});

export const TermCategoryDbSchema = z.object({
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean(),
  translations: createTranslationsSchema(TermCategoryTranslationDbSchema),
});

// For dropdowns in the form
export const TermCategoryOptionSchema = z.object({
  categoryId: z.number(),
  name: z.string(),
});

export const TermCategoryWithCountDbSchema = z.object({
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean(),
  termCount: z.number(),
  translations: createTranslationsSchema(TermCategoryTranslationDbSchema),
});

// =================================================================
// TAGS
// =================================================================
export const TagTranslationDbSchema = z.object({
  name: z.string(),
});

export const TagDbSchema = z.object({
  tagId: z.number(),
  translations: createTranslationsSchema(TagTranslationDbSchema),
});

// For dropdowns/multi-select in the form
export const TagOptionSchema = z.object({
  tagId: z.number(),
  name: z.string(),
});

// =================================================================
// TERMS
// =================================================================

export const TermReferenceDbSchema = z.object({
  referenceId: z.number(),
  content: z.string().nullable(),
  url: z.string().nullable(),
});

export const TermTranslationDbSchema = z.object({
  title: z.string(),
  briefDescription: z.string().nullable(),
  fullDetail: z.string().nullable(),
  // references: z.preprocess((val) => (val ? JSON.parse(val as string) : []), z.array(TermReferenceDbSchema)),
  references: z.array(TermReferenceDbSchema).nullable().default([]),
});

// This schema is now more complex to fetch related data efficiently
export const TermDbSchema = z.object({
  termId: z.number(),
  categoryRef: z.number().nullable(),
  status: z.enum(["pending", "published"]),
  isFeatured: z.coerce.boolean(),
  translations: z.preprocess((val) => (typeof val === "string" ? JSON.parse(val) : val), createTranslationsSchema(TermTranslationDbSchema)),

  // We'll fetch the category name and tags directly in our query
  categoryName: z.string().nullable(),
  tags: z.preprocess(
    (val) => (typeof val === "string" && val ? JSON.parse(val) : []),
    z.array(
      z.object({
        tagId: z.number(),
        name: z.string(),
      }),
    ),
  ),
});

export const TermForEditDbSchema = TermDbSchema.extend({
  tagIds: z
    .string() // The database will return a comma-separated string of IDs
    .nullable()
    .transform((str) => (str ? str.split(",").map(Number) : [])),
});
