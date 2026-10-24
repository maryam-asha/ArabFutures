"use server";

import { type ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { findBlogPosts } from "@root/dal/blog-dx";
import { dbClient } from "@root/dal/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { BlogPostFormSchema } from "./post.schema";
import { BlogPostFormState, BlogPostFormValues } from "./post.types";

const blogPostActionParser = createActionParser({
  booleanFields: ["isActive", "isFeatured"],
  jsonFields: ["content", "tagIds"],
});

const blogPostSaveHandler: ActionHandler<BlogPostFormValues> = async (data): Promise<BlogPostFormState> => {
  const { postId, slug, categoryRef, isActive, isFeatured, displayOrder, content, tagIds } = data;

  const payload = {
    slug,
    categoryRef: categoryRef ?? null,
    isActive,
    isFeatured,
    displayOrder,
    content: JSON.stringify(content),
  };

  await dbClient.executeTransaction(async (trx) => {
    let currentId = postId;

    if (currentId) {
      await trx.update("blogPosts", payload, { postId: currentId });
    } else {
      const result = await trx.insert("blogPosts", payload);
      currentId = result.insertId;
      if (!currentId) throw new Error("Failed to create the post and get an ID.");
    }

    await trx.delete("blogPostTags", { postId: currentId });
    if (tagIds && tagIds.length > 0) {
      await trx.insertMany(
        "blogPostTags",
        tagIds.map((tagId) => ({ postId: currentId, tagId })),
      );
    }
  });

  revalidatePath("/dashboard/blog", "layout");
  revalidatePath("/", "layout");

  const messageKey = postId ? "updateSuccess" : "createSuccess";
  redirect(`/dashboard/blog?toast=${messageKey}&entity=blog`);
};

export const blogPostSaveAction = createProtectedAction(BlogPostFormSchema, blogPostSaveHandler, blogPostActionParser);
export const blogPostDeleteAction = createDeleteAction({ tableName: "blogPosts", pkColumn: "postId", revalidatePaths: ["/dashboard/blog", "/"] });
export const blogPostBulkDeleteAction = createBulkDeleteAction({ tableName: "blogPosts", pkColumn: "postId", revalidatePaths: ["/dashboard/blog", "/"] });

export async function getBlogPostsAction(props: Parameters<typeof findBlogPosts>[0]) {
  return findBlogPosts(props);
}
