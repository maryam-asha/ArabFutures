"use server";

import { BulkDeleteSchema } from "@app/dashboard/schemas";
import { BulkDeleteData, BulkDeleteState } from "@app/dashboard/types";
import { createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";

export const deleteTagAction = createDeleteAction({
  tableName: "tags",
  pkColumn: "tagId",
  revalidatePaths: ["/dashboard/tags"],
});

const tagsBulkDeleteHandler = async (data: BulkDeleteData): Promise<BulkDeleteState> => {
  await dbClient.delete("tags", { tagId: { in: data.ids } });
  revalidatePath("/dashboard/tags", "layout");
  return { success: true, message: "Selected categories deleted successfully." };
};

export const tagsBulkDeleteAction = createProtectedAction(BulkDeleteSchema, tagsBulkDeleteHandler, (formData) => {
  return {
    ids: JSON.parse(formData.get("ids") as string),
  };
});
