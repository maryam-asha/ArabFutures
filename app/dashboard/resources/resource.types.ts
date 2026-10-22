import { ActionState } from "@root/types";
import { z } from "zod";

import { ResourceFormSchema } from "./resource.schema";

export type ResourceFormValues = z.infer<typeof ResourceFormSchema>;
export type ResourceFormState = ActionState<ResourceFormValues>;
