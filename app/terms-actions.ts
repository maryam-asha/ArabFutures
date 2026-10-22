"use server";

import { AppLocale } from "@i18n/config";
import { auth } from "@lib/auth";
import { TermForEditDb } from "@root/dal/dal.types";
import { findTermById } from "@root/dal/terms-dx";

/** Statuses a visitor is allowed to see on the public site. Drafts (`pending`) and `rejected` terms stay internal. */
const PUBLIC_TERM_STATUSES: ReadonlySet<TermForEditDb["status"]> = new Set(["published", "has-pending-review"]);

/**
 * Public term fetch, used by the visitor-facing term dialog. Only returns terms that are publicly
 * visible; pending/rejected terms resolve to `null` so unauthenticated callers cannot read drafts.
 */
export async function getTermDetailsAction(locale: AppLocale, termId: number): Promise<TermForEditDb | null> {
  try {
    const term = await findTermById({ termId, locale });

    if (!term || !PUBLIC_TERM_STATUSES.has(term.status)) return null;

    return term;
  } catch (error) {
    console.error("Failed to fetch term details:", error);
    return null;
  }
}

/**
 * Admin term fetch for the dashboard editor. Returns a term in any status, but only to an
 * authenticated session — server actions are independently callable, so the auth check lives here,
 * not only in the dashboard layout.
 */
export async function getTermForEditAction(locale: AppLocale, termId: number): Promise<TermForEditDb | null> {
  const session = await auth.getSession();
  if (!session) return null;

  try {
    const term = await findTermById({ termId, locale });
    return term ?? null;
  } catch (error) {
    console.error("Failed to fetch term details:", error);
    return null;
  }
}
