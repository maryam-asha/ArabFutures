import i18nAppConfig from "@root/i18n/config";
import { z } from "zod";

// Utility function for safely parsing JSON from the database
const safeJsonParse = (val: unknown) => (typeof val === "string" ? JSON.parse(val) : val);

// =================================================================
// Schemas for the new 'terms.content' JSON structure
// =================================================================

export const TermReferenceSchema = z
  .object({
    content: z.string().trim().optional().or(z.literal("")),
    url: z.url({ message: "Invalid URL" }).optional().or(z.literal("")),
  })
  .refine((data) => !!data.content || !!data.url, {
    message: "Reference must have content or a URL.",
  });

export const TermTranslationSchema = z.object({
  name: z.string().min(1, "Name is required."),
  briefDescription: z.string().optional().default(""),
  fullDescription: z.string().optional().default(""),
  references: z.array(TermReferenceSchema).optional().default([]),
});

export const TermDefaultTranslationsSchema = z.object({
  en: TermTranslationSchema,
  ar: TermTranslationSchema,
});

export const TermMoreTranslationSchema = TermTranslationSchema.extend({
  locale: z.string().min(2, "Locale identifier is required."),
});

export const TermContentSchema = z.object({
  default: TermDefaultTranslationsSchema,
  more: z.array(TermMoreTranslationSchema).optional().default([]),
});

// =================================================================
// Zod Schemas for Database Table Rows
// =================================================================

export const TermDbSchema = z.object({
  termId: z.number(),
  categoryRef: z.number().nullable(),
  status: z.enum(["pending", "published", "rejected", "has-pending-review"]),
  isFeatured: z.coerce.boolean<boolean>(),
  content: z.preprocess(safeJsonParse, TermContentSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Joined fields
  categoryName: z.string().nullable(),
  tags: z.preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : []), z.array(z.object({ tagId: z.number(), name: z.string() })).nullable()).default([]),
});

export const TermForEditDbSchema = TermDbSchema.extend({
  tagIds: z
    .preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : []), z.array(z.number()))
    .nullable()
    .transform((arr) => arr || []),
});

export const TermReviewDbSchema = z.object({
  reviewId: z.number(),
  termRef: z.number(),
  translationIdentifier: z.string(),
  fieldKey: z.string(),
  suggestedValue: z.string(),
  explanation: z.string().nullable(),
  references: z.preprocess(safeJsonParse, z.array(TermReferenceSchema).nullable()),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.date(),
  resolvedAt: z.date().nullable(),
  // Joined field
  termName: z.string().optional(), // Name of the term being reviewed
});

// =================================================================
// Schemas for other tables (Unchanged Logic, Convention Alignment)
// =================================================================

export const LocaleKeySchema = z.enum(i18nAppConfig.locales);
export const TranslatableStringSchema = z.record(LocaleKeySchema, z.string().optional());

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
