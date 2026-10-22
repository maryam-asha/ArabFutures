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

  suggestedChange: z.string(),
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

// =================================================================
// Members (network / collaborator profiles)
// =================================================================

export const MemberSocialDbSchema = z.object({
  email: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
});

export const MemberWorkDbSchema = z.object({
  imageUrl: z.string().optional(),
  type: z.string().optional(),
  date: z.string().optional(),
  readTime: z.string().optional(),
  url: z.string().optional(),
  title: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  description: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  tags: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val ?? []),
});

export const MemberLinkDbSchema = z.object({
  label: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  url: z.string().optional(),
});

export const MemberFavoriteWordDbSchema = z.object({
  word: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  explanation: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
});

export const MemberContentDbSchema = z.object({
  photoUrl: z.string().optional(),
  name: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  role: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  social: z.preprocess((v) => v ?? {}, MemberSocialDbSchema).optional(),
  roleWithinAsf: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema).optional(),
  professionalProfile: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema).optional(),
  favoriteWord: z.preprocess((v) => v ?? {}, MemberFavoriteWordDbSchema).optional(),
  works: z
    .array(MemberWorkDbSchema)
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  links: z
    .array(MemberLinkDbSchema)
    .nullable()
    .optional()
    .transform((val) => val ?? []),
});

export const MemberDbSchema = z.object({
  memberId: z.number(),
  slug: z.string(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean<boolean>(),
  isFeatured: z.coerce.boolean<boolean>(),
  content: z.preprocess(safeJsonParse, MemberContentDbSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// =================================================================
// Library: collections & resources
// =================================================================

export const CollectionDbSchema = z.object({
  collectionId: z.number(),
  displayOrder: z.number(),
  isActive: z.coerce.boolean<boolean>(),
  name: z.preprocess(safeJsonParse, TranslatableStringDbSchema),
});

export const CollectionOptionDbSchema = z.object({
  collectionId: z.number(),
  name: z.string(),
});

export const CollectionWithCountDbSchema = CollectionDbSchema.extend({
  resourceCount: z.number(),
});

export const ResourceTypeSchema = z.enum(["book", "article", "report", "video"]);

export const ResourceContentDbSchema = z.object({
  title: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  description: z.preprocess((v) => v ?? {}, TranslatableStringDbSchema),
  authors: z
    .array(z.string())
    .nullable()
    .optional()
    .transform((val) => val ?? []),
  imageUrl: z.string().optional(),
  url: z.string().optional(),
  date: z.string().optional(),
});

export const ResourceDbSchema = z.object({
  resourceId: z.number(),
  type: ResourceTypeSchema,
  categoryRef: z.number().nullable(),
  language: z.string().nullable(),
  isActive: z.coerce.boolean<boolean>(),
  displayOrder: z.number(),
  content: z.preprocess(safeJsonParse, ResourceContentDbSchema),
  createdAt: z.date(),
  updatedAt: z.date(),

  categoryName: z.string().nullable(),
  tags: z.preprocess(safeJsonParse, z.array(TagDbSchema).nullable()).transform((val) => val || []),
});

export const ResourceForEditDbSchema = ResourceDbSchema.extend({
  tagIds: z
    .preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : val), z.array(z.number()))
    .nullable()
    .transform((arr) => arr || []),
  collectionIds: z
    .preprocess((val) => (typeof val === "string" && val ? JSON.parse(val) : val), z.array(z.number()))
    .nullable()
    .transform((arr) => arr || []),
});
