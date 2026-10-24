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
import { TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { blogPostSaveAction } from "../actions";
import { BlogPostFormSchema } from "../post.schema";
import { BlogPostFormState, BlogPostFormValues } from "../post.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared ActionState initial-state pattern.
const initialFormState: BlogPostFormState = { success: false, errors: {} as any };

interface BlogPostFormProps {
  initialData: Partial<BlogPostFormValues>;
  categories: TermCategoryOption[];
  tags: TagOption[];
  children: React.ReactNode;
}

export function BlogPostForm({ initialData, categories, tags, children }: BlogPostFormProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [state, formAction] = useActionState(blogPostSaveAction, initialFormState);
  const [, startTransition] = useTransition();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(BlogPostFormSchema),
    defaultValues: {
      slug: "",
      isActive: true,
      isFeatured: false,
      displayOrder: 0,
      tagIds: [],
      content: { title: { en: "", ar: "" }, excerpt: { en: "", ar: "" }, body: { en: "", ar: "" }, coverImageUrl: "", date: "", readTime: "" },
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

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      const fd = new FormData();
      const csrf = document.querySelector('input[name="csrf_token"]') as HTMLInputElement | null;
      if (csrf) fd.append("csrf_token", csrf.value);
      if (values.postId) fd.append("postId", String(values.postId));
      fd.append("slug", values.slug);
      if (values.categoryRef) fd.append("categoryRef", String(values.categoryRef));
      fd.append("displayOrder", String(values.displayOrder ?? 0));
      fd.append("isActive", values.isActive ? "on" : "");
      fd.append("isFeatured", values.isFeatured ? "on" : "");
      fd.append("content", JSON.stringify(values.content));
      fd.append("tagIds", JSON.stringify(values.tagIds ?? []));
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
                <CardTitle>{t("Dashboard.forms.labels.postContent")}</CardTitle>
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
                        name={`content.excerpt.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Dashboard.forms.labels.excerpt")}</FormLabel>
                            <FormControl>
                              <Textarea rows={3} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`content.body.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Dashboard.forms.labels.body")}</FormLabel>
                            <FormControl>
                              <Textarea rows={10} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.slug")}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="foresight-in-the-arab-world" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="content.coverImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.coverImageUrl")}</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value ?? ""} placeholder="https://…" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
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
                  <FormField
                    control={control}
                    name="content.readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.readTime")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="3 min read" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                  name="tagIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Dashboard.forms.labels.tags")}</FormLabel>
                      <MultiSelectCombobox options={tagOptions} selected={field.value || []} onChange={field.onChange} placeholder={t("Dashboard.forms.placeholders.selectTags")} />
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
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <FormLabel className="mb-0 cursor-pointer">{t("Dashboard.forms.labels.featured")}</FormLabel>
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
