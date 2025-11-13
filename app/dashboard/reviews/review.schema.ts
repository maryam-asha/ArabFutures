import z from "zod";

export const ReviewActionSchema = z.object({
  reviewId: z.coerce.number<number>(),
});
