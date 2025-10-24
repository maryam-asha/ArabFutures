// File: dal/dal.types.ts
import { z } from "zod";

import * as schema from "./dal.schema";
import { TermCategoryWithCountDbSchema, TermForEditDbSchema } from "./dal.schema";

// =================================================================
// TERM CATEGORIES
// =================================================================
export type TermCategoryDb = z.infer<typeof schema.TermCategoryDbSchema>;
export type TermCategoryOption = z.infer<typeof schema.TermCategoryOptionSchema>;
export type TermCategoryWithCount = z.infer<typeof TermCategoryWithCountDbSchema>;

// =================================================================
// TAGS
// =================================================================
export type TagDb = z.infer<typeof schema.TagDbSchema>;
export type TagOption = z.infer<typeof schema.TagOptionSchema>;

// =================================================================
// TERMS
// =================================================================
export type TermDb = z.infer<typeof schema.TermDbSchema>;
export type TermForEditDb = z.infer<typeof TermForEditDbSchema>;
