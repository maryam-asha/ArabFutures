import { ActionState } from "@root/types";
import { z } from "zod";

import { TermFormSchema, TermsBulkUpdateSchema } from "./term.schema";

export type TermForm = z.infer<typeof TermFormSchema>;
export type TermFormState = ActionState<TermForm>;
export type TermsBulkUpdateData = z.infer<typeof TermsBulkUpdateSchema>;
