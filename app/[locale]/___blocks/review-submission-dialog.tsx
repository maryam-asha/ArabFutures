"use client";

import { submitReviewAction } from "@app/[locale]/public-actions";
import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { ReferencesField } from "@app/dashboard/___blocks/references-field";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { TermReferenceDbSchema } from "@root/dal/dal.schema";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ReviewFormSchema = z.object({
  suggestedChange: z.string().trim().min(10, "Your suggestion must be at least 10 characters."),
  explanation: z.string().trim().optional(),
  references: z.array(TermReferenceDbSchema).optional(),
});
type ReviewFormValues = z.infer<typeof ReviewFormSchema>;

interface ReviewSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  termId?: number;
}

export function ReviewSubmissionDialog({ isOpen, onClose, onSuccess, termId }: ReviewSubmissionDialogProps) {
  const t = useTranslations("Public.reviewDialog");
  const commonT = useTranslations("Common");

  const [state, formAction] = useActionState(submitReviewAction, { success: false, errors: {} as any });
  const [isPending, startTransition] = useTransition();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { suggestedChange: "", explanation: "", references: [] },
  });

  const { setError } = form;

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (state.success && form.formState.isSubmitSuccessful) {
      toast.success(state.message);
      onSuccess();
    } else if (!state.success && state.message && form.formState.isSubmitted) {
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, form.formState.isSubmitSuccessful, form.formState.isSubmitted, onSuccess, setCsrfToken, setError]);

  useEffect(() => {
    form.reset({ suggestedChange: "", explanation: "", references: [] });
  }, [isOpen, form]);

  const referencesValue = useWatch({ control: form.control, name: "references" });

  if (!termId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-4"
            onSubmit={form.handleSubmit(() => {
              startTransition(() => {
                const formData = new FormData();
                const csrfInput = document.querySelector('input[name="csrf_token"]') as HTMLInputElement;
                if (csrfInput) {
                  formData.append("csrf_token", csrfInput.value);
                }
                formData.append("termRef", String(termId));
                formData.append("suggestedChange", form.getValues("suggestedChange"));
                formData.append("explanation", form.getValues("explanation") || "");
                formData.append("references", JSON.stringify(form.getValues("references") || []));
                formAction(formData);
              });
            })}
          >
            <CsrfInput />
            <input type="hidden" name="termRef" value={termId} />
            <input type="hidden" name="references" value={JSON.stringify(referencesValue)} />

            <FormField
              control={form.control}
              name="suggestedChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("suggestionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} placeholder={t("suggestionPlaceholder")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("explanationLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} placeholder={t("explanationPlaceholder")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ReferencesField control={form.control} path="references" />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? commonT("saving") : t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
