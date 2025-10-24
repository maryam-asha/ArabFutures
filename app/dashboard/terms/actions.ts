"use server";

import { createDeleteAction, createFormDataParser, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import i18nAppConfig from "@root/i18n/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { TermFormSchema } from "./term.schema";
import { TermForm, TermFormState } from "./term.types";

// Our parser needs to handle the array of tag IDs
const parseTermFormData = createFormDataParser({
  booleanFields: ["isFeatured"],
  jsonFields: ["tags"],
});

const saveTermHandler = async (data: TermForm): Promise<TermFormState> => {
  console.log("=====================================");
  console.log(data);

  console.log("=====================================");

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

    // Handle Translations
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
    }

    // Handle Many-to-Many Tags Relationship
    // 1. Delete all existing tag associations for this term
    await trx.delete("termTags", { termId: currentTermId });

    // 2. Insert the new tag associations
    if (tags && tags.length > 0) {
      const values = tags.map((tagId) => [currentTermId, tagId]);
      tags.forEach(async (tag) => {
        //TODO: fix the insert to bulk
        if (currentTermId) await trx.insert("termTags", { termId: currentTermId, tagId: tag.tagId });
      });
    }
  });

  revalidatePath("/dashboard/terms", "layout");
  revalidatePath("/dashboard/tags", "layout"); // Revalidate tags to update counts
  revalidatePath("/dashboard/term-categories", "layout"); // Revalidate categories to update counts

  if (!termId) {
    redirect(`/dashboard/terms`);
  }

  return {
    success: true,
    message: `Term successfully ${termId ? "updated" : "created"}.`,
  };
};

export const saveTermAction = createProtectedAction(TermFormSchema, saveTermHandler, parseTermFormData);

export const deleteTermAction = createDeleteAction({
  tableName: "terms",
  pkColumn: "termId",
  revalidatePaths: ["/dashboard/terms", "/dashboard/tags", "/dashboard/term-categories"],
});
