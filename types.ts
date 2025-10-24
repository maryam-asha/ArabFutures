import { $ZodErrorTree } from "zod/v4/core";

export type ActionState<T> =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      errors: $ZodErrorTree<T>;
      message?: string;
    };
