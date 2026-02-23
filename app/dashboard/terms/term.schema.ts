import i18nAppConfig from "@i18n/config";
import { z } from "zod";

const TermReferenceFormSchema = z
  .object({
    content: z.string().trim().optional(),

    url: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.url && !data.content) {
        return false;
      }
      return true;
    },
    {
      message: "A label or content is required when a URL is provided.",
      path: ["content"],
    },
  )
  .refine(
    (data) => {
      if (data.url) {
        return z.string().url().safeParse(data.url).success;
      }
      return true;
    },
    {
      message: "Please enter a valid URL.",
      path: ["url"],
    },
  );
export const TermTranslationFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  briefDescription: z.string().trim().optional(),
  fullDescription: z.string().trim().optional(),
  references: z.array(TermReferenceFormSchema).optional(),
});

const TermMoreTranslationFormSchema = TermTranslationFormSchema.extend({
  locale: z.enum(i18nAppConfig.locales, { message: "Invalid locale selected." }),
});

const TermContentFormSchema = z.object({
  default: z.object({
    en: TermTranslationFormSchema,
    ar: TermTranslationFormSchema,
  }),
  more: z.array(TermMoreTranslationFormSchema).optional(),
});

export const TermFormSchema = z.object({
  termId: z.coerce.number<number>().optional(),
  categoryRef: z.coerce.number<number>({ error: () => ({ message: "Please select a category." }) }).min(1),
  status: z.enum(["pending", "published", "rejected", "has-pending-review"]),
  isFeatured: z.coerce.boolean<boolean>(),
  tagIds: z.array(z.coerce.number<number>()).optional(),
  content: TermContentFormSchema,
  reviewIds: z.array(z.coerce.number<number>()).optional(),
  source: z.enum(["reviews", "approvals"]).optional(),
});

export const TermsBulkUpdateActionSchema = z.object({
  ids: z.array(z.coerce.number<number>()),
  actionType: z.enum(["approve", "pend", "reject", "feature", "unfeature"]),
});
