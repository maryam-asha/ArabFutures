"use server";

import { type ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { TermFormSchema, TermsBulkUpdateSchema } from "./term.schema";
import { TermForm, TermFormState, TermsBulkUpdateData } from "./term.types";

// The parser now only needs to handle `isFeatured` and `tags` (if sent as JSON)
const termActionParser = createActionParser({
  booleanFields: ["isFeatured"],
  jsonFields: ["tags"],
});

/**
 * Handler to create or update a term.
 * Constructs the new 'content' JSON object from form data.
 */
const termSaveHandler: ActionHandler<TermForm> = async (data): Promise<TermFormState> => {
  const { termId, categoryRef, status, isFeatured, tags, content } = data;

  const termPayload = {
    categoryRef,
    status,
    isFeatured,
    content: JSON.stringify(content), // The entire content object is stringified
  };

  await dbClient.executeTransaction(async (trx) => {
    let currentTermId = termId;

    if (currentTermId) {
      // Update existing term
      await trx.update("terms", termPayload, { termId: currentTermId });
    } else {
      // Insert new term and get its ID
      const result = await trx.insert("terms", termPayload);
      currentTermId = result.insertId;
      if (!currentTermId) throw new Error("Failed to create term.");
    }

    // Handle tags (unchanged logic)
    await trx.delete("termTags", { termId: currentTermId });
    if (tags && tags.length > 0) {
      const tagValues = tags.map((tagId) => ({ termId: currentTermId, tagId }));
      await trx.insertMany("termTags", tagValues);
    }
  });

  // Revalidate all relevant pages
  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/approvals", "layout");
  revalidatePath("/dashboard/reviews", "layout");
  revalidatePath("/", "layout"); // Revalidate public pages

  redirect(`/dashboard/terms`);
};

/**
 * Handler for bulk-updating term statuses or featured status.
 */
const termsBulkUpdateHandler: ActionHandler<TermsBulkUpdateData> = async (data) => {
  const { ids, actionType } = data;

  const actionPayloadMap = {
    approve: { status: "published" },
    pend: { status: "pending" },
    reject: { status: "rejected" },
    feature: { isFeatured: true },
    unfeature: { isFeatured: false },
  };

  const payload = actionPayloadMap[actionType];

  await dbClient.update("terms", payload, { termId: { in: ids } });
  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/approvals", "layout");

  return { success: true, message: "Terms updated successfully." };
};

// EXPORTED ACTIONS
export const termSaveAction = createProtectedAction(TermFormSchema, termSaveHandler, termActionParser);
export const termsBulkUpdateAction = createProtectedAction(TermsBulkUpdateSchema, termsBulkUpdateHandler, createActionParser({ jsonFields: ["ids"] }));
export const termDeleteAction = createDeleteAction({ tableName: "terms", pkColumn: "termId", revalidatePaths: ["/dashboard/terms"] });
export const termBulkDeleteAction = createBulkDeleteAction({ tableName: "terms", pkColumn: "termId", revalidatePaths: ["/dashboard/terms"] });
