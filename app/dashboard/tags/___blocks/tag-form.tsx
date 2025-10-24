"use client";

import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
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
  const router = useRouter();
  const [state, formAction] = useActionState(saveTagAction, initialFormState);

  const form = useForm<TagForm>({
    resolver: zodResolver(TagFormSchema),
    defaultValues: initialData,
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

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => router.back()} type="button">
            Cancel
          </Button>
          <SubmitButton isEditMode={isEditMode} createText="Create Tag" />
        </div>
      </form>
    </Form>
  );
}
