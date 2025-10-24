// File: app/dashboard/terms/term.schema.ts
import { createTranslationsSchema } from "@i18n/Translatable";
import { z } from "zod";

const TermTranslationFormSchema = z.object({
  title: z.string().trim().min(3, { message: "Title must be at least 3 characters." }),
  briefDescription: z.string().optional(),
  fullDetail: z.string().optional(),
});

export const TermFormSchema = z.object({
  termId: z.coerce.number<number>().optional(),
  categoryRef: z.coerce.number<number>({
    error: "Please select a category.",
  }),
  status: z.enum(["pending", "published"]),
  isFeatured: z.coerce.boolean<boolean>(),
  tags: z.array(
    z.object({
      tagId: z.number(),
      name: z.string(),
    }),
  ),
  // .optional(), // For the multi-select
  translations: createTranslationsSchema(TermTranslationFormSchema),
});
