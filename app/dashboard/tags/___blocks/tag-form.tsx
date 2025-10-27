"use client";

import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveTagAction } from "../actions";
import { TagFormSchema } from "../tag.schema";
import { type TagForm, type TagFormState } from "../tag.types";

const initialFormState: TagFormState = {
  success: false,
  message: "",
  errors: {} as any,
};

export function TagForm({ initialData }: { initialData: Partial<TagForm> }) {
  const isEditMode = !!initialData?.tagId;
  const locale = useLocale();
  const router = useRouter();
  const [state, formAction] = useActionState(saveTagAction, initialFormState);
  const tLabels = useTranslations("Dashboard.forms.labels");
  const tCommon = useTranslations("Common");

  const form = useForm<TagForm>({
    resolver: zodResolver(TagFormSchema),
    defaultValues: initialData,
  });

  const { formState, setError } = form;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Redirect is handled by the server action
    } else if (state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <CsrfInput />
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

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => router.back()} type="button">
            {tCommon("actions.cancel")}
          </Button>
          <SubmitButton isEditMode={isEditMode} createText={tCommon("actions.create")} updateText={tCommon("actions.save")} pendingText={tCommon("saving")} />
        </div>
      </form>
    </Form>
  );
}
