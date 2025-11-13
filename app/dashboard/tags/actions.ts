"use server";

import { createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import i18nAppConfig from "@root/i18n/config";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { TagFormSchema } from "./tag.schema";
import { TagFormState, TagFormValues } from "./tag.types";

const tagActionParser = createActionParser();

const tagSaveHandler = async (data: TagFormValues): Promise<TagFormState> => {
  const { tagId, translations } = data;
  let currentTagId = tagId;

  const nameJson: Record<string, string> = {};
  for (const locale of i18nAppConfig.locales) {
    const name = translations?.[locale]?.name;
    if (name) {
      nameJson[locale] = name;
    }
  }

  await dbClient.executeTransaction(async (trx) => {
    const tagData = {
      name: JSON.stringify(nameJson),
    };

    if (currentTagId) {
      await trx.update("tags", tagData, { tagId: currentTagId });
    } else {
      const result = await trx.insert("tags", tagData);
      currentTagId = result.insertId;
    }

    if (!currentTagId) throw new Error("Failed to get tag ID.");
  });

  revalidatePath("/dashboard/tags", "layout");
  redirect(`/dashboard/tags`);

  return {
    success: true,
    message: `Tag successfully ${tagId ? "updated" : "created"}.`,
  };
};

export const tagSaveAction = createProtectedAction(TagFormSchema, tagSaveHandler, tagActionParser);

export const tagDeleteAction = createDeleteAction({
  tableName: "tags",
  pkColumn: "tagId",
  revalidatePaths: ["/dashboard/terms", "/dashboard/tags"],
});

export const tagBulkDeleteAction = createBulkDeleteAction({ tableName: "tags", pkColumn: "tagId", revalidatePaths: ["/dashboard/tags", "layout"] });
