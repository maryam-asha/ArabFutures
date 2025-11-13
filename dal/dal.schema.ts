import i18nAppConfig from "@root/i18n/config";
import { z } from "zod";

const safeJsonParse = (val: unknown) => (typeof val === "string" ? JSON.parse(val) : val);

export const LocaleKeySchema = z.enum(i18nAppConfig.locales);
export const TranslatableStringDbSchema = z.record(LocaleKeySchema, z.string().optional());

export const TermCategoryDbSchema = z.object({
  categoryId: z.number(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean(),
  name: z.preprocess(safeJsonParse, TranslatableStringDbSchema),
});

export const TermCategoryOptionDbSchema = z.object({
  categoryId: z.number(),
  name: z.string(),
});

export const TermCategoryWithCountDbSchema = TermCategoryDbSchema.extend({
  termCount: z.number(),
});

export const TagDbSchema = z.object({
  tagId: z.number(),
  name: z.preprocess(safeJsonParse, TranslatableStringDbSchema),
});

export const TagOptionDbSchema = z.object({
  tagId: z.number(),
  name: z.string(),
});

export const TagWithCountDbSchema = TagDbSchema.extend({
  termCount: z.number(),
});

export const TermReferenceDbSchema = z
  .object({
    content: z.string().trim().optional().or(z.literal("")),
    url: z.url().optional().or(z.literal("")),
  })
  .refine((data) => !!data.content || !!data.url, {
    message: "Reference must have content or a URL.",
  });

export const TermTranslationDbSchema = z.object({
  name: z.string(),
  briefDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  references: z.array(TermReferenceDbSchema).optional(),
});

export const TermDefaultTranslationsDbSchema = z.object({
  en: TermTranslationDbSchema,
  ar: TermTranslationDbSchema,
});

export const TermMoreTranslationDbSchema = TermTranslationDbSchema.extend({
  locale: z.enum(i18nAppConfig.locales),
});

export const TermContentDbSchema = z.object({
  default: TermDefaultTranslationsDbSchema,
  more: z.array(TermMoreTranslationDbSchema).optional(),
});

export const TermDbSchema = z.object({
  termId: z.number(),
  categoryRef: z.number().nullable(),
  status: z.enum(["pending", "published", "rejected", "has-pending-review"]),
  isFeatured: z.coerce.boolean<boolean>(),
  content: z.preprocess(safeJsonParse, TermContentDbSchema),
  createdAt: z.date(),
  updatedAt: z.date(),

  tags: z.preprocess(safeJsonParse, z.array(TagDbSchema).nullable()).transform((val) => val || []),
  categoryName: z.string().nullable(),
});

export const TermForEditDbSchema = TermDbSchema.extend({
  tagIds: z
    .preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : val), z.array(z.number()))
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
  references: z.preprocess(safeJsonParse, z.array(TermReferenceDbSchema).nullable()),
  status: z.enum(["pending", "approved", "rejected"]),
  createdAt: z.date(),
  resolvedAt: z.date().nullable(),

  termName: z.string().optional(),
});

export const TermReviewWithTermNameDbSchema = TermReviewDbSchema.extend({
  termName: z.string(),
});
