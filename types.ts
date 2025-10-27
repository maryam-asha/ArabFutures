import { $ZodErrorTree } from "zod/v4/core";

export type ActionState<T> =
  | {
      success: true;
      message?: string;
      newCsrfToken?: string;
    }
  | {
      success: false;
      errors: $ZodErrorTree<T>;
      message?: string;
      newCsrfToken?: string;
    };
