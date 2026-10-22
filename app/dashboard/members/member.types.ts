import { ActionState } from "@root/types";
import { z } from "zod";

import { MemberFormSchema } from "./member.schema";

export type MemberFormValues = z.infer<typeof MemberFormSchema>;
export type MemberFormState = ActionState<MemberFormValues>;
