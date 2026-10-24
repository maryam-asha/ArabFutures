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

export type MemberSocialDb = z.infer<typeof schema.MemberSocialDbSchema>;
export type MemberWorkDb = z.infer<typeof schema.MemberWorkDbSchema>;
export type MemberLinkDb = z.infer<typeof schema.MemberLinkDbSchema>;
export type MemberContentDb = z.infer<typeof schema.MemberContentDbSchema>;
export type MemberDb = z.infer<typeof schema.MemberDbSchema>;

export type CollectionDb = z.infer<typeof schema.CollectionDbSchema>;
export type CollectionOption = z.infer<typeof schema.CollectionOptionDbSchema>;
export type CollectionWithCount = z.infer<typeof schema.CollectionWithCountDbSchema>;

export type ResourceType = z.infer<typeof schema.ResourceTypeSchema>;
export type ResourceContentDb = z.infer<typeof schema.ResourceContentDbSchema>;
export type ResourceDb = z.infer<typeof schema.ResourceDbSchema>;
export type ResourceForEditDb = z.infer<typeof schema.ResourceForEditDbSchema>;

export type BlogPostContentDb = z.infer<typeof schema.BlogPostContentDbSchema>;
export type BlogPostDb = z.infer<typeof schema.BlogPostDbSchema>;
export type BlogPostForEditDb = z.infer<typeof schema.BlogPostForEditDbSchema>;
