"use server";

import { AppLocale } from "@i18n/config";
import { createActionParser, createPublicAction } from "@lib/action-handler";
import { sendContactFormEmail } from "@lib/email-service";
import { dbClient } from "@root/dal/client";
import { TermReferenceDbSchema, TermTranslationDbSchema } from "@root/dal/dal.schema";
import { TermDb } from "@root/dal/dal.types";
import { findTerms } from "@root/dal/terms-dx";
import { ActionState } from "@root/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ContactActionSchema } from "./public.schema";
import type { ContactActionValues } from "./public.type";

const NewTermSuggestionActionSchema = z.object({
  categoryRef: z.coerce.number().min(1, "Please select a category."),
  content: z.object({
    default: z.object({
      en: TermTranslationDbSchema,
      ar: TermTranslationDbSchema,
    }),
  }),
});

type NewTermSuggestionActionInput = z.infer<typeof NewTermSuggestionActionSchema>;

const suggestNewTermHandler = async (data: NewTermSuggestionActionInput): Promise<ActionState<NewTermSuggestionActionInput>> => {
  const { categoryRef, content } = data;

  const fullContentPayload = {
    default: {
      en: { ...content.default.en },
      ar: { ...content.default.ar },
    },
    more: [],
  };

  await dbClient.insert("terms", {
    categoryRef,
    status: "pending",
    isFeatured: false,
    content: JSON.stringify(fullContentPayload),
  });

  revalidatePath("/dashboard/approvals", "layout");

  return { success: true, message: "Public.suggestDialog.successMessage" };
};

export const suggestNewTermAction = createPublicAction(NewTermSuggestionActionSchema, suggestNewTermHandler, createActionParser({ jsonFields: ["content"] }));

const SubmitReviewActionSchema = z.object({
  termRef: z.coerce.number(),
  suggestedChange: z.string().min(10, "Your suggestion must be at least 10 characters."),
  explanation: z.string().optional(),
  references: z.array(TermReferenceDbSchema),
});

type SubmitReviewActionInput = z.infer<typeof SubmitReviewActionSchema>;

const submitReviewHandler = async (data: SubmitReviewActionInput): Promise<ActionState<SubmitReviewActionInput>> => {
  await dbClient.executeTransaction(async (trx) => {
    await trx.insert("termReviews", {
      termRef: data.termRef,
      suggestedChange: data.suggestedChange,
      explanation: data.explanation || "",
      references: JSON.stringify(data.references),
    });

    await trx.update("terms", { status: "has-pending-review" }, { termId: data.termRef });
  });

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/dashboard/terms", "layout");

  return { success: true, message: "Public.reviewDialog.successMessage" };
};

export const submitReviewAction = createPublicAction(SubmitReviewActionSchema, submitReviewHandler, createActionParser({ jsonFields: ["references"] }));

const contactHandler = async (data: ContactActionValues): Promise<ActionState<ContactActionValues>> => {
  if (data.website) {
    return { success: true, message: "Public.contact.successMessage" };
  }

  try {
    await sendContactFormEmail({ name: data.name, email: data.email, message: data.message }, data.locale as AppLocale);
    return {
      success: true,
      message: "Public.contact.successMessage",
    };
  } catch (error) {
    console.error("Self-Hosted SMTP Error in contact form:", error);

    return {
      success: false,
      message: "Public.contact.errorMessage",
      errors: {} as any,
    };
  }
};

export const contactAction = createPublicAction(ContactActionSchema, contactHandler, createActionParser());

const TERMS_PER_PAGE = 8;

export async function loadMoreTermsAction(locale: AppLocale, page: number, query?: string, categoryIds?: number[], orderBy?: "newest" | "oldest"): Promise<TermDb[]> {
  const offset = page * TERMS_PER_PAGE;

  const { data: terms } = await findTerms({
    locale,
    status: "published",
    query,
    categoryIds,
    orderBy,
    limit: TERMS_PER_PAGE,
    offset,
  });

  return terms;
}
