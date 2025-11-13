"use server";

import { AppLocale } from "@i18n/config";
import { TermForEditDb } from "@root/dal/dal.types";
import { findTermById } from "@root/dal/terms-dx";

export async function getTermDetailsAction(locale: AppLocale, termId: number): Promise<TermForEditDb | null> {
  try {
    const term = await findTermById({ termId, locale });

    if (!term) return null;

    return term;
  } catch (error) {
    console.error("Failed to fetch term details:", error);
    return null;
  }
}
