import { z } from "zod";

import * as schema from "./dal.schema";
import { TermCategoryWithCountDbSchema } from "./dal.schema";

export type TermCategoryDb = z.infer<typeof schema.TermCategoryDbSchema>;
export type TermCategoryOption = z.infer<typeof schema.TermCategoryOptionSchema>;
export type TermCategoryWithCount = z.infer<typeof TermCategoryWithCountDbSchema>;

export type TagDb = z.infer<typeof schema.TagDbSchema>;
export type TagOption = z.infer<typeof schema.TagOptionSchema>;

export type TermDb = z.infer<typeof schema.TermDbSchema>;
export type TermForEditDb = z.infer<typeof schema.TermForEditDbSchema>;
