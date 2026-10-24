import { ActionState } from "@root/types";
import { z } from "zod";

import { BlogPostFormSchema } from "./post.schema";

export type BlogPostFormValues = z.infer<typeof BlogPostFormSchema>;
export type BlogPostFormState = ActionState<BlogPostFormValues>;
