"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { subscribeToAction } from "@app/newsletter-actions";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { Loader2, MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const NewsletterFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});
type NewsletterFormValues = z.infer<typeof NewsletterFormSchema>;

export function NewsletterForm() {
  const t = useTranslations("Public.newsletter");
  const commonT = useTranslations("Common");
  const tPublic = useTranslations("Public");

  const [state, formAction] = useActionState(subscribeToAction, { success: false, errors: {} as any });

  const [isPending, startTransition] = useTransition();

  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (!form.formState.isSubmitSuccessful) return;

    if (state.message) {
      const message = tPublic(`newsletter.${state.message || "genericError"}`);
      if (state.success) {
        toast.success(message);
        form.reset();
      } else {
        toast.error(message);
      }
    }
  }, [state, form.formState.isSubmitSuccessful, form, setCsrfToken, tPublic]);

  const onSubmit = (data: NewsletterFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      {/* 5. Wire up react-hook-form's handleSubmit */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-lg items-start space-x-2">
        <CsrfInput />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <FormControl>
                  <Input className="pl-10 h-12 text-base" placeholder={t("placeholder")} {...field} disabled={isPending} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="h-12" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? commonT("saving") : t("cta")}
        </Button>
      </form>
    </Form>
  );
}
