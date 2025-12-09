"use client";

import { contactAction } from "@app/[locale]/public-actions";
import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionState } from "@root/types";
import { Button } from "@ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ContactActionSchema } from "../public.schema";

const initialFormState: ActionState<any> = { success: false, errors: {} as any, message: "" };

export function ContactForm() {
  const locale = useLocale();
  const [state, formAction, isPending] = useActionState(contactAction, initialFormState);
  const t = useTranslations("Public.contact");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const formRef = useRef<HTMLFormElement>(null);
  const { setCsrfToken } = useReactiveCsrf();

  const clientContactSchema = useMemo(
    () =>
      ContactActionSchema.extend({
        name: z.string().min(2, tValidation("nameRequired")),
        email: z.string().email(tValidation("emailInvalid")),
        message: z.string().min(10, tValidation("messageMinLength", { min: 10 })),
      }),
    [tValidation],
  );

  const form = useForm<z.infer<typeof clientContactSchema>>({
    resolver: zodResolver(clientContactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  });

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (form.formState.isSubmitted && state.message) {
      if (state.success) {
        toast.success(t(state.message as any));
        form.reset();
      } else {
        toast.error(t(state.message as any));
      }
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
        <CsrfInput />
        <input type="hidden" name="locale" value={locale} />
        <div className="hidden" aria-hidden="true">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} tabIndex={-1} autoComplete="off" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

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
          {isPending ? tCommon("saving") : t("sendMessage")}
        </Button>
      </form>
    </Form>
  );
}
