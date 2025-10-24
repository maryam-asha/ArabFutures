import { createTranslationsSchema } from "@i18n/Translatable";
import { z } from "zod";

const TagTranslationFormSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
});

export const TagFormSchema = z.object({
  tagId: z.coerce.number<number>().optional(),
  translations: createTranslationsSchema(TagTranslationFormSchema),
});
