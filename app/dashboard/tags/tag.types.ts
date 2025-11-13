import { ActionState } from "@root/types";
import { z } from "zod";

import { TagFormSchema } from "./tag.schema";

export type TagFormValues = z.infer<typeof TagFormSchema>;

export type TagFormState = ActionState<TagFormValues>;
