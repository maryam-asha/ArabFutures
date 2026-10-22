import { z } from "zod";

/** A bilingual (en/ar) text field; both sides optional unless a stricter schema requires them. */
const Bilingual = z.object({
  en: z.string().trim().optional(),
  ar: z.string().trim().optional(),
});

const MemberSocialFormSchema = z.object({
  email: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  website: z.string().trim().optional(),
});

export const MemberWorkFormSchema = z.object({
  imageUrl: z.string().trim().optional(),
  type: z.string().trim().optional(),
  date: z.string().trim().optional(),
  readTime: z.string().trim().optional(),
  url: z.string().trim().optional(),
  title: Bilingual.optional(),
  description: Bilingual.optional(),
  tags: z.array(z.string().trim()).optional(),
});

export const MemberLinkFormSchema = z.object({
  label: Bilingual.optional(),
  url: z.string().trim().optional(),
});

export const MemberContentFormSchema = z.object({
  photoUrl: z.string().trim().optional(),
  name: z.object({
    en: z.string().trim().min(2, "Name must be at least 2 characters."),
    ar: z.string().trim().min(2, "Name must be at least 2 characters."),
  }),
  role: Bilingual.optional(),
  social: MemberSocialFormSchema.optional(),
  roleWithinAsf: Bilingual.optional(),
  professionalProfile: Bilingual.optional(),
  favoriteWord: z
    .object({
      word: Bilingual.optional(),
      explanation: Bilingual.optional(),
    })
    .optional(),
  works: z.array(MemberWorkFormSchema).optional(),
  links: z.array(MemberLinkFormSchema).optional(),
});

export const MemberFormSchema = z.object({
  memberId: z.coerce.number<number>().optional(),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  displayOrder: z.coerce.number<number>().int().min(0),
  isActive: z.coerce.boolean<boolean>(),
  isFeatured: z.coerce.boolean<boolean>(),
  content: MemberContentFormSchema,
});
