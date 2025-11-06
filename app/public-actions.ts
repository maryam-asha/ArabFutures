"use server";

import { TermFormSchema } from "@app/dashboard/terms/term.schema";
import { TermForm, TermFormState } from "@app/dashboard/terms/term.types";
import { ActionHandler, createActionParser, createPublicAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { TranslatableTermTitleSchema } from "@root/dal/dal.schema";
import { TermDb } from "@root/dal/dal.types";
import { findTerms } from "@root/dal/terms-dx";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { ActionState } from "@root/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const termActionParser = createActionParser();

const termSuggestionSaveHandler: ActionHandler<TermForm> = async (data): Promise<TermFormState> => {
  const { categoryRef, translations } = data;

  const titleJson: z.infer<typeof TranslatableTermTitleSchema> = { en: undefined, ar: undefined };
  const briefDescriptionJson: Record<string, string> = {};
  const fullDetailJson: Record<string, string> = {};

  for (const locale of i18nAppConfig.locales) {
    const trans = translations?.[locale as AppLocale];
    if (trans) {
      if (trans.title) {
        titleJson[locale as AppLocale] = [{ value: trans.title, references: [] }];
      }
      if (trans.briefDescription) {
        briefDescriptionJson[locale as AppLocale] = trans.briefDescription;
      }
    }
  }

  await dbClient.executeTransaction(async (trx) => {
    const result = await trx.insert("terms", {
      categoryRef,
      status: "pending",
      isFeatured: false,
      title: JSON.stringify(titleJson),
      briefDescription: JSON.stringify(briefDescriptionJson),
      fullDetail: JSON.stringify(fullDetailJson),
    });
    if (!result.insertId) throw new Error("Failed to create term suggestion.");
  });

  revalidatePath("/dashboard/approvals", "layout");

  return {
    success: true,
    message: "Suggestion submitted successfully! Thank you for your contribution.",
  };
};

export const suggestTermAction = createPublicAction(TermFormSchema, termSuggestionSaveHandler, termActionParser);

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
  console.log("To Email:", "your-email@example.com");
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

  const { data: terms } = await findTerms({
    locale,
    status: "published",
    query,
    categoryIds,
    limit: TERMS_PER_PAGE,
    offset,
  });

  return terms;
}
