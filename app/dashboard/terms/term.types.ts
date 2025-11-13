import { ActionState } from "@root/types";
import { z } from "zod";

import { TermFormSchema, TermSaveActionSchema, TermsBulkUpdateActionSchema } from "./term.schema";

export type TermFormValues = z.infer<typeof TermFormSchema>;
export type TermFormState = ActionState<TermFormValues>;

export type TermSaveActionInput = z.infer<typeof TermSaveActionSchema>;

export type TermsBulkUpdateActionInput = z.infer<typeof TermsBulkUpdateActionSchema>;
