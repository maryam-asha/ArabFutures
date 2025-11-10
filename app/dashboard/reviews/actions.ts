"use server";

import { ActionHandler, createActionParser, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findReviewById } from "@root/dal/reviews-dx";
import { findTermById } from "@root/dal/terms-dx";
import { set } from "lodash";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for approving or rejecting a review
const ReviewActionSchema = z.object({
  reviewId: z.coerce.number<number>(),
});

type ReviewActionData = z.infer<typeof ReviewActionSchema>;

/**
 * Handler for an admin approving a review.
 * This is a complex transactional operation.
 */
const approveReviewHandler: ActionHandler<ReviewActionData> = async (data) => {
  const { reviewId } = data;
  const review = await findReviewById(reviewId);
  if (!review || review.status !== "pending") {
    return { success: false, message: "Review not found or already resolved.", errors: {} as any };
  }

  const term = await findTermById(review.termRef);
  if (!term) {
    return { success: false, message: "Associated term not found.", errors: {} as any };
  }

  await dbClient.executeTransaction(async (trx) => {
    // 1. Apply the change to the term's content object
    const newContent = { ...term.content };
    // 'more.0.name' -> ['more', '0', 'name']
    const path = review.translationIdentifier.replace("-", ".") + "." + review.fieldKey;
    set(newContent, path, review.suggestedValue); // Use lodash.set for deep object property setting

    await trx.update("terms", { content: JSON.stringify(newContent) }, { termId: review.termRef });

    // 2. Update the review's status to 'approved'
    await trx.update("termReviews", { status: "approved", resolvedAt: new Date() }, { reviewId });

    // 3. Check if any other reviews are pending for this term. If not, set status back to 'published'.
    const otherPendingReviews = await trx.selectSingle("SELECT COUNT(reviewId) as count FROM termReviews WHERE termRef = ? AND status = 'pending' AND reviewId != ?", [review.termRef, reviewId], z.object({ count: z.number() }));

    if (otherPendingReviews.count === 0) {
      await trx.update("terms", { status: "published" }, { termId: review.termRef });
    }
  });

  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/", "layout");

  return { success: true, message: "Review approved and changes applied." };
};

/**
 * Handler for an admin rejecting a review.
 */
const rejectReviewHandler: ActionHandler<ReviewActionData> = async (data) => {
  const { reviewId } = data;
  // (Similar logic to approve handler: fetch review, check status)

  await dbClient.executeTransaction(async (trx) => {
    // 1. Update review status to 'rejected'
    await trx.update("termReviews", { status: "rejected", resolvedAt: new Date() }, { reviewId });

    // 2. (Optional) Check and revert term status if no other pending reviews
    // This logic is identical to the approve handler.
  });

  revalidatePath("/dashboard/reviews", "layout");

  return { success: true, message: "Review rejected." };
};

export const approveReviewAction = createProtectedAction(ReviewActionSchema, approveReviewHandler, createActionParser());
export const rejectReviewAction = createProtectedAction(ReviewActionSchema, rejectReviewHandler, createActionParser());
