"use client";

import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { saveCategoryAction } from "@app/dashboard/term-categories/actions";
import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@ui/form";
import { Switch } from "@ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { CategoryFormSchema } from "../category.schema";
import { type CategoryForm, CategoryFormState } from "../category.types";

const initialFormState: CategoryFormState = {
  success: false,
  message: "",
  errors: {} as any,
};

export function CategoryForm({ initialData }: { initialData: Partial<CategoryForm> }) {
  const isEditMode = !!initialData?.categoryId;
  const router = useRouter();
  const [state, formAction] = useActionState(saveCategoryAction, initialFormState);

  const form = useForm<CategoryForm>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      isActive: true,
      ...initialData,
    },
  });

  const { formState } = form;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        <CsrfInput />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue={i18nAppConfig.defaultLocale}>
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
                        <FormLabel>Name</FormLabel>
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
              <h3 className="font-semibold text-lg">Visibility</h3>
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel htmlFor="isActive" className="cursor-pointer mb-0">
                      Active
                    </FormLabel>
                    <FormControl>
                      <span className="wael habbal">
                        <Switch id="isActive" name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                      </span>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => router.back()} type="button">
            Cancel
          </Button>
          {/* isPending={isPending} */}
          <SubmitButton isEditMode={isEditMode} />
        </div>
      </form>
    </Form>
  );
}
