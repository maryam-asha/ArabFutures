"use server";

import { createActionParser } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { TermDb } from "@root/dal/dal.types";
import { findTerms } from "@root/dal/terms-dx";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { ActionState } from "@root/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const TermSuggestionSchema = z
  .object({
    categoryRef: z.coerce.number().min(1, "Please select a category."),
    tags: z.array(z.coerce.number()).optional(),
    translations: z.any(),
  })
  .refine(
    (data) => {
      const translations = data.translations || {};
      return i18nAppConfig.locales.some((locale) => translations[locale]?.title && translations[locale].title.length >= 3);
    },
    {
      message: "At least one language must have a title with at least 3 characters.",
      path: [`translations.${i18nAppConfig.defaultLocale}.title`],
    },
  );

const parseSuggestionFormData = createActionParser();

export async function suggestTermAction(prevState: ActionState<any>, formData: FormData): Promise<ActionState<any>> {
  try {
    const dataToParse = parseSuggestionFormData(formData);
    const parsed = TermSuggestionSchema.safeParse(dataToParse);

    if (!parsed.success) {
      return {
        success: false,
        message: "Validation failed.",
        errors: z.treeifyError(parsed.error),
      };
    }

    const { categoryRef, tags, translations } = parsed.data;
    let newTermId: number | undefined;

    await dbClient.executeTransaction(async (trx) => {
      const result = await trx.insert("terms", {
        categoryRef,
        status: "pending",
        isFeatured: false,
      });
      newTermId = result.insertId;

      if (!newTermId) throw new Error("Failed to create term.");

      for (const locale of i18nAppConfig.locales) {
        const trans = translations?.[locale];
        if (trans?.title) {
          await trx.insert("termTranslations", {
            termRef: newTermId,
            locale,
            title: trans.title,
            briefDescription: trans.briefDescription || null,
            fullDetail: trans.fullDetail || null,
          });
        }
      }

      // CORRECTED: Save tags for the new suggestion
      if (tags && tags.length > 0 && newTermId) {
        const tagValues = tags.map((tagId) => ({ _isRawSql: true, value: `{${newTermId}, ${tagId}}` }));

        await trx.insertMany("termTags", tagValues);
      }
    });

    revalidatePath("/dashboard/approvals", "layout");

    return {
      success: true,
      message: "Suggestion submitted successfully!",
    };
  } catch (error) {
    console.error("Suggestion Action Error:", error);
    return {
      success: false,
      message: "An unexpected server error occurred.",
      errors: {} as any,
    };
  }
}

// Action for the contact form
const ContactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

export async function contactAction(prevState: ActionState<any>, formData: FormData): Promise<ActionState<any>> {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: z.treeifyError(parsed.error),
    };
  }

  console.log("=== CONTACT FORM SUBMISSION ===");
  console.log("To Email:", "your-email@example.com"); // Replace with your email
  console.log("Name:", parsed.data.name);
  console.log("Email:", parsed.data.email);
  console.log("Message:", parsed.data.message);
  console.log("=============================");

  return {
    success: true,
    message: "Your message has been sent successfully!",
  };
}

const TERMS_PER_PAGE = 8;

export async function loadMoreTermsAction(locale: AppLocale, page: number, query?: string, categoryIds?: number[]): Promise<TermDb[]> {
  const offset = page * TERMS_PER_PAGE;

  const terms = await findTerms({
    locale,
    status: "published",
    query,
    categoryIds,
    limit: TERMS_PER_PAGE,
    offset,
  });

  return terms;
}
