import { z } from "zod";

// Reusable schemas for form validation, matching the new content structure.
const TermReferenceFormSchema = z
  .object({
    content: z.string().trim().optional(),
    url: z.string().trim().optional(),
  })
  .refine((data) => !!data.content || !!data.url, {
    message: "A reference must have content or a URL if it's not empty.",
  });

const TermTranslationFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  briefDescription: z.string().trim().optional(),
  fullDescription: z.string().trim().optional(),
  references: z.array(TermReferenceFormSchema).optional(),
});

const TermMoreTranslationFormSchema = TermTranslationFormSchema.extend({
  locale: z.string().min(2, "You must specify a locale (e.g., 'fr', 'ar-latn')."),
});

const TermContentFormSchema = z.object({
  default: z.object({
    en: TermTranslationFormSchema,
    ar: TermTranslationFormSchema,
  }),
  more: z.array(TermMoreTranslationFormSchema).optional(),
});

// The main Zod schema for the Term creation/edit form
export const TermFormSchema = z.object({
  termId: z.coerce.number<number>().optional(),
  categoryRef: z.coerce.number<number>({ error: () => ({ message: "Please select a category." }) }).min(1),
  status: z.enum(["pending", "published", "rejected", "has-pending-review"]),
  isFeatured: z.coerce.boolean<boolean>(),
  tags: z.array(z.coerce.number<number>()).optional(),
  content: TermContentFormSchema,
});

// Schemas for bulk actions
export const TermsBulkUpdateSchema = z.object({
  ids: z.array(z.coerce.number<number>()),
  actionType: z.enum(["approve", "pend", "reject", "feature", "unfeature"]),
});
