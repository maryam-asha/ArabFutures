"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { subscribeToAction } from "@app/newsletter-actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { ArrowRight, Loader2, MailIcon } from "lucide-react";
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

  const emailError = form.formState.errors.email?.message;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full max-w-[43rem] flex-col items-stretch gap-4 sm:flex-row sm:items-start">
      <CsrfInput />
      {/* Plain input with fixed ids: this form sits in the footer after streamed page content, where useId-based
          ids (shadcn FormItem) can differ between server and client and break hydration. */}
      <div className="flex-1">
        <div className="relative">
          <MailIcon aria-hidden className="text-light/70 pointer-events-none absolute start-5 top-1/2 size-5 -translate-y-1/2" />
          <Input
            id="newsletter-email"
            type="email"
            autoComplete="email"
            aria-label={t("placeholder")}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "newsletter-email-error" : undefined}
            className="border-light/60 text-light placeholder:text-light/60 focus-visible:border-gold h-14 rounded-none bg-transparent ps-14 text-base"
            placeholder={t("placeholder")}
            {...form.register("email")}
            disabled={isPending}
          />
        </div>
        {emailError && (
          <p id="newsletter-email-error" className="text-destructive mt-2 text-sm">
            {emailError}
          </p>
        )}
      </div>
      <Button type="submit" variant="outline" className="afs-label border-gold text-gold hover:bg-gold hover:text-ink h-14 rounded-none bg-transparent px-6 text-base" disabled={isPending}>
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPending ? commonT("saving") : t("cta")}
        {!isPending && <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />}
      </Button>
    </form>
  );
}
