"use server";

import { createDeleteAction, createFormDataParser, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import i18nAppConfig from "@root/i18n/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { DeleteManyTagsSchema, TagFormSchema } from "./tag.schema";
import { DeleteManyTagsData, DeleteManyTagsState, TagForm, TagFormState } from "./tag.types";

const saveTagHandler = async (data: TagForm): Promise<TagFormState> => {
  const { tagId, translations } = data;
  let currentTagId = tagId;

  await dbClient.executeTransaction(async (trx) => {
    if (currentTagId) {
      // Tags table has no other columns to update, so we just ensure the record exists.
    } else {
      const result = await trx.modify("INSERT INTO tags () VALUES ();", []);
      currentTagId = result.insertId;
    }

    if (!currentTagId) throw new Error("Failed to get tag ID.");

    for (const locale of i18nAppConfig.locales) {
      const name = translations?.[locale]?.name;
      if (name) {
        await trx.modify(
          `INSERT INTO tagTranslations (tagRef, locale, name) VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE name = VALUES(name);`,
          [currentTagId, locale, name],
        );
      }
    }
  });

  revalidatePath("/dashboard/tags", "layout");

  redirect(`/dashboard/tags`);

  return {
    success: true,
    message: `Tag successfully ${tagId ? "updated" : "created"}.`,
  };
};

export const saveTagAction = createProtectedAction(
  TagFormSchema,
  saveTagHandler,
  createFormDataParser({}), // No boolean fields needed
);

export const deleteTagAction = createDeleteAction({
  tableName: "tags",
  pkColumn: "tagId",
  revalidatePaths: ["/dashboard/tags"],
});

const deleteManyTagsHandler = async (data: DeleteManyTagsData): Promise<DeleteManyTagsState> => {
  await dbClient.delete("tags", { tagId: { in: data.ids } });
  revalidatePath("/dashboard/tags", "layout");
  return { success: true, message: "Selected tags deleted successfully." };
};

export const deleteManyTagsAction = createProtectedAction(DeleteManyTagsSchema, deleteManyTagsHandler, async (formData) => {
  return {
    ids: JSON.parse(formData.get("ids") as string),
  };
});
