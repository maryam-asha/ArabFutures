import { dbClient } from "@root/dal/client";
import { ActionState } from "@root/types";
import { NotAuthenticatedError } from "@waelhabbaldev/next-jwt-auth";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "./auth";

export const defaultOrder = 100_000;

export type ActionHandler<TInput, TState> = (data: TInput) => Promise<TState>;

interface ParserConfig {
  booleanFields?: string[];
  jsonFields?: string[];
}

/**
 * Creates a robust FormData parser function.
 * This HOF is designed to handle the complexities of FormData, including
 * nested objects (via dot notation) and boolean values from checkboxes/switches.
 *
 * @param config - Configuration object to specify boolean fields.
 * @returns A parser function that converts FormData to a structured object.
 */
export function createFormDataParser({ booleanFields = [], jsonFields = [] }: ParserConfig = {}) {
  return function parse(formData: FormData): Record<string, any> {
    const object: Record<string, any> = {};

    formData.forEach((value, key) => {
      if (jsonFields.includes(key)) {
        console.log(jsonFields);
        console.log(value.toString());

        console.log(jsonFields.includes(key));

        try {
          object[key] = JSON.parse(value.toString());
          console.log("+++++++++++++++++++++++++++++++++");

          console.log(object[key]);
        } catch (e) {
          console.log(e);

          object[key] = value;
        }
      } else if (key.includes(".")) {
        const keys = key.split(".");
        keys.reduce((acc, currentKey, index) => {
          if (index === keys.length - 1) {
            acc[currentKey] = value;
          } else {
            acc[currentKey] = acc[currentKey] || {};
          }
          return acc[currentKey];
        }, object);
      } else if (booleanFields.includes(key)) {
        if (key) {
          const val = value.toString().toLowerCase();
          object[key] = val === "on" || val === "true" || val === "1";
        } else {
          object[key] = false;
        }
      } else if (key === "translations") {
        object[key] = JSON.parse(value.toString());
      } else {
        object[key] = value;
      }
    });
    return object;
  };
}

// Default parser for simple forms without booleans or nesting.
const defaultParser = createFormDataParser();

/**
 * A higher-order function to create a type-safe, protected server action.
 *
 * @param schema The Zod schema to validate the form data.
 * @param handler The core business logic of the action, which receives the validated data.
 * @param parser An optional function to parse FormData into a plain object before validation.
 * @returns A server action function that can be used in forms.
 */
export function createProtectedAction<TInput, TState extends ActionState<any>>(schema: z.ZodSchema<TInput>, handler: ActionHandler<TInput, TState>, parser?: (formData: FormData) => Record<string, any>) {
  return async function protectedAction(prevState: TState, formData: FormData): Promise<TState> {
    try {
      await auth.protectAction(undefined, formData);

      const dataToParse = parser ? parser(formData) : Object.fromEntries(formData);

      const parsed = schema.safeParse(dataToParse);

      if (!parsed.success) {
        const errors = z.treeifyError(parsed.error);
        return {
          success: false,
          message: "Validation failed. Please check the fields for errors.",
          errors,
        } as TState;
      }

      return await handler(parsed.data);
    } catch (e) {
      if (e instanceof NotAuthenticatedError) {
        redirect("/signin");
      }
      if (isRedirectError(e)) {
        throw e;
      }

      console.error("Server Action Error:", e);

      return {
        success: false,
        message: (e as Error).message || "An unexpected server error occurred.",
        errors: {},
      } as TState;
    }
  };
}

/**
 * Configuration for the generic reordering action.
 */
interface ReorderActionConfig {
  tableName: "categories" | "products";
  pkColumn: "categoryId" | "productId";
  orderColumn?: string;
  revalidatePaths?: string[];
}

const ReorderSchema = z.array(
  z.object({
    id: z.number().positive(),
    order: z.number().nonnegative(),
  }),
);
type ReorderData = z.infer<typeof ReorderSchema>;

/**
 * Creates a generic, protected server action for reordering items in any table.
 */
export function createReorderAction<T>({ tableName, pkColumn, orderColumn = "displayOrder", revalidatePaths = [] }: ReorderActionConfig) {
  const handler = async (data: ReorderData): Promise<ActionState<ReorderData>> => {
    await dbClient.executeTransaction(async (trx) => {
      for (const item of data) {
        await trx.update(tableName, { [orderColumn]: item.order }, { [pkColumn]: item.id });
      }
    });
    revalidatePaths.forEach((path) => revalidatePath(path, "layout"));
    return { success: true, message: "Order updated successfully." };
  };

  return createProtectedAction(ReorderSchema, handler, (formData) => JSON.parse(formData.get("orderedData") as string));
}

/**
 * Configuration for the generic delete action creator.
 */
interface DeleteActionConfig {
  tableName: "termCategories" | "tags" | "terms";
  pkColumn: "categoryId" | "productId" | "tagId" | "termId";
  revalidatePaths: string[];
}

/**
 * Creates a generic, type-safe, and protected server action for deleting an entity.
 * This HOF encapsulates authentication, validation, deletion logic, and error handling.
 *
 * @param config - The configuration object specifying the table, primary key, and revalidation paths.
 * @returns A complete server action function ready to be used in a form.
 */
export function createDeleteAction({ tableName, pkColumn, revalidatePaths }: DeleteActionConfig) {
  const DeleteSchema = z.object({
    [pkColumn]: z.coerce.number().int().min(1, `Invalid ${pkColumn}`),
  });

  const handler = async (data: z.infer<typeof DeleteSchema>): Promise<ActionState<z.infer<typeof DeleteSchema>>> => {
    const id = data[pkColumn as keyof typeof data];

    await dbClient.delete(tableName, { [pkColumn]: id });

    revalidatePaths.forEach((path) => revalidatePath(path, "layout"));

    return { success: true, message: "Item deleted successfully." };
  };

  return createProtectedAction(DeleteSchema, handler);
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
