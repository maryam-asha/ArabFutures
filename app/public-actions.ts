"use server";

import { AppLocale } from "@i18n/config";
import { createActionParser, createPublicAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { TermReferenceDbSchema, TermTranslationDbSchema } from "@root/dal/dal.schema";
import { TermDb } from "@root/dal/dal.types";
import { findTerms } from "@root/dal/terms-dx";
import { ActionState } from "@root/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const NewTermSuggestionActionSchema = z.object({
  categoryRef: z.coerce.number().min(1, "Please select a category."),
  content: z.object({
    default: z.object({
      en: TermTranslationDbSchema.pick({ name: true, fullDescription: true, references: true }),
      ar: TermTranslationDbSchema.pick({ name: true, fullDescription: true, references: true }),
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

  return { success: true, message: "Suggestion submitted successfully and is now pending review!" };
};

export const suggestNewTermAction = createPublicAction(NewTermSuggestionActionSchema, suggestNewTermHandler, createActionParser({ jsonFields: ["content"] }));

const SubmitReviewActionSchema = z.object({
  termRef: z.coerce.number(),
  translationIdentifier: z.string().min(1),
  fieldKey: z.string().min(1),
  suggestedValue: z.string().min(1, "Your suggestion cannot be empty."),
  explanation: z.string().optional(),

  references: z
    .string()
    .transform((val) => JSON.parse(val || "[]"))
    .pipe(z.array(TermReferenceDbSchema)),
});

type SubmitReviewActionInput = z.infer<typeof SubmitReviewActionSchema>;

const submitReviewHandler = async (data: SubmitReviewActionInput): Promise<ActionState<SubmitReviewActionInput>> => {
  await dbClient.executeTransaction(async (trx) => {
    await trx.insert("termReviews", {
      ...data,
      references: JSON.stringify(data.references),
    });

    await trx.update("terms", { status: "has-pending-review" }, { termId: data.termRef });
  });

  revalidatePath("/", "layout");
  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/dashboard/terms", "layout");

  return { success: true, message: "Thank you! Your suggestion has been submitted for review." };
};

export const submitReviewAction = createPublicAction(SubmitReviewActionSchema, submitReviewHandler, createActionParser());

const ContactActionSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});
type ContactActionInput = z.infer<typeof ContactActionSchema>;

export async function contactAction(prevState: ActionState<ContactActionInput>, formData: FormData): Promise<ActionState<ContactActionInput>> {
  const parsed = ContactActionSchema.safeParse(Object.fromEntries(formData));

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
