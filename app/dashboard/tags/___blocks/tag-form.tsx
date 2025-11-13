"use client";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { tagSaveAction } from "../actions";
import { TagFormSchema } from "../tag.schema";
import { type TagFormState, TagFormValues } from "../tag.types";

const initialFormState: TagFormState = { success: false, errors: {} as any };

interface TagFormProps {
  initialData: Partial<TagFormValues>;
  children: React.ReactNode;
}

export function TagForm({ initialData, children }: TagFormProps) {
  const locale = useLocale();
  const [state, formAction] = useActionState(tagSaveAction, initialFormState);
  const tLabels = useTranslations("Dashboard.forms.labels");

  const form = useForm<TagFormValues>({
    resolver: zodResolver(TagFormSchema),
    defaultValues: initialData,
  });

  const { formState, setError } = form;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <CsrfInput />
        {initialData.tagId && <input type="hidden" name="tagId" value={initialData.tagId} />}

        <div className="space-y-8">
          <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <TabsList>
              {i18nAppConfig.locales.map((locale) => {
                const hasError = !!formState.errors.translations?.[locale];
                return (
                  <TabsTrigger key={locale} value={locale} className={cn(hasError && "text-destructive")}>
                    {locale.toUpperCase()} {hasError && "*"}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {i18nAppConfig.locales.map((locale) => (
              <TabsContent key={locale} value={locale} className="pt-4" forceMount>
                <FormField
                  control={form.control}
                  name={`translations.${locale}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {tLabels("name")} - ({locale.toUpperCase()})
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            ))}
          </Tabs>

          {children}
        </div>
      </form>
    </Form>
  );
}
