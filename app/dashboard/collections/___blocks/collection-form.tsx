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

import { collectionSaveAction } from "../actions";
import { CollectionFormSchema } from "../collection.schema";
import { CollectionFormState, type CollectionFormValues } from "../collection.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared ActionState initial-state pattern.
const initialFormState: CollectionFormState = { success: false, errors: {} as any };

interface CollectionFormProps {
  initialData: Partial<CollectionFormValues>;
  children: React.ReactNode;
}

export function CollectionForm({ initialData, children }: CollectionFormProps) {
  const [state, formAction] = useActionState(collectionSaveAction, initialFormState);
  const locale = useLocale();
  const t = useTranslations();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<CollectionFormValues>({
    mode: "onBlur",
    resolver: zodResolver(CollectionFormSchema),
    defaultValues: { isActive: true, displayOrder: 0, ...initialData },
  });

  const { formState, setError } = form;

  useEffect(() => {
    if (state.newCsrfToken) setCsrfToken(state.newCsrfToken);
    if (!state.success && state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(t(state.message));
    }
  }, [state, setError, setCsrfToken]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <CsrfInput />
        {initialData.collectionId && <input type="hidden" name="collectionId" value={initialData.collectionId} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
              <TabsList>
                {i18nAppConfig.locales.map((loc) => {
                  const hasError = !!formState.errors.translations?.[loc];
                  return (
                    <TabsTrigger key={loc} value={loc} className={cn(hasError && "text-destructive")}>
                      {i18nAppConfig.labels[loc]} {hasError && "*"}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              {i18nAppConfig.locales.map((loc) => (
                <TabsContent key={loc} value={loc} className="pt-4" forceMount>
                  <FormField
                    control={form.control}
                    name={`translations.${loc}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t("Dashboard.forms.labels.name")} ({i18nAppConfig.labels[loc]})
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
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <FormLabel htmlFor="isActive" className="mb-0 cursor-pointer">
                      {field.value ? t("Dashboard.forms.labels.active") : t("Dashboard.forms.labels.inactive")}
                    </FormLabel>
                    <FormControl>
                      <Switch id="isActive" name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="displayOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Dashboard.forms.labels.displayOrder")}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? 0} onChange={(e) => field.onChange(Number(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {children}
      </form>
    </Form>
  );
}
