"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { contactAction } from "@app/public-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionState } from "@root/types";
import { Button } from "@ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});
type ContactFormValues = z.infer<typeof ContactSchema>;

const initialFormState: ActionState<any> = { success: false, errors: {} as any, message: "" };

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(contactAction, initialFormState);
  const t = useTranslations("Public.contact");
  const commonT = useTranslations("Common");
  const formRef = useRef<HTMLFormElement>(null);
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (state.success) {
      toast.success(t("successMessage"));
      form.reset();
    } else if (state.message && form.formState.isSubmitted) {
      toast.error(t("errorMessage"));
    }
  }, [state, form, t, setCsrfToken]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-6"
        onSubmit={(evt) => {
          evt.preventDefault();
          form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })(evt);
        }}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input placeholder={t("name")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("email")} type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("message")}</FormLabel>
              <FormControl>
                <Textarea placeholder={t("message")} rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg" disabled={isPending}>
          {isPending ? commonT("saving") : t("sendMessage")}
        </Button>
      </form>
    </Form>
  );
}
