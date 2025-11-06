import { createTranslationsSchema } from "@i18n/Translatable";
import i18nAppConfig from "@root/i18n/config";
import { z } from "zod";

const TermReferenceFormSchema = z
  .object({
    content: z.string().trim().optional().or(z.literal("")),
    url: z.string().trim().optional().or(z.literal("")),
  })
  .refine((data) => data.content || data.url, {
    message: "A reference must have content or a URL if it is not empty.",
  });

const TermTranslationFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  briefDescription: z.string().trim().optional(),
  fullDetail: z.string().trim().optional(),
  references: z.array(TermReferenceFormSchema).optional(),
});

export const TermFormSchema = z
  .object({
    termId: z.coerce.number<number>().optional(),
    categoryRef: z.coerce.number<number>({ error: "Please select a category." }).min(1, "Please select a category."),
    status: z.enum(["pending", "published"]),
    isFeatured: z.coerce.boolean<boolean>(),
    tags: z.array(z.coerce.number<number>()).optional(),
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
