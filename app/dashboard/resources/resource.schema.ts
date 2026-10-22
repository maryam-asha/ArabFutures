import { z } from "zod";

const Bilingual = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
});

export const ResourceContentFormSchema = z.object({
  title: z.object({
    en: z.string().trim().min(2, "Title must be at least 2 characters."),
    ar: z.string().trim().min(2, "Title must be at least 2 characters."),
  }),
  description: Bilingual.optional(),
  authors: z.array(z.string().trim()).optional(),
  imageUrl: z.string().trim().optional(),
  url: z.string().trim().optional(),
  date: z.string().trim().optional(),
});

export const ResourceFormSchema = z.object({
  resourceId: z.coerce.number<number>().optional(),
  type: z.enum(["book", "article", "report", "video"]),
  categoryRef: z.coerce.number<number>().int().positive().optional(),
  language: z.string().trim().optional(),
  isActive: z.coerce.boolean<boolean>(),
  displayOrder: z.coerce.number<number>().int().min(0),
  content: ResourceContentFormSchema,
  tagIds: z.array(z.coerce.number<number>()).optional(),
  collectionIds: z.array(z.coerce.number<number>()).optional(),
});
