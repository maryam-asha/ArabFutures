import z from "zod";

const idSchema = z.coerce.number().int().positive();

export const BulkDeleteSchema = z.object({
  ids: z.array(idSchema),
});

export const singleUpdateSchema = z.object({
  id: idSchema,
  actionType: z.enum(["approve", "pend", "feature", "unfeature"]),
});

export const BulkUpdateSchema = z.object({
  termId: idSchema,
  actionType: z.enum(["approve", "pend", "feature", "unfeature"]),
});
