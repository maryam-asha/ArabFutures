import z from "zod";

export const ContactActionSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
  locale: z.string(),
  website: z.string().optional(),
});
