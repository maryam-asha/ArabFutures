import { createTranslationsSchema } from "@i18n/Translatable";
import { z } from "zod";

const CategoryTranslationFormSchema = z.object({
  name: z.string().trim().min(3, { message: "Name must be at least 3 characters." }),
});

export const CategoryFormSchema = z.object({
  categoryId: z.coerce.number<number>().optional(),
  isActive: z.coerce.boolean<boolean>(),
  translations: createTranslationsSchema(CategoryTranslationFormSchema),
});
