import { z } from "zod";

import * as schema from "./dal.schema";

export type TermCategoryDb = z.infer<typeof schema.TermCategoryDbSchema>;
export type TermCategoryOption = z.infer<typeof schema.TermCategoryOptionDbSchema>;
export type TermCategoryWithCount = z.infer<typeof schema.TermCategoryWithCountDbSchema>;

export type TagDb = z.infer<typeof schema.TagDbSchema>;
export type TagOption = z.infer<typeof schema.TagOptionDbSchema>;
export type TagWithCount = z.infer<typeof schema.TagWithCountDbSchema>;

export type TermReferenceDb = z.infer<typeof schema.TermReferenceDbSchema>;
export type TermTranslationDb = z.infer<typeof schema.TermTranslationDbSchema>;
export type TermMoreTranslationDb = z.infer<typeof schema.TermMoreTranslationDbSchema>;
export type TermContentDb = z.infer<typeof schema.TermContentDbSchema>;

export type TermDb = z.infer<typeof schema.TermDbSchema>;
export type TermForEditDb = z.infer<typeof schema.TermForEditDbSchema>;

export type TermReviewDb = z.infer<typeof schema.TermReviewDbSchema>;
export type TermReviewWithTermName = z.infer<typeof schema.TermReviewWithTermNameDbSchema>;
