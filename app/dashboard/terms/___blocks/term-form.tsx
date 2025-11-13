"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { MultiSelectCombobox } from "@app/dashboard/___blocks/multi-select-combobox";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { setServerErrors } from "@lib/form-helpers";
import { TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { termSaveAction } from "../actions";
import { TermFormSchema } from "../term.schema";
import { TermFormState, TermFormValues } from "../term.types";

const initialFormState: TermFormState = { success: false, errors: {} as any };

interface TermFormProps {
  initialData: Partial<TermFormValues>;
  categories: TermCategoryOption[];
  tags: TagOption[];
  children: React.ReactNode;
}

export function TermForm({ initialData, categories, tags, children }: TermFormProps) {
  const [state, formAction] = useActionState(termSaveAction, initialFormState);

  const { setCsrfToken } = useReactiveCsrf();
  const t = useTranslations();

  const form = useForm<TermFormValues>({
    resolver: zodResolver(TermFormSchema),
    defaultValues: {
      status: "pending",
      isFeatured: false,
      tagIds: [],
      content: {
        default: {
          en: { name: "", briefDescription: "", fullDescription: "", references: [] },
          ar: { name: "", briefDescription: "", fullDescription: "", references: [] },
        },
        more: [],
      },
      ...initialData,
    },
  });

  const { control, setError } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.more",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError]);

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (state.success) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError, setCsrfToken]);

  const tagOptions = tags.map((t) => ({ value: t.tagId, label: t.name }));

  return (
    <Form {...form}>
      <form action={formAction}>
        <CsrfInput />
        {initialData.termId && <input type="hidden" name="termId" value={initialData.termId} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.defaultTranslations")}</CardTitle>
                <CardDescription>{t("Dashboard.forms.helpers.defaultTranslations")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="en">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">Arabic</TabsTrigger>
                  </TabsList>
                  <TabsContent forceMount value="en" className="pt-4">
                    <TranslationFields control={control} path="content.default.en" />
                  </TabsContent>
                  <TabsContent forceMount value="ar" className="pt-4">
                    <TranslationFields control={control} path="content.default.ar" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("Dashboard.forms.labels.moreTranslations")}</CardTitle>
                  <CardDescription>{t("Dashboard.forms.helpers.moreTranslations")}</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => append({ locale: i18nAppConfig.defaultLocale, name: "", briefDescription: "", fullDescription: "", references: [] })}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("Dashboard.forms.labels.addTranslation")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 end-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormField
                      control={control}
                      name={`content.more.${index}.locale`}
                      render={({ field }) => (
                        <FormItem className="mb-4 w-1/2">
                          <FormLabel>{t("Dashboard.forms.labels.localeIdentifier")}</FormLabel>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              form.setValue(`content.more.${index}.locale`, value as AppLocale);
                              field.onChange(value);
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("Dashboard.forms.placeholders.selectLocale")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {i18nAppConfig.locales.map((locale) => (
                                <SelectItem key={locale} value={locale}>
                                  {locale.toUpperCase()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TranslationFields control={control} path={`content.more.${index}`} />
                  </div>
                ))}
                {fields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">{t("Dashboard.forms.helpers.noExtraTranslations")}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.organization")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="categoryRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.category")}</FormLabel>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          form.setValue("categoryRef", Number(value));
                          field.onChange(value);
                        }}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Dashboard.forms.placeholders.selectCategory")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((c) => (
                            <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                              {c.name}
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
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.tags")}</FormLabel>
                      <MultiSelectCombobox options={tagOptions} selected={field.value || []} onChange={field.onChange} placeholder={t("Dashboard.forms.placeholders.selectTags")} />
                      <FormControl>
                        <input type="hidden" name={field.name} value={JSON.stringify(field.value || [])} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.visibility")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.status")}</FormLabel>
                      <Select
                        {...field}
                        onValueChange={(value) => {
                          form.setValue("status", value as TermFormValues["status"]);
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="published">{t("Dashboard.forms.statuses.published")}</SelectItem>
                          <SelectItem value="pending">{t("Dashboard.forms.statuses.pending")}</SelectItem>
                          <SelectItem value="has-pending-review">{t("Dashboard.forms.statuses.has-pending-review")}</SelectItem>
                          <SelectItem value="rejected">{t("Dashboard.forms.statuses.rejected")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel>{t("Dashboard.forms.labels.featured")}</FormLabel>
                      <FormControl>
                        <Switch name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {children}
      </form>
    </Form>
  );
}

const TranslationFields = ({ control, path }: { control: Control<TermFormValues>; path: `content.default.${"en" | "ar"}` | `content.more.${number}` }) => {
  const t = useTranslations("Dashboard.forms.labels");
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={`${path}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("name")}</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${path}.briefDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("briefDescription")}</FormLabel>
            <FormControl>
              <Textarea rows={3} {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${path}.fullDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("fullDescription")}</FormLabel>
            <FormControl>
              <Textarea rows={6} {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
      <ReferencesField control={control} path={`${path}.references`} />
    </div>
  );
};

const ReferencesField = ({ control, path }: { control: Control<TermFormValues>; path: `content.default.${"en" | "ar"}.references` | `content.more.${number}.references` }) => {
  const t = useTranslations("Dashboard.forms.labels");
  const { fields, append, remove } = useFieldArray({
    control,
    name: path,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{t("references")}</h4>
        <Button type="button" variant="ghost" size="sm" onClick={() => append({ content: "", url: "" })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("addReference")}
        </Button>
      </div>
      {fields.map((item, index) => (
        <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 p-3 border rounded-md bg-muted/50">
          <FormField
            control={control}
            name={`${path}.${index}.content`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("referenceContent")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`${path}.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("referenceUrl")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
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
};
