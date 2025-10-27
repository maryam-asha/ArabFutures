import { createTranslationsSchema } from "@i18n/Translatable";
import i18nAppConfig from "@root/i18n/config";
import { z } from "zod";

const TermReferenceFormSchema = z.object({
  content: z.string().trim().min(1, { message: "Content is required." }).optional().or(z.literal("")),
  url: z.url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

const TermTranslationFormSchema = z.object({
  title: z.string().trim().min(3),
  briefDescription: z.string().trim().min(3),
  fullDetail: z.string().trim().min(3),
  references: z.array(TermReferenceFormSchema).optional(),
});

export const TermFormSchema = z
  .object({
    termId: z.coerce.number<number>().optional(),
    categoryRef: z.coerce.number<number>(),
    status: z.enum(["pending", "published"]),
    isFeatured: z.coerce.boolean<boolean>(),
    tags: z.array(z.coerce.number<number>()).optional(), // Expect an array of numbers (tag IDs)
    translations: createTranslationsSchema(TermTranslationFormSchema),
  })
  .refine(
    (data) => {
      return i18nAppConfig.locales.some((locale) => data.translations?.[locale]?.title);
    },
    {
      message: "At least one language must have a title.",
      path: [`translations.${i18nAppConfig.defaultLocale}.title`],
    },
  );

export const TermsBulkUpdateSchema = z.object({
  ids: z.array(z.coerce.number<number>()),
  actionType: z.enum(["approve", "pend", "feature", "unfeature"]),
});

export const TermsBuldDeleteSchema = z.object({
  ids: z.array(z.coerce.number<number>()),
});
