"use client";

import { MultiSelectCombobox } from "@app/dashboard/___blocks/multi-select-combobox";
import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig from "@i18n/config";
import { cn } from "@lib/utils";
import { TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { Textarea } from "@ui/textarea";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { saveTermAction } from "../actions";
import { TermFormSchema } from "../term.schema";
import { type TermForm, type TermFormState } from "../term.types";

const initialFormState: TermFormState = {
  success: false,
  message: "",
  errors: {} as any,
};

interface TermFormProps {
  initialData: Partial<TermForm>;
  categories: TermCategoryOption[];
  tags: TagOption[];
}

export function TermForm({ initialData, categories, tags }: TermFormProps) {
  const isEditMode = !!initialData?.termId;
  const router = useRouter();
  const [state, formAction] = useActionState(saveTermAction, initialFormState);

  const form = useForm<TermForm>({
    resolver: zodResolver(TermFormSchema),
    defaultValues: {
      status: "published",
      isFeatured: false,
      tags: [],
      ...initialData,
    },
  });

  const { formState, control, setValue, getValues } = form;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const tagOptions = tags.map((t) => ({ value: t.tagId, label: t.name }));

  // Because HTML forms can't handle complex JSON, we stringify arrays
  // before submitting. The server action's parser will handle it.
  const handleFormAction = (formData: FormData) => {
    const tags = getValues("tags");
    formData.append("tags", JSON.stringify(tags));
    formAction(formData);
  };

  return (
    <Form {...form}>
      <form action={handleFormAction} className="space-y-8">
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
                <TabsContent key={locale} value={locale} className="pt-4 space-y-4" forceMount>
                  <FormField
                    control={control}
                    name={`translations.${locale}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`translations.${locale}.briefDescription`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name={`translations.${locale}.fullDetail`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Detail</FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ""} rows={8} />
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
              <h3 className="font-semibold text-lg">Organization</h3>
              <FormField
                control={control}
                name="categoryRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
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
              <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <MultiSelectCombobox
                      options={tagOptions}
                      selected={field.value?.map((tag) => tag.tagId)}
                      onChange={(selectedIds: number[]) => {
                        const selectedTags = tags.filter((tag) => selectedIds.includes(tag.tagId));
                        field.onChange(selectedTags);
                      }}
                      placeholder="Select tags..."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-6 bg-white rounded-lg border space-y-4">
              <h3 className="font-semibold text-lg">Visibility</h3>
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select name={field.name} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <FormLabel>Featured</FormLabel>
                    <FormControl>
                      <Switch name={field.name} checked={field.value} onCheckedChange={field.onChange} />
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
          <SubmitButton isEditMode={isEditMode} createText="Create Term" />
        </div>
      </form>
    </Form>
  );
}
