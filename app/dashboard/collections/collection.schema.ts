import { createTranslationsSchema } from "@i18n/Translatable";
import { z } from "zod";

const CollectionTranslationFormSchema = z.object({
  name: z.string().trim().min(2, { message: "Name must be at least 2 characters." }),
});

export const CollectionFormSchema = z.object({
  collectionId: z.coerce.number<number>().optional(),
  isActive: z.coerce.boolean<boolean>(),
  displayOrder: z.coerce.number<number>().int().min(0),
  translations: createTranslationsSchema(CollectionTranslationFormSchema),
});
