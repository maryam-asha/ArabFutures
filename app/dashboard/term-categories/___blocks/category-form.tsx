"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Switch } from "@ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { termCategorySaveAction } from "../action";
import { CategoryFormSchema } from "../category.schema";
import { CategoryFormState, type CategoryFormValues } from "../category.types";

const initialFormState: CategoryFormState = { success: false, errors: {} as any };

interface CategoryFormProps {
  initialData: Partial<CategoryFormValues>;
  children: React.ReactNode;
}

export function CategoryForm({ initialData, children }: CategoryFormProps) {
  const [state, formAction] = useActionState(termCategorySaveAction, initialFormState);
  const locale = useLocale();
  const t = useTranslations();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<CategoryFormValues>({
    mode: "onBlur",
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      isActive: true,
      ...initialData,
    },
  });

  const { formState, setError } = form;

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (!state.success && state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(t(state.message));
    }
  }, [state, setError, setCsrfToken]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <CsrfInput />
        {initialData.categoryId && <input type="hidden" name="categoryId" value={initialData.categoryId} />}

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
                <TabsList>
                  {i18nAppConfig.locales.map((locale) => {
                    const hasError = !!formState.errors.translations?.[locale];
                    return (
                      <TabsTrigger key={locale} value={locale} className={cn(hasError && "text-destructive")}>
                        {i18nAppConfig.labels[locale]} {hasError && "*"}
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
                            {t("Dashboard.forms.labels.name")} - ({i18nAppConfig.labels[locale]})
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
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border space-y-4">
                <h3 className="font-semibold text-lg">{t("Dashboard.forms.labels.visibility")}</h3>
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                      <FormLabel htmlFor="isActive" className="cursor-pointer mb-0">
                        {field.value ? t("Dashboard.forms.labels.active") : t("Dashboard.forms.labels.inactive")}
                      </FormLabel>
                      <FormControl>
                        <Switch id="isActive" name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* The action buttons passed from the parent are rendered here */}
          {children}
        </div>
      </form>
    </Form>
  );
}
