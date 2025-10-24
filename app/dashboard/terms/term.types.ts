import { ActionState } from "@root/types";
import { z } from "zod";

import { TermFormSchema } from "./term.schema";

export type TermForm = z.infer<typeof TermFormSchema>;
export type TermFormState = ActionState<TermForm>;
