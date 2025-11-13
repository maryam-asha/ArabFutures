import { unstable_noStore as noStore } from "next/cache";
import { z } from "zod";

import { dbClient } from "./client";
import { TermReviewDbSchema, TermReviewWithTermNameDbSchema } from "./dal.schema";
import { TermReviewDb, TermReviewWithTermName } from "./dal.types";

/**
 * Finds all reviews with a specific status, joining the term name for context.
 * Used for the dashboard reviews page.
 */
export const findReviewsByStatus = async (status: "pending" | "approved" | "rejected"): Promise<TermReviewWithTermName[]> => {
  noStore();
  const sql = `
    SELECT
      tr.*,
      t.content->>'$.default.en.name' AS termName
    FROM termReviews AS tr
    JOIN terms AS t ON tr.termRef = t.termId
    WHERE tr.status = ?
    ORDER BY tr.createdAt DESC;
  `;
  return dbClient.selectMany(sql, [status], TermReviewWithTermNameDbSchema);
};

/**
 * Finds a single review by its ID.
 */
export const findReviewById = async (reviewId: number): Promise<TermReviewDb | null> => {
  noStore();
  const sql = `SELECT * FROM termReviews WHERE reviewId = ? LIMIT 1;`;
  return dbClient.selectSingleOrDefault(sql, [reviewId], TermReviewDbSchema);
};

/**
 * Updates the status of a review and sets the resolvedAt timestamp.
 */
export const updateReviewStatus = async (reviewId: number, status: "approved" | "rejected"): Promise<void> => {
  await dbClient.update("termReviews", { status, resolvedAt: new Date() }, { reviewId });
};

/**
 * Gets the count of currently pending reviews.
 */
export const getPendingReviewCount = async (): Promise<number> => {
  noStore();
  const sql = `SELECT COUNT(reviewId) as count FROM termReviews WHERE status = 'pending'`;
  const result = await dbClient.selectSingle(sql, [], z.object({ count: z.number() }));
  return result.count;
};
