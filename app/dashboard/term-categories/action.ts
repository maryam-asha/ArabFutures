"use server";

import i18nAppConfig from "@i18n/config";
import { createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CategoryFormSchema } from "./category.schema";
import { CategoryForm, CategoryFormState } from "./category.types";

const termCategoryParser = createActionParser({
  booleanFields: ["isActive"],
});

const termCategorySaveHandler = async (data: CategoryForm): Promise<CategoryFormState> => {
  const { categoryId, isActive, translations } = data;
  let currentCategoryId = categoryId;

  const nameJson: Record<string, string> = {};
  for (const locale of i18nAppConfig.locales) {
    const name = translations?.[locale]?.name;
    if (name) {
      nameJson[locale] = name;
    }
  }

  await dbClient.executeTransaction(async (trx) => {
    const categoryData = {
      isActive,
      name: JSON.stringify(nameJson),
    };

    if (currentCategoryId) {
      await trx.update("termCategories", categoryData, { categoryId: currentCategoryId });
    } else {
      const result = await trx.insert("termCategories", categoryData);
      currentCategoryId = result.insertId;
    }

    if (!currentCategoryId) throw new Error("Failed to get category ID.");
  });

  revalidatePath("/dashboard/term-categories", "layout");
  redirect(`/dashboard/term-categories`);

  return {
    success: true,
    message: `Category successfully ${categoryId ? "updated" : "created"}.`,
  };
};

export const termCategorySaveAction = createProtectedAction(CategoryFormSchema, termCategorySaveHandler, termCategoryParser);

export const termCategoryDeleteAction = createDeleteAction({
  tableName: "termCategories",
  pkColumn: "categoryId",
  revalidatePaths: ["/dashboard/categories"],
});

export const termCategoryBulkDeleteAction = createBulkDeleteAction({ tableName: "termCategories", pkColumn: "categoryId", revalidatePaths: ["/dashboard/categories"] });
