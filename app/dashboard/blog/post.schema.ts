import { z } from "zod";

const Bilingual = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
});

export const BlogPostContentFormSchema = z.object({
  title: z.object({
    en: z.string().trim().min(2, "Title must be at least 2 characters."),
    ar: z.string().trim().min(2, "Title must be at least 2 characters."),
  }),
  excerpt: Bilingual.optional(),
  body: Bilingual.optional(),
  coverImageUrl: z.string().trim().optional(),
  date: z.string().trim().optional(),
  readTime: z.string().trim().optional(),
});

export const BlogPostFormSchema = z.object({
  postId: z.coerce.number<number>().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  categoryRef: z.coerce.number<number>().int().positive().optional(),
  isActive: z.coerce.boolean<boolean>(),
  isFeatured: z.coerce.boolean<boolean>(),
  displayOrder: z.coerce.number<number>().int().min(0),
  content: BlogPostContentFormSchema,
  tagIds: z.array(z.coerce.number<number>()).optional(),
});
