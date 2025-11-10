"use server";

import { createActionParser, createPublicAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { TermReferenceSchema, TermTranslationSchema } from "@root/dal/dal.schema";
import { TermDb } from "@root/dal/dal.types";
import { findTerms } from "@root/dal/terms-dx";
import { AppLocale } from "@root/i18n/config";
import { ActionState } from "@root/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =================================================================
// Action: Suggest a completely new term (from the hero button)
// =================================================================

const NewTermSuggestionSchema = z.object({
  categoryRef: z.coerce.number().min(1, "Please select a category."),
  content: z.object({
    default: z.object({
      // We only validate name/briefDescription, as that's all the form shows.
      en: TermTranslationSchema.pick({ name: true, briefDescription: true }),
      ar: TermTranslationSchema.pick({ name: true, briefDescription: true }),
    }),
  }),
});

const suggestNewTermHandler = async (data: z.infer<typeof NewTermSuggestionSchema>): Promise<ActionState<any>> => {
  const { categoryRef, content } = data;

  // Build the full content object, ensuring 'more' is an empty array and other fields are present.
  const fullContentPayload = {
    default: {
      en: { ...content.default.en, fullDescription: "", references: [] },
      ar: { ...content.default.ar, fullDescription: "", references: [] },
    },
    more: [],
  };

  await dbClient.insert("terms", {
    categoryRef,
    status: "pending", // ALWAYS pending for public submissions
    isFeatured: false, // NEVER featured for public submissions
    content: JSON.stringify(fullContentPayload),
  });

  revalidatePath("/dashboard/approvals", "layout");

  return { success: true, message: "Suggestion submitted successfully and is now pending review!" };
};

export const suggestNewTermAction = createPublicAction(NewTermSuggestionSchema, suggestNewTermHandler, createActionParser());

// =================================================================
// Action: Submit a review/change for an EXISTING term
// =================================================================

const SubmitReviewSchema = z.object({
  termRef: z.coerce.number(),
  translationIdentifier: z.string().min(1),
  fieldKey: z.string().min(1),
  suggestedValue: z.string().min(1, "Your suggestion cannot be empty."),
  explanation: z.string().optional(),
  // References are passed as a JSON string from a hidden input and then parsed
  references: z
    .string()
    .transform((val) => JSON.parse(val || "[]"))
    .pipe(z.array(TermReferenceSchema)),
});

const submitReviewHandler = async (data: z.infer<typeof SubmitReviewSchema>): Promise<ActionState<any>> => {
  await dbClient.executeTransaction(async (trx) => {
    // 1. Insert the new review record
    await trx.insert("termReviews", {
      ...data,
      references: JSON.stringify(data.references), // Re-stringify for the DB
    });

    // 2. Update the term's status to indicate a review is pending
    await trx.update("terms", { status: "has-pending-review" }, { termId: data.termRef });
  });

  // Revalidate pages where this change is visible
  revalidatePath("/", "layout"); // Revalidates all public pages
  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/dashboard/terms", "layout");

  return { success: true, message: "Thank you! Your suggestion has been submitted for review." };
};

export const submitReviewAction = createPublicAction(SubmitReviewSchema, submitReviewHandler, createActionParser());

// =================================================================
// Action: Handle the contact form submission
// =================================================================

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

  // In a real application, you would send an email here.
  // For now, we just log it to the console.
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

// =================================================================
// Action: Load more terms for the public listing (infinite scroll)
// =================================================================

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
