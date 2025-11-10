import { z } from "zod";

import * as schema from "./dal.schema";

// Types for Term Categories
export type TermCategoryDb = z.infer<typeof schema.TermCategoryDbSchema>;
export type TermCategoryOption = z.infer<typeof schema.TermCategoryOptionSchema>;
export type TermCategoryWithCount = z.infer<typeof schema.TermCategoryWithCountDbSchema>;

// Types for Tags
export type TagDb = z.infer<typeof schema.TagDbSchema>;
export type TagOption = z.infer<typeof schema.TagOptionSchema>;

// Types for the new Term Content structure
export type TermReference = z.infer<typeof schema.TermReferenceSchema>;
export type TermTranslation = z.infer<typeof schema.TermTranslationSchema>;
export type TermMoreTranslation = z.infer<typeof schema.TermMoreTranslationSchema>;
export type TermContent = z.infer<typeof schema.TermContentSchema>;

// Types for Terms
export type TermDb = z.infer<typeof schema.TermDbSchema>;
export type TermForEditDb = z.infer<typeof schema.TermForEditDbSchema>;

// Types for Term Reviews
export type TermReviewDb = z.infer<typeof schema.TermReviewDbSchema>;
