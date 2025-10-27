"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { MultiSelectCombobox } from "@app/dashboard/___blocks/multi-select-combobox";
import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig from "@i18n/config";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import { TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { Textarea } from "@ui/textarea";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { termSaveAction } from "../actions";
import { TermFormSchema } from "../term.schema";
import { type TermForm, type TermFormState } from "../term.types";

const initialFormState: TermFormState = {
  success: false,
  message: "",
  errors: {} as any,
};

interface TermFormProps {
  initialData: Partial<TermForm & { tagIds?: number[] }>;
  categories: TermCategoryOption[];
  tags: TagOption[];
}

export function TermForm({ initialData, categories, tags }: TermFormProps) {
  const isEditMode = !!initialData?.termId;
  const router = useRouter();
  const locale = useLocale();
  const [state, formAction] = useActionState(termSaveAction, initialFormState);
  const { setCsrfToken } = useReactiveCsrf();

  const tLabels = useTranslations("Dashboard.forms.labels");
  const tPlaceholders = useTranslations("Dashboard.forms.placeholders");
  const tStatuses = useTranslations("Dashboard.forms.statuses");
  const tCommon = useTranslations("Common");

  const form = useForm<TermForm>({
    resolver: zodResolver(TermFormSchema),

    defaultValues: {
      status: "pending",
      isFeatured: false,
      tags: initialData.tagIds || [],
      ...initialData,
      categoryRef: initialData.categoryRef || categories?.[0].categoryId || -1,
    },
  });

  const { formState, control, setError, setValue } = form;

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      // Redirect is handled by the server action
    } else if (state.message && state.errors) {
      if (state.newCsrfToken) {
        setCsrfToken(state.newCsrfToken);
      }
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError]);

  const tagOptions = tags.map((t) => ({ value: t.tagId, label: t.name }));

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {isEditMode && <input type="hidden" name="termId" value={initialData.termId} />}
        <CsrfInput />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
                <TabsContent key={locale} value={locale} className="pt-4 space-y-4" forceMount>
                  <FormField
                    control={control}
                    name={`translations.${locale}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {tLabels("title")} - ({locale.toUpperCase()})
                        </FormLabel>
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
                        <FormLabel>
                          {tLabels("briefDescription")} - ({locale.toUpperCase()})
                        </FormLabel>
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
                        <FormLabel>
                          {tLabels("fullDetail")} - ({locale.toUpperCase()})
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} value={field.value ?? ""} rows={8} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <ReferencesField control={control} locale={locale as "en" | "ar"} />
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg border space-y-4">
              <h3 className="font-semibold text-lg">{tLabels("organization")}</h3>
              <FormField
                control={control}
                name="categoryRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tLabels("category")}</FormLabel>
                    <Select
                      {...field}
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                      }}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tPlaceholders("selectCategory")} />
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
                    <FormLabel>{tLabels("tags")}</FormLabel>
                    <MultiSelectCombobox options={tagOptions} selected={field.value || []} onChange={(selectedIds: number[]) => field.onChange(selectedIds)} placeholder={tPlaceholders("selectTags")} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="p-6 bg-white rounded-lg border space-y-4">
              <h3 className="font-semibold text-lg">{tLabels("visibility")}</h3>
              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tLabels("status")}</FormLabel>
                    <Select {...field} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={tPlaceholders("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="published">{tStatuses("published")}</SelectItem>
                        <SelectItem value="pending">{tStatuses("pending")}</SelectItem>
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
                    <FormLabel>{tLabels("featured")}</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => router.back()} type="button">
            {tCommon("actions.cancel")} {/* FIX: Use Common namespace */}
          </Button>
          <SubmitButton
            isEditMode={isEditMode}
            createText={tCommon("actions.create")} // FIX: Use Common namespace
            updateText={tCommon("actions.save")} // FIX: Use Common namespace
            pendingText={tCommon("saving")} // FIX: Use Common namespace
          />
        </div>
      </form>
    </Form>
  );
}

function ReferencesField({ control, locale }: { control: any; locale: "en" | "ar" }) {
  const t_labels = useTranslations("Dashboard.forms.labels");
  const { fields, append, remove } = useFieldArray({
    control,
    name: `translations.${locale}.references`,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{t_labels("references")}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ content: "", url: "" })}>
          <PlusCircle className="h-4 w-4 me-2" />
          {t_labels("addReference")}
        </Button>
      </div>

      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2 p-3 border rounded-md">
          <FormField
            control={control}
            name={`translations.${locale}.references.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t_labels("referenceContent")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`translations.${locale}.references.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t_labels("referenceUrl")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="self-end text-destructive hover:bg-destructive/10">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
