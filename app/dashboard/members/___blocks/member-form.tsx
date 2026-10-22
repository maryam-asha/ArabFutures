"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Separator } from "@components/ui/separator";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import i18nAppConfig from "@i18n/config";
import { setServerErrors } from "@lib/form-helpers";
import { cn } from "@lib/utils";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useTransition } from "react";
import { Control, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { memberSaveAction } from "../actions";
import { MemberFormSchema } from "../member.schema";
import { MemberFormState, MemberFormValues } from "../member.types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- matches the shared ActionState initial-state pattern used across the dashboard forms.
const initialFormState: MemberFormState = { success: false, errors: {} as any };

const emptyWork = { imageUrl: "", type: "", date: "", readTime: "", url: "", title: { en: "", ar: "" }, description: { en: "", ar: "" }, tags: [] as string[] };
const emptyLink = { label: { en: "", ar: "" }, url: "" };

interface MemberFormProps {
  initialData: Partial<MemberFormValues>;
  children: React.ReactNode;
}

export function MemberForm({ initialData, children }: MemberFormProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [state, formAction] = useActionState(memberSaveAction, initialFormState);
  const [, startTransition] = useTransition();
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(MemberFormSchema),
    defaultValues: {
      slug: "",
      displayOrder: 0,
      isActive: true,
      isFeatured: false,
      content: {
        photoUrl: "",
        name: { en: "", ar: "" },
        role: { en: "", ar: "" },
        social: { email: "", linkedin: "", website: "" },
        roleWithinAsf: { en: "", ar: "" },
        professionalProfile: { en: "", ar: "" },
        favoriteWord: { word: { en: "", ar: "" }, explanation: { en: "", ar: "" } },
        works: [],
        links: [],
      },
      ...initialData,
    },
  });

  const { control, setError } = form;
  const works = useFieldArray({ control, name: "content.works" });
  const links = useFieldArray({ control, name: "content.links" });

  useEffect(() => {
    if (state.newCsrfToken) setCsrfToken(state.newCsrfToken);
    if (!state.success && state.message && state.errors) {
      setServerErrors(state.errors, setError);
      toast.error(t(state.message));
    }
  }, [state, setError, setCsrfToken]);

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      const fd = new FormData();
      const csrf = document.querySelector('input[name="csrf_token"]') as HTMLInputElement | null;
      if (csrf) fd.append("csrf_token", csrf.value);
      if (values.memberId) fd.append("memberId", String(values.memberId));
      fd.append("slug", values.slug);
      fd.append("displayOrder", String(values.displayOrder ?? 0));
      fd.append("isActive", values.isActive ? "on" : "");
      fd.append("isFeatured", values.isFeatured ? "on" : "");
      fd.append("content", JSON.stringify(values.content));
      formAction(fd);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <CsrfInput />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Identity */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.memberIdentity")}</CardTitle>
                <CardDescription>{t("Dashboard.forms.helpers.memberIdentity")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.slug")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="hassan-amer" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="content.photoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Dashboard.forms.labels.photoUrl")}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} placeholder="https://…" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
                  <TabsList>
                    {i18nAppConfig.locales.map((loc) => {
                      const hasError = !!form.formState.errors.content?.name?.[loc];
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
                        name={`content.name.${loc}` as const}
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
                      <FormField
                        control={control}
                        name={`content.role.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("Dashboard.forms.labels.role")} ({i18nAppConfig.labels[loc]})
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
              </CardContent>
            </Card>

            {/* Profile sections */}
            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.memberProfile")}</CardTitle>
                <CardDescription>{t("Dashboard.forms.helpers.memberProfile")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={i18nAppConfig.defaultLocale} dir={locale === "ar" ? "rtl" : "ltr"}>
                  <TabsList>
                    {i18nAppConfig.locales.map((loc) => (
                      <TabsTrigger key={loc} value={loc}>
                        {i18nAppConfig.labels[loc]}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {i18nAppConfig.locales.map((loc) => (
                    <TabsContent key={loc} value={loc} className="space-y-4 pt-4" forceMount>
                      <FormField
                        control={control}
                        name={`content.roleWithinAsf.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Dashboard.forms.labels.roleWithinAsf")}</FormLabel>
                            <FormControl>
                              <Textarea rows={4} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`content.professionalProfile.${loc}` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Dashboard.forms.labels.professionalProfile")}</FormLabel>
                            <FormControl>
                              <Textarea rows={5} {...field} value={field.value ?? ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4">
                        <FormField
                          control={control}
                          name={`content.favoriteWord.word.${loc}` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Dashboard.forms.labels.favoriteWord")}</FormLabel>
                              <FormControl>
                                <Input {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={control}
                          name={`content.favoriteWord.explanation.${loc}` as const}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Dashboard.forms.labels.favoriteWordWhy")}</FormLabel>
                              <FormControl>
                                <Textarea rows={2} {...field} value={field.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Selected works */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("Dashboard.forms.labels.selectedWorks")}</CardTitle>
                  <CardDescription>{t("Dashboard.forms.helpers.selectedWorks")}</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => works.append(emptyWork)}>
                  <PlusCircle className="h-4 w-4 me-2" />
                  {t("Dashboard.forms.labels.addWork")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {works.fields.map((item, index) => (
                  <div key={item.id} className="relative space-y-3 rounded-lg border p-4">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 end-2 text-muted-foreground hover:text-destructive" onClick={() => works.remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TextField control={control} name={`content.works.${index}.imageUrl`} label={t("Dashboard.forms.labels.imageUrl")} />
                      <TextField control={control} name={`content.works.${index}.url`} label={t("Dashboard.forms.labels.workUrl")} />
                      <TextField control={control} name={`content.works.${index}.type`} label={t("Dashboard.forms.labels.workType")} />
                      <div className="grid grid-cols-2 gap-3">
                        <TextField control={control} name={`content.works.${index}.date`} label={t("Dashboard.forms.labels.workDate")} />
                        <TextField control={control} name={`content.works.${index}.readTime`} label={t("Dashboard.forms.labels.workReadTime")} />
                      </div>
                    </div>
                    {i18nAppConfig.locales.map((loc) => (
                      <div key={loc} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TextField control={control} name={`content.works.${index}.title.${loc}`} label={`${t("Dashboard.forms.labels.title")} (${i18nAppConfig.labels[loc]})`} />
                        <TextField control={control} name={`content.works.${index}.description.${loc}`} label={`${t("Dashboard.forms.labels.briefDescription")} (${i18nAppConfig.labels[loc]})`} />
                      </div>
                    ))}
                    <FormField
                      control={control}
                      name={`content.works.${index}.tags`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Dashboard.forms.labels.workTags")}</FormLabel>
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
                              placeholder="Foresight Tools, Futures Literacies"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                {works.fields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">{t("Dashboard.forms.helpers.noWorks")}</p>}
              </CardContent>
            </Card>

            {/* Additional links */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("Dashboard.forms.labels.additionalLinks")}</CardTitle>
                  <CardDescription>{t("Dashboard.forms.helpers.additionalLinks")}</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => links.append(emptyLink)}>
                  <PlusCircle className="h-4 w-4 me-2" />
                  {t("Dashboard.forms.labels.addLink")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {links.fields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3 rounded-md border bg-muted/50 p-3">
                    <TextField control={control} name={`content.links.${index}.label.en`} label={`${t("Dashboard.forms.labels.linkLabel")} (${i18nAppConfig.labels.en})`} />
                    <TextField control={control} name={`content.links.${index}.label.ar`} label={`${t("Dashboard.forms.labels.linkLabel")} (${i18nAppConfig.labels.ar})`} />
                    <TextField control={control} name={`content.links.${index}.url`} label={t("Dashboard.forms.labels.referenceUrl")} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => links.remove(index)} className="self-end text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {links.fields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">{t("Dashboard.forms.helpers.noLinks")}</p>}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">
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

            <Card>
              <CardHeader>
                <CardTitle>{t("Dashboard.forms.labels.socialLinks")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField control={control} name="content.social.email" label={t("Dashboard.forms.labels.email")} />
                <TextField control={control} name="content.social.linkedin" label={t("Dashboard.forms.labels.linkedin")} />
                <TextField control={control} name="content.social.website" label={t("Dashboard.forms.labels.website")} />
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />
        {children}
      </form>
    </Form>
  );
}

/** Small controlled text input bound to any string path in the member form. */
function TextField({ control, name, label }: { control: Control<MemberFormValues>; name: Parameters<typeof control.register>[0]; label: string }) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs">{label}</FormLabel>
          <FormControl>
            <Input {...field} value={(field.value as string) ?? ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
