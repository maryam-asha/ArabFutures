"use server";

import i18nAppConfig from "@i18n/config";
import { ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { bulkActionParser } from "../action";
import { singleUpdateSchema } from "../schemas";
import { SingleUpdateData } from "../types";
import { TermFormSchema, TermsBulkUpdateSchema } from "./term.schema";
import { TermForm, TermFormState, TermsBulkUpdateData } from "./term.types";

const termActionParser = createActionParser({
  booleanFields: ["isFeatured"],
});

const termSaveHandler = async (data: TermForm): Promise<TermFormState> => {
  const { termId, status, isFeatured, categoryRef, tags, translations } = data;
  let currentTermId = termId;

  await dbClient.executeTransaction(async (trx) => {
    const termData = { status, isFeatured, categoryRef };
    if (currentTermId) {
      await trx.update("terms", termData, { termId: currentTermId });
    } else {
      const result = await trx.insert("terms", termData);
      currentTermId = result.insertId;
    }

    if (!currentTermId) throw new Error("Failed to get term ID.");

    // Handle Translations and References
    for (const locale of i18nAppConfig.locales) {
      const trans = translations?.[locale];
      if (trans?.title) {
        await trx.modify(
          `INSERT INTO termTranslations (termRef, locale, title, briefDescription, fullDetail)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE title = VALUES(title), briefDescription = VALUES(briefDescription), fullDetail = VALUES(fullDetail);`,
          [currentTermId, locale, trans.title, trans.briefDescription || null, trans.fullDetail || null],
        );
      }

      // Handle References: Delete all for the term/locale and re-insert
      await trx.delete("termReferences", { termRef: currentTermId, locale });

      const references = trans?.references;
      if (references && references.length > 0) {
        for (const ref of references) {
          // Only insert if content is not empty
          if (ref.content) {
            await trx.insert("termReferences", {
              termRef: currentTermId,
              locale,
              content: ref.content,
              url: ref.url || null,
            });
          }
        }
      }
    }

    // Handle Many-to-Many Tags Relationship
    // 1. Delete all existing tag associations for this term
    await trx.delete("termTags", { termId: currentTermId });

    // 2. Insert the new tag associations if any exist
    if (currentTermId && tags && tags.length > 0) {
      const values = tags.map((tagId) => [currentTermId, tagId]);
      // Use a more efficient bulk insert query
      await trx.insertMany("termTags", values as any);
      //await trx.modify("INSERT INTO termTags (termId, tagId) VALUES ?", [values]);
    }
  });

  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/tags", "layout");
  revalidatePath("/dashboard/term-categories", "layout");
  revalidatePath("/dashboard/approvals", "layout");

  redirect(`/dashboard/terms`);

  return {
    success: true,
    message: `Term successfully ${termId ? "updated" : "created"}.`,
  };
};

const actionPayloadMap = {
  approve: { status: "published" },
  pend: { status: "pending" },
  feature: { isFeatured: true },
  unfeature: { isFeatured: false },
};

const termsBulkUpdateHandler: ActionHandler<TermsBulkUpdateData> = async (data) => {
  const { ids, actionType } = data;
  await dbClient.update("terms", actionPayloadMap[actionType], { termId: { in: ids } });
  revalidatePath("/dashboard/terms", "layout");
  return { success: true, message: "Terms updated successfully." };
};

const termUpdateStatusHandler: ActionHandler<SingleUpdateData> = async (data) => {
  const { id, actionType } = data;
  await dbClient.update("terms", actionPayloadMap[actionType], { termId: id });
  revalidatePath("/dashboard/terms", "layout");
  return { success: true, message: "Term updated successfully." };
};

// export ==========================
export const termSaveAction = createProtectedAction(TermFormSchema, termSaveHandler, termActionParser);
export const termUpdateStatusAction = createProtectedAction(singleUpdateSchema, termUpdateStatusHandler, createActionParser());
export const termsBulkUpdateAction = createProtectedAction(TermsBulkUpdateSchema, termsBulkUpdateHandler, bulkActionParser);

export const termDeleteAction = createDeleteAction({
  tableName: "terms",
  pkColumn: "termId",
  revalidatePaths: ["/dashboard/terms", "/dashboard/tags", "/dashboard/term-categories"],
});

export const termBulkDeleteAction = createBulkDeleteAction({ tableName: "terms", pkColumn: "termId", revalidatePaths: ["/dashboard/terms", "/dashboard/tags", "/dashboard/term-categories"] });
