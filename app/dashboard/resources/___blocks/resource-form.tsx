"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { MultiSelectCombobox } from "@app/dashboard/___blocks/multi-select-combobox";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig from "@i18n/config";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import { CollectionOption, TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { resourceSaveAction } from "../actions";
import { ResourceFormSchema } from "../resource.schema";
import { ResourceFormState, ResourceFormValues } from "../resource.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared ActionState initial-state pattern.
const initialFormState: ResourceFormState = { success: false, errors: {} as any };

const RESOURCE_TYPES = ["book", "article", "report", "video"] as const;

interface ResourceFormProps {
  initialData: Partial<ResourceFormValues>;
  categories: TermCategoryOption[];
  tags: TagOption[];
  collections: CollectionOption[];
  children: React.ReactNode;
}

export function ResourceForm({ initialData, categories, tags, collections, children }: ResourceFormProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [state, formAction] = useActionState(resourceSaveAction, initialFormState);
  const [, startTransition] = useTransition();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(ResourceFormSchema),
    defaultValues: {
      type: "article",
      language: "",
      isActive: true,
      displayOrder: 0,
      tagIds: [],
      collectionIds: [],
      content: { title: { en: "", ar: "" }, description: { en: "", ar: "" }, authors: [], imageUrl: "", url: "", date: "" },
      ...initialData,
    },
  });

  const { control, setError } = form;

  useEffect(() => {
    if (state.newCsrfToken) setCsrfToken(state.newCsrfToken);
    if (!state.success && state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(t(state.message));
    }
  }, [state, setError, setCsrfToken]);

  const tagOptions = tags.map((tg) => ({ value: tg.tagId, label: tg.name }));
  const collectionOptions = collections.map((c) => ({ value: c.collectionId, label: c.name }));

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      const fd = new FormData();
      const csrf = document.querySelector('input[name="csrf_token"]') as HTMLInputElement | null;
      if (csrf) fd.append("csrf_token", csrf.value);
      if (values.resourceId) fd.append("resourceId", String(values.resourceId));
      fd.append("type", values.type);
      if (values.categoryRef) fd.append("categoryRef", String(values.categoryRef));
      fd.append("language", values.language ?? "");
      fd.append("displayOrder", String(values.displayOrder ?? 0));
      fd.append("isActive", values.isActive ? "on" : "");
      fd.append("content", JSON.stringify(values.content));
      fd.append("tagIds", JSON.stringify(values.tagIds ?? []));
      fd.append("collectionIds", JSON.stringify(values.collectionIds ?? []));
      formAction(fd);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CsrfInput />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.resourceContent")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
                  <TabsList>
                    {i18nAppConfig.locales.map((loc) => {
                      const hasError = !!form.formState.errors.content?.title?.[loc];
                      return (
                        <TabsTrigger key={loc} value={loc} className={cn(hasError && "text-destructive")}>
                          {i18nAppConfig.labels[loc]} {hasError && "*"}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {i18nAppConfig.locales.map((loc) => (
                    <TabsContent key={loc} value={loc} className="space-y-4 pt-4" forceMount>
                      <FormField
                        control={control}
                        name={`content.title.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("Dashboard.forms.labels.title")} ({i18nAppConfig.labels[loc]})
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
                        name={`content.description.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("Dashboard.forms.labels.briefDescription")} ({i18nAppConfig.labels[loc]})
                            </FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                </Tabs>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="content.authors"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>{t("Dashboard.forms.labels.authors")}</FormLabel>
                        <FormControl>
                          <Input
                            value={(field.value ?? []).join(", ")}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean),
                              )
                            }
                            placeholder="Author Name, Author Name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="content.imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.imageUrl")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="https://…" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="content.url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.resourceUrl")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="https://…" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="content.date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.resourceDate")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="Jan 10, 2024" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.resourceType")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RESOURCE_TYPES.map((rt) => (
                            <SelectItem key={rt} value={rt}>
                              {t(`Dashboard.forms.resourceTypes.${rt}`)}
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
                  name="categoryRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.category")}</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value ? String(field.value) : ""}>
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
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.language")}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="ar / en" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.themes")}</FormLabel>
                      <MultiSelectCombobox options={tagOptions} selected={field.value || []} onChange={field.onChange} placeholder={t("Dashboard.forms.placeholders.selectTags")} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="collectionIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.collections")}</FormLabel>
                      <MultiSelectCombobox options={collectionOptions} selected={field.value || []} onChange={field.onChange} placeholder={t("Dashboard.forms.placeholders.selectCollections")} />
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
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="mb-0 cursor-pointer">{field.value ? t("Dashboard.forms.labels.active") : t("Dashboard.forms.labels.inactive")}</FormLabel>
                      <FormControl>
                        <Switch name={field.name} checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
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
              </CardContent>
            </Card>
          </div>
        </div>

        {children}
      </form>
    </Form>
  );
}
