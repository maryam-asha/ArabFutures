import { getCsrfTokenAction } from "@app/auth-actions";
import { BulkDeleteSchema } from "@app/dashboard/schemas";
import { BulkDeleteData, DeleteActionParams } from "@app/dashboard/types";
import { dbClient } from "@root/dal/client";
import { ActionState } from "@root/types";
import { NotAuthenticatedError } from "@waelhabbaldev/next-jwt-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "./auth";

export type ServerAction<TInput> = (prevState: ActionState<TInput>, formData: FormData) => Promise<ActionState<TInput>>;

export type ActionHandler<TInput> = (data: TInput) => Promise<ActionState<TInput>>;

export function createActionParser(
  config: {
    booleanFields?: string[];
    jsonFields?: string[];
  } = {},
) {
  const { booleanFields = [], jsonFields = [] } = config;

  return (formData: FormData): Record<string, any> => {
    const object: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (key === "csrf_token") return;

      if (jsonFields.includes(key)) {
        try {
          if (!value || value === "") {
            object[key] = undefined;
          } else {
            object[key] = JSON.parse(value as string);
          }
        } catch {
          object[key] = undefined;
        }
        return;
      }

      if (booleanFields.includes(key)) return;

      const keys = key.match(/[^.[\]]+/g) || [];
      keys.reduce((acc, currentKey, index) => {
        if (index === keys.length - 1) {
          acc[currentKey] = value;
        } else {
          const nextKey = keys[index + 1];
          if (!acc[currentKey]) {
            acc[currentKey] = /^\d+$/.test(nextKey) ? [] : {};
          }
        }
        return acc[currentKey];
      }, object);
    });

    booleanFields.forEach((key) => {
      object[key] = formData.get(key) === "on";
    });

    return object;
  };
}

export function createPublicAction<TInput>(schema: z.ZodSchema<TInput>, handler: ActionHandler<TInput>, parser: (formData: FormData) => Record<string, any>): ServerAction<TInput> {
  return async function publicAction(prevState: ActionState<TInput>, formData: FormData): Promise<ActionState<TInput>> {
    try {
      const newCsrfToken = await getCsrfTokenAction();

      const dataToParse = parser(formData);
      const parsed = schema.safeParse(dataToParse);

      if (!parsed.success) {
        return {
          newCsrfToken: newCsrfToken,
          success: false,
          message: "Validation.validationFailed",
          errors: z.treeifyError(parsed.error),
        };
      }

      const result = await handler(parsed.data);
      result.newCsrfToken = newCsrfToken;
      return result;
    } catch (e) {
      if (isRedirectError(e)) throw e;

      console.error("Server Action Error:", e);

      try {
        const newCsrfToken = await getCsrfTokenAction();
        return {
          success: false,
          message: "Common.unexpectedError",
          errors: {} as any,
          newCsrfToken: newCsrfToken,
        };
      } catch (csrfError) {
        console.error("Failed to get new CSRF token during error handling:", csrfError);
        return {
          success: false,
          message: "Common.unexpectedError",
          errors: {} as any,
        };
      }
    }
  };
}

export function createProtectedAction<TInput>(schema: z.ZodSchema<TInput>, handler: ActionHandler<TInput>, parser: (formData: FormData) => Record<string, any>): ServerAction<TInput> {
  return async function protectedAction(prevState: ActionState<TInput>, formData: FormData): Promise<ActionState<TInput>> {
    try {
      await auth.protectAction(undefined, formData);
      const newCsrfToken = await getCsrfTokenAction();

      const dataToParse = parser(formData);
      const parsed = schema.safeParse(dataToParse);

      if (!parsed.success) {
        return {
          newCsrfToken: newCsrfToken,
          success: false,
          message: "Validation.validationFailed",
          errors: z.treeifyError(parsed.error),
        };
      }

      const result = await handler(parsed.data);
      result.newCsrfToken = newCsrfToken;
      return result;
    } catch (e) {
      if (e instanceof NotAuthenticatedError) redirect("/signin");
      if (isRedirectError(e)) throw e;

      console.error("Server Action Error:", e);

      try {
        const newCsrfToken = await getCsrfTokenAction();
        return {
          success: false,
          message: "Common.unexpectedError",
          errors: {} as any,
          newCsrfToken: newCsrfToken,
        };
      } catch (csrfError) {
        console.error("Failed to get new CSRF token during error handling:", csrfError);
        return {
          success: false,
          message: "Common.unexpectedError",
          errors: {} as any,
        };
      }
    }
  };
}

export function createDeleteAction({ tableName, pkColumn, revalidatePaths }: DeleteActionParams) {
  const schema = z.object({
    [`${pkColumn}`]: z.coerce.number().int().min(1),
  });

  const handler: ActionHandler<z.infer<typeof schema>> = async (data) => {
    await dbClient.delete(tableName, { [pkColumn]: data[pkColumn as keyof typeof data] });
    revalidatePaths.forEach((path) => revalidatePath(path, "layout"));
    return { success: true, message: "Common.deleteSuccess" };
  };

  return createProtectedAction(schema, handler, createActionParser());
}

export function createBulkDeleteAction({ tableName, pkColumn, revalidatePaths }: DeleteActionParams) {
  const handler: ActionHandler<BulkDeleteData> = async (data) => {
    if (data.ids.length === 0) {
      return { success: true, message: "Common.noItemsSelected" };
    }
    await dbClient.delete(tableName, { [pkColumn]: { in: data.ids } });
    revalidatePaths.forEach((path) => revalidatePath(path, "layout"));
    return { success: true, message: "Common.bulkDeleteSuccess" };
  };

  return createProtectedAction(BulkDeleteSchema, handler, createActionParser({ jsonFields: ["ids"] }));
}

async function getId<T extends Record<string, any>, K extends keyof T>(params: Promise<T>, key: K): Promise<number> {
  const paramsValue = await params;
  const value = paramsValue[key] as unknown as string | undefined;

  if (typeof value !== "string") {
    return notFound();
  }

  return parseInt(value, 10);
}

export async function getIdFromParams<T extends Record<string, any>, K extends keyof T>(params: Promise<T>, key: K): Promise<number> {
  const id = await getId(params, key);

  if (isNaN(id)) {
    return notFound();
  }

  return id;
}
