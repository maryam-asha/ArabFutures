"use client";

import { submitReviewAction } from "@app/public-actions";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Type for the data needed to target a specific field for review
export type ReviewTarget = {
  identifier: string; // e.g., 'default-en', 'more-0'
  fieldKey: "name" | "briefDescription" | "fullDescription";
  currentValue: string;
};

// Zod schema for the review form
const ReviewFormSchema = z.object({
  suggestedValue: z.string().trim().min(2, "Suggestion must be at least 2 characters."),
  explanation: z.string().trim().optional(),
});
type ReviewFormValues = z.infer<typeof ReviewFormSchema>;

// Props for the component
interface ReviewSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  target: ReviewTarget | null;
  termId?: number;
}

export function ReviewSubmissionDialog({ isOpen, onClose, onSuccess, target, termId }: ReviewSubmissionDialogProps) {
  const t = useTranslations("Public.reviewDialog");
  const commonT = useTranslations("Common");
  const [state, formAction, isPending] = useActionState(submitReviewAction, { success: false, errors: {} as any });

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { suggestedValue: "", explanation: "" },
  });

  useEffect(() => {
    if (state.success && form.formState.isSubmitSuccessful) {
      toast.success(state.message);
      onSuccess();
    } else if (state.message && !state.success && form.formState.isSubmitted) {
      toast.error(state.message);
    }
  }, [state, form.formState.isSubmitSuccessful, form.formState.isSubmitted, onSuccess]);

  // Reset form when the dialog is closed or the target changes
  useEffect(() => {
    form.reset({ suggestedValue: "", explanation: "" });
  }, [isOpen, target, form]);

  if (!target || !termId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { fieldName: t(`field-${target.fieldKey}`) })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-4"
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                formAction(new FormData(evt.currentTarget));
              })(evt);
            }}
          >
            <CsrfInput />
            <input type="hidden" name="termRef" value={termId} />
            <input type="hidden" name="translationIdentifier" value={target.identifier} />
            <input type="hidden" name="fieldKey" value={target.fieldKey} />

            <div>
              <Label className="text-xs text-muted-foreground">{t("currentValue")}</Label>
              <p className="text-sm p-2 bg-muted rounded-md">{target.currentValue || <em>{t("empty")}</em>}</p>
            </div>

            <FormField
              control={form.control}
              name="suggestedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("suggestionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <input type="hidden" name="references" value="[]" />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? commonT("saving") : t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
