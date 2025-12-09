"use server";

import { ActionHandler, createActionParser, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findPendingReviewsByTermId, findReviewById, findReviewsByStatus, getPendingReviewCount } from "@root/dal/reviews-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { ReviewActionSchema } from "./review.schema";
import { ReviewActionInput } from "./review.type";

/**
 * Handler for an admin rejecting a review.
 */

const rejectReviewHandler: ActionHandler<ReviewActionInput> = async (data) => {
  const { reviewId } = data;
  const review = await findReviewById(reviewId);
  if (!review || review.status !== "pending") {
    return { success: false, message: "Review not found or already resolved.", errors: {} as any };
  }

  await dbClient.executeTransaction(async (trx) => {
    await trx.update("termReviews", { status: "rejected", resolvedAt: new Date() }, { reviewId });

    const otherPendingReviews = await trx.selectSingle("SELECT COUNT(reviewId) as count FROM termReviews WHERE termRef = ? AND status = 'pending' AND reviewId != ?", [review.termRef, reviewId], z.object({ count: z.number() }));

    if (otherPendingReviews.count === 0) {
      const term = await trx.selectSingle("SELECT status FROM terms WHERE termId = ?", [review.termRef], z.object({ status: z.string() }));
      if (term?.status === "has-pending-review") {
        await trx.update("terms", { status: "published" }, { termId: review.termRef });
      }
    }
  });

  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/dashboard/terms", "layout");

  redirect("/dashboard/reviews");
};
export const rejectReviewAction = createProtectedAction(ReviewActionSchema, rejectReviewHandler, createActionParser());

export async function getPendingReviewsByTermId(termId: number) {
  const reviews = await findPendingReviewsByTermId(termId);
  return reviews;
}

export async function getReviewsByStatusAction(status: "pending" | "approved" | "rejected") {
  return findReviewsByStatus(status);
}

export async function getPendingReviewCountAction() {
  return getPendingReviewCount();
}
