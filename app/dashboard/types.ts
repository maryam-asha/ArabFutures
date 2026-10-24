import { ActionState } from "@root/types";
import z from "zod";

import { BulkDeleteSchema, BulkUpdateSchema, singleUpdateSchema } from "./schemas";

export type DeleteActionParams = {
  tableName: "termCategories" | "tags" | "terms" | "members" | "resources" | "collections" | "blogPosts";
  pkColumn: "categoryId" | "tagId" | "termId" | "memberId" | "resourceId" | "collectionId" | "postId";
  revalidatePaths: string[];
};

export type SingleUpdateData = z.infer<typeof singleUpdateSchema>;
export type BulkUpdateData = z.infer<typeof BulkUpdateSchema>;
export type BulkDeleteData = z.infer<typeof BulkDeleteSchema>;
export type BulkDeleteState = ActionState<BulkDeleteData>;
