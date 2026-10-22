"use server";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findCollectionOptions, findCollections } from "@root/dal/collections-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { CollectionFormSchema } from "./collection.schema";
import { CollectionFormState, CollectionFormValues } from "./collection.types";

const collectionParser = createActionParser({ booleanFields: ["isActive"] });

const collectionSaveHandler = async (data: CollectionFormValues): Promise<CollectionFormState> => {
  const { collectionId, isActive, displayOrder, translations } = data;
  let currentId = collectionId;

  const nameJson: Record<string, string> = {};
  for (const locale of i18nAppConfig.locales) {
    const name = translations?.[locale]?.name;
    if (name) nameJson[locale] = name;
  }

  await dbClient.executeTransaction(async (trx) => {
    const payload = { isActive, displayOrder, name: JSON.stringify(nameJson) };
    if (currentId) {
      await trx.update("collections", payload, { collectionId: currentId });
    } else {
      const result = await trx.insert("collections", payload);
      currentId = result.insertId;
    }
    if (!currentId) throw new Error("Failed to get collection ID.");
  });

  revalidatePath("/dashboard/collections", "layout");
  revalidatePath("/", "layout");
  const messageKey = collectionId ? "updateSuccess" : "createSuccess";
  redirect(`/dashboard/collections?toast=${messageKey}&entity=collections`);
};

export const collectionSaveAction = createProtectedAction(CollectionFormSchema, collectionSaveHandler, collectionParser);
export const collectionDeleteAction = createDeleteAction({ tableName: "collections", pkColumn: "collectionId", revalidatePaths: ["/dashboard/collections", "/"] });
export const collectionBulkDeleteAction = createBulkDeleteAction({ tableName: "collections", pkColumn: "collectionId", revalidatePaths: ["/dashboard/collections", "/"] });

export async function getCollectionsAction(props: Parameters<typeof findCollections>[0]) {
  return findCollections(props);
}

export async function getCollectionOptionsAction(locale: AppLocale) {
  return findCollectionOptions(locale);
}
