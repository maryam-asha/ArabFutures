"use server";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { TranslatableTermTitleSchema } from "@root/dal/dal.schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

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

  // Prepare the JSON structures
  const titleJson: z.infer<typeof TranslatableTermTitleSchema> = { en: undefined, ar: undefined };
  const briefDescriptionJson: Record<string, string> = {};
  const fullDetailJson: Record<string, string> = {};

  for (const locale of i18nAppConfig.locales) {
    const trans = translations?.[locale as AppLocale];
    if (trans) {
      // Handle the complex title structure with references
      if (trans.title) {
        titleJson[locale as AppLocale] = [
          {
            value: trans.title,
            references: (trans.references || []).filter((ref) => ref.content || ref.url),
          },
        ];
      }
      // Handle simple text fields
      if (trans.briefDescription) {
        briefDescriptionJson[locale as AppLocale] = trans.briefDescription;
      }
      if (trans.fullDetail) {
        fullDetailJson[locale as AppLocale] = trans.fullDetail;
      }
    }
  }

  await dbClient.executeTransaction(async (trx) => {
    const termData = {
      status,
      isFeatured,
      categoryRef,
      // Stringify all JSON objects before saving
      title: JSON.stringify(titleJson),
      briefDescription: JSON.stringify(briefDescriptionJson),
      fullDetail: JSON.stringify(fullDetailJson),
    };

    if (currentTermId) {
      await trx.update("terms", termData, { termId: currentTermId });
    } else {
      const result = await trx.insert("terms", termData);
      currentTermId = result.insertId;
    }

    if (!currentTermId) {
      throw new Error("Failed to create or find term ID.");
    }

    // This logic for tags is correct and can remain as is
    await trx.delete("termTags", { termId: currentTermId });
    if (tags && tags.length > 0) {
      const finalTermId = currentTermId;
      const values = tags.map((tagId) => ({ termId: finalTermId, tagId }));
      await trx.insertMany("termTags", values);
    }
  });

  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/tags", "layout");
  revalidatePath("/dashboard/term-categories", "layout");
  revalidatePath("/dashboard/approvals", "layout");

  redirect(`/dashboard/terms`);
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

const bulkActionParser = createActionParser({ jsonFields: ["ids"] });

export const termSaveAction = createProtectedAction(TermFormSchema, termSaveHandler, termActionParser);
export const termUpdateStatusAction = createProtectedAction(singleUpdateSchema, termUpdateStatusHandler, createActionParser());
export const termsBulkUpdateAction = createProtectedAction(TermsBulkUpdateSchema, termsBulkUpdateHandler, bulkActionParser);
export const termDeleteAction = createDeleteAction({ tableName: "terms", pkColumn: "termId", revalidatePaths: ["/dashboard/terms", "/dashboard/tags", "/dashboard/term-categories"] });
export const termBulkDeleteAction = createBulkDeleteAction({ tableName: "terms", pkColumn: "termId", revalidatePaths: ["/dashboard/terms", "/dashboard/tags", "/dashboard/term-categories"] });
