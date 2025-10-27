"use server";

import { BulkDeleteSchema } from "@app/dashboard/schemas";
import { BulkDeleteData, BulkDeleteState } from "@app/dashboard/types";
import { createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";

export const termCategoryDeleteAction = createDeleteAction({
  tableName: "termCategories",
  pkColumn: "categoryId",
  revalidatePaths: ["/dashboard/term-categories"],
});

const categoriesBulkDeleteHandler = async (data: BulkDeleteData): Promise<BulkDeleteState> => {
  await dbClient.delete("termCategories", { categoryId: { in: data.ids } });
  revalidatePath("/dashboard/term-categories", "layout");
  return { success: true, message: "Selected categories deleted successfully." };
};

export const categoriesBulkDeleteAction = createProtectedAction(BulkDeleteSchema, categoriesBulkDeleteHandler, (formData) => {
  return {
    ids: JSON.parse(formData.get("ids") as string),
  };
});
