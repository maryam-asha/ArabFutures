import { ActionState } from "@root/types";
import { z } from "zod";

import { DeleteManyTagsSchema, TagFormSchema } from "./tag.schema";

export type TagForm = z.infer<typeof TagFormSchema>;
export type TagFormState = ActionState<TagForm>;

export type DeleteManyTagsData = z.infer<typeof DeleteManyTagsSchema>;
export type DeleteManyTagsState = ActionState<DeleteManyTagsData>;
