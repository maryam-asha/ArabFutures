import { ActionState } from "@root/types";
import { z } from "zod";

import { CategoryFormSchema } from "./category.schema";

export type CategoryForm = z.infer<typeof CategoryFormSchema>;
export type CategoryFormState = ActionState<CategoryForm>;
