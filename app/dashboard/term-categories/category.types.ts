import { ActionState } from "@root/types";
import { z } from "zod";

import { CategoryFormSchema } from "./category.schema";

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;

export type CategoryFormState = ActionState<CategoryFormValues>;
