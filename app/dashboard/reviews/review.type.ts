import z from "zod";

import { ReviewActionSchema } from "./review.schema";

export type ReviewActionInput = z.infer<typeof ReviewActionSchema>;
