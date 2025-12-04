import z from "zod";

import { ContactActionSchema } from "./public.schema";

export type ContactActionValues = z.infer<typeof ContactActionSchema>;
