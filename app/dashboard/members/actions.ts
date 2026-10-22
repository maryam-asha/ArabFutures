"use server";

import { type ActionHandler, createActionParser, createBulkDeleteAction, createDeleteAction, createProtectedAction } from "@lib/action-handler";
import { dbClient } from "@root/dal/client";
import { findMembers } from "@root/dal/members-dx";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { MemberFormSchema } from "./member.schema";
import { MemberFormState, MemberFormValues } from "./member.types";

const memberActionParser = createActionParser({
  booleanFields: ["isActive", "isFeatured"],
  jsonFields: ["content"],
});

const memberSaveHandler: ActionHandler<MemberFormValues> = async (data): Promise<MemberFormState> => {
  const { memberId, slug, displayOrder, isActive, isFeatured, content } = data;

  const payload = {
    slug,
    displayOrder,
    isActive,
    isFeatured,
    content: JSON.stringify(content),
  };

  await dbClient.executeTransaction(async (trx) => {
    if (memberId) {
      await trx.update("members", payload, { memberId });
    } else {
      await trx.insert("members", payload);
    }
  });

  revalidatePath("/dashboard/members", "layout");
  revalidatePath("/", "layout");

  const messageKey = memberId ? "updateSuccess" : "createSuccess";
  redirect(`/dashboard/members?toast=${messageKey}&entity=members`);
};

export const memberSaveAction = createProtectedAction(MemberFormSchema, memberSaveHandler, memberActionParser);

export const memberDeleteAction = createDeleteAction({
  tableName: "members",
  pkColumn: "memberId",
  revalidatePaths: ["/dashboard/members", "/"],
});

export const memberBulkDeleteAction = createBulkDeleteAction({
  tableName: "members",
  pkColumn: "memberId",
  revalidatePaths: ["/dashboard/members", "/"],
});

export async function getMembersAction(props: Parameters<typeof findMembers>[0]) {
  return findMembers(props);
}
