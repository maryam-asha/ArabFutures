"use server";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findActiveCategoryOptions, findTermCategories } from "@root/dal/termCategories-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CategoryFormSchema } from "./category.schema";
import { CategoryFormState, CategoryFormValues } from "./category.types";

const termCategoryParser = createActionParser({
  booleanFields: ["isActive"],
});

const termCategorySaveHandler = async (data: CategoryFormValues): Promise<CategoryFormState> => {
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

  revalidatePath("/dashboard/term-categories", "layout");
  const messageKey = data.categoryId ? "updateSuccess" : "createSuccess";
  redirect(`/dashboard/term-categories?toast=${messageKey}&entity=term-categories`);
};

export const termCategorySaveAction = createProtectedAction(CategoryFormSchema, termCategorySaveHandler, termCategoryParser);
export const termCategoryDeleteAction = createDeleteAction({
  tableName: "termCategories",
  pkColumn: "categoryId",
  revalidatePaths: ["/dashboard/categories"],
});
export const termCategoryBulkDeleteAction = createBulkDeleteAction({ tableName: "termCategories", pkColumn: "categoryId", revalidatePaths: ["/dashboard/categories"] });

export async function getTermCategoriesAction(props: Parameters<typeof findTermCategories>[0]) {
  return findTermCategories(props);
}

export async function getActiveCategoryOptionsAction(locale: AppLocale) {
  return findActiveCategoryOptions(locale);
}
