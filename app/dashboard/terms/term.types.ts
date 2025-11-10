import { ActionState } from "@root/types";
import { z } from "zod";

import { TermFormSchema, TermsBulkUpdateSchema } from "./term.schema";

// Form-specific types inferred from the new Zod schemas
export type TermForm = z.infer<typeof TermFormSchema>;
export type TermFormState = ActionState<TermForm>;
export type TermsBulkUpdateData = z.infer<typeof TermsBulkUpdateSchema>;
