"use server";

import { getDashboardStats } from "@root/dal/stats-dx";

/**
 * Action to get the main dashboard statistics.
 */
export async function getDashboardStatsAction() {
  return getDashboardStats();
}
