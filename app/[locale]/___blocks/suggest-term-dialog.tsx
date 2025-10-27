"use client";

import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { suggestTermAction } from "@app/public-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig from "@i18n/config";
import { TermCategoryOption } from "@root/dal/dal.types";
import { ActionState } from "@root/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Input } from "@ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Textarea } from "@ui/textarea";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SuggestionFormSchema = z
  .object({
    categoryRef: z.coerce.number<number>().min(1, "Please select a category."),
    translations: z.any(),
  })
  .refine(
    (data) => {
      const translations = data.translations || {};
      return i18nAppConfig.locales.some((locale) => translations[locale]?.title && translations[locale].title.length >= 3);
    },
    {
      message: "At least one language must have a title with at least 3 characters.",
      path: [`translations.${i18nAppConfig.defaultLocale}.title`],
    },
  );
type SuggestionFormValues = z.infer<typeof SuggestionFormSchema>;

const initialFormState: ActionState<any> = { success: false, errors: {} as any, message: "" };

interface SuggestTermDialogProps {
  categories: TermCategoryOption[];
  children: React.ReactNode;
}

export function SuggestTermDialog({ categories, children }: SuggestTermDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(suggestTermAction, initialFormState);
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(SuggestionFormSchema),
    defaultValues: { categoryRef: 0, translations: { en: { title: "" }, ar: { title: "" } } },
  });
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(t("toasts.suggestionSuccess"));
      form.reset();
      setIsOpen(false);
    } else if (state.message && form.formState.isSubmitted) {
      toast.error(state.message);
    }
  }, [state, form, t]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          {/* actions.addTerm */}
          <DialogTitle>{tCommon("actions.add")}</DialogTitle>
          <DialogDescription>{t("pages.terms.addDescription")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form ref={formRef} action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("forms.labels.category")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value > 0 ? field.value.toString() : ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("forms.placeholders.selectCategory")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.categoryId} value={cat.categoryId.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {i18nAppConfig.locales.map((locale) => (
              <div key={locale} className="space-y-4 rounded-md border p-4">
                <h3 className="font-medium">
                  {t("pages.terms.title")} ({locale.toUpperCase()})
                </h3>
                <FormField
                  control={form.control}
                  name={`translations.${locale}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("forms.labels.title")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`translations.${locale}.briefDescription`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("forms.labels.briefDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <SubmitButton isEditMode={false} pendingText={tCommon("saving")} createText={tCommon("actions.create")} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
