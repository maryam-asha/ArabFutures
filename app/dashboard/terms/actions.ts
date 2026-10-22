"use server";

import { AppLocale } from "@i18n/config";
import { type ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findRecentTerms, findTerms } from "@root/dal/terms-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { TermFormSchema, TermsBulkUpdateActionSchema } from "./term.schema";
import { TermFormState, TermFormValues, TermsBulkUpdateActionInput } from "./term.types";

const termActionParser = createActionParser({
  booleanFields: ["isFeatured"],
  jsonFields: ["tagIds", "reviewIds"],
});

const termSaveHandler: ActionHandler<TermFormValues> = async (data): Promise<TermFormState> => {
  const { termId, categoryRef, status, isFeatured, tagIds, content, reviewIds, source } = data;

  const termPayload = {
    categoryRef,
    status,
    isFeatured,
    content: JSON.stringify(content),
  };

  await dbClient.executeTransaction(async (trx) => {
    let currentTermId = termId;

    if (currentTermId) {
      await trx.update("terms", termPayload, { termId: currentTermId });
    } else {
      const result = await trx.insert("terms", termPayload);
      currentTermId = result.insertId;
      if (!currentTermId) {
        throw new Error("Failed to create the term and get an ID.");
      }
    }

    await trx.delete("termTags", { termId: currentTermId });

    if (tagIds && tagIds.length > 0) {
      const tagValues = tagIds.map((tagId) => ({ termId: currentTermId, tagId }));
      await trx.insertMany("termTags", tagValues);
    }

    if (reviewIds && reviewIds.length > 0) {
      await trx.update("termReviews", { status: "approved", resolvedAt: new Date() }, { reviewId: { in: reviewIds } });
      const otherPendingReviews = await trx.selectSingle("SELECT COUNT(reviewId) as count FROM termReviews WHERE termRef = ? AND status = 'pending' AND reviewId in (?)", [currentTermId, reviewIds], z.object({ count: z.number() }));

      if (otherPendingReviews.count === 0) {
        const term = await trx.selectSingle("SELECT status FROM terms WHERE termId = ?", [currentTermId], z.object({ status: z.string() }));
        if (term?.status === "has-pending-review") {
          await trx.update("terms", { status: "published" }, { termId: currentTermId });
        }
      }
    }
  });

  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/approvals", "layout");
  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/", "layout");

  const destination = source === "reviews" ? "/dashboard/reviews" : source === "approvals" ? "dashboard/approvals" : "/dashboard/terms";
  const messageKey = data.termId ? "updateSuccess" : "createSuccess";

  redirect(`${destination}?toast=${messageKey}&entity=terms`);
};

const termsBulkUpdateHandler: ActionHandler<TermsBulkUpdateActionInput> = async (data) => {
  const { ids, actionType } = data;

  if (!ids || ids.length === 0) {
    return { success: true, message: "Common.noItemsSelected" };
  }

  const actionPayloadMap = {
    approve: { status: "published" as const },
    pend: { status: "pending" as const },
    reject: { status: "rejected" as const },
    feature: { isFeatured: true },
    unfeature: { isFeatured: false },
  };

  const payload = actionPayloadMap[actionType];

  await dbClient.update("terms", payload, { termId: { in: ids } });

  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/approvals", "layout");

  return { success: true, message: "Common.updateSuccess" };
};

export const termSaveAction = createProtectedAction(TermFormSchema, termSaveHandler, termActionParser);
export const termsBulkUpdateAction = createProtectedAction(TermsBulkUpdateActionSchema, termsBulkUpdateHandler, createActionParser({ jsonFields: ["ids"] }));
export const termDeleteAction = createDeleteAction({
  tableName: "terms",
  pkColumn: "termId",
  revalidatePaths: ["/dashboard/terms"],
});
export const termBulkDeleteAction = createBulkDeleteAction({
  tableName: "terms",
  pkColumn: "termId",
  revalidatePaths: ["/dashboard/terms"],
});

export async function getTermsAction(props: Parameters<typeof findTerms>[0]) {
  return findTerms(props);
}

export async function getRecentTermsAction(locale: AppLocale, limit: number = 5) {
  return findRecentTerms(locale, limit);
}
