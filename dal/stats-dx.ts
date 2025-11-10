import { z } from "zod";

import { dbClient } from "./client";

const DashboardStatsSchema = z.object({
  totalTerms: z.number(),
  publishedTerms: z.number(),
  pendingTerms: z.number(),
});

export type DashboardStats = z.infer<typeof DashboardStatsSchema>;

/**
 * Fetches key statistics for the admin dashboard in a single, efficient query.
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const sql = `
    SELECT
      COUNT(*) AS totalTerms,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) AS publishedTerms,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingTerms
    FROM terms;
  `;

  // Use selectSingle because we know it will always return exactly one row.
  const stats = await dbClient.selectSingle(sql, [], DashboardStatsSchema);

  return {
    totalTerms: stats.totalTerms ?? 0,
    publishedTerms: stats.publishedTerms ?? 0,
    pendingTerms: stats.pendingTerms ?? 0,
  };
};
