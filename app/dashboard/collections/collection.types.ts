import { ActionState } from "@root/types";
import { z } from "zod";

import { CollectionFormSchema } from "./collection.schema";

export type CollectionFormValues = z.infer<typeof CollectionFormSchema>;
export type CollectionFormState = ActionState<CollectionFormValues>;
