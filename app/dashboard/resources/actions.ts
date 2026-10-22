"use server";

import { type ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findResources } from "@root/dal/resources-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ResourceFormSchema } from "./resource.schema";
import { ResourceFormState, ResourceFormValues } from "./resource.types";

const resourceActionParser = createActionParser({
  booleanFields: ["isActive"],
  jsonFields: ["content", "tagIds", "collectionIds"],
});

const resourceSaveHandler: ActionHandler<ResourceFormValues> = async (data): Promise<ResourceFormState> => {
  const { resourceId, type, categoryRef, language, isActive, displayOrder, content, tagIds, collectionIds } = data;

  const payload = {
    type,
    categoryRef: categoryRef ?? null,
    language: language || null,
    isActive,
    displayOrder,
    content: JSON.stringify(content),
  };

  await dbClient.executeTransaction(async (trx) => {
    let currentId = resourceId;

    if (currentId) {
      await trx.update("resources", payload, { resourceId: currentId });
    } else {
      const result = await trx.insert("resources", payload);
      currentId = result.insertId;
      if (!currentId) throw new Error("Failed to create the resource and get an ID.");
    }

    await trx.delete("resourceTags", { resourceId: currentId });
    if (tagIds && tagIds.length > 0) {
      await trx.insertMany(
        "resourceTags",
        tagIds.map((tagId) => ({ resourceId: currentId, tagId })),
      );
    }

    await trx.delete("resourceCollections", { resourceId: currentId });
    if (collectionIds && collectionIds.length > 0) {
      await trx.insertMany(
        "resourceCollections",
        collectionIds.map((collectionId) => ({ resourceId: currentId, collectionId })),
      );
    }
  });

  revalidatePath("/dashboard/resources", "layout");
  revalidatePath("/", "layout");

  const messageKey = resourceId ? "updateSuccess" : "createSuccess";
  redirect(`/dashboard/resources?toast=${messageKey}&entity=resources`);
};

export const resourceSaveAction = createProtectedAction(ResourceFormSchema, resourceSaveHandler, resourceActionParser);
export const resourceDeleteAction = createDeleteAction({ tableName: "resources", pkColumn: "resourceId", revalidatePaths: ["/dashboard/resources", "/"] });
export const resourceBulkDeleteAction = createBulkDeleteAction({ tableName: "resources", pkColumn: "resourceId", revalidatePaths: ["/dashboard/resources", "/"] });

export async function getResourcesAction(props: Parameters<typeof findResources>[0]) {
  return findResources(props);
}
