"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { MultiSelectCombobox } from "@app/dashboard/___blocks/multi-select-combobox";
import { SubmitButton } from "@app/dashboard/___blocks/submit-button";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { TagOption, TermCategoryOption } from "@root/dal/dal.types";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { PlusCircle, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { termSaveAction } from "../actions";
import { TermFormSchema } from "../term.schema";
import { TermFormState, TermForm as TermFormType } from "../term.types";

const initialFormState: TermFormState = { success: false, errors: {} as any };

interface TermFormProps {
  initialData: Partial<TermFormType>;
  categories: TermCategoryOption[];
  tags: TagOption[];
}

export function TermForm({ initialData, categories, tags }: TermFormProps) {
  const isEditMode = !!initialData?.termId;
  const router = useRouter();
  const locale = useLocale();
  const [state, formAction] = useActionState(termSaveAction, initialFormState);
  const { setCsrfToken } = useReactiveCsrf();

  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");

  const form = useForm<TermFormType>({
    resolver: zodResolver(TermFormSchema),
    defaultValues: {
      status: "pending",
      isFeatured: false,
      tags: [],
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

  const {
    control,
    formState: { errors },
    setError,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "content.more",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (!state.success && state.message) {
      if (state.newCsrfToken) setCsrfToken(state.newCsrfToken);
      setServerErrors(state.errors, setError);
      toast.error(state.message);
    }
  }, [state, setError, setCsrfToken]);

  const tagOptions = tags.map((t) => ({ value: t.tagId, label: t.name }));

  return (
    <Form {...form}>
      <form action={formAction} className="space-y-8">
        {isEditMode && <input type="hidden" {...form.register("termId")} />}
        <CsrfInput />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* --- DEFAULT TRANSLATIONS --- */}
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.labels.defaultTranslations")}</CardTitle>
                <CardDescription>{t("forms.helpers.defaultTranslations")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="en">
                  <TabsList>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ar">Arabic</TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="pt-4">
                    <TranslationFields control={control} path="content.default.en" />
                  </TabsContent>
                  <TabsContent value="ar" className="pt-4">
                    <TranslationFields control={control} path="content.default.ar" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* --- MORE TRANSLATIONS --- */}
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <div>
                  <CardTitle>{t("forms.labels.moreTranslations")}</CardTitle>
                  <CardDescription>{t("forms.helpers.moreTranslations")}</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => append({ locale: "", name: "" })}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {t("forms.labels.addTranslation")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="p-4 border rounded-lg relative">
                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <FormField
                      control={control}
                      name={`content.more.${index}.locale`}
                      render={({ field }) => (
                        <FormItem className="mb-4 w-1/2">
                          <FormLabel>{t("forms.labels.localeIdentifier")}</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., fr, ar-latn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <TranslationFields control={control} path={`content.more.${index}`} />
                  </div>
                ))}
                {fields.length === 0 && <p className="text-sm text-center text-muted-foreground py-4">{t("forms.helpers.noExtraTranslations")}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 lg:sticky lg:top-24">
            {/* --- ORGANIZATION --- */}
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.labels.organization")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="categoryRef"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("forms.labels.category")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value ? String(field.value) : ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("forms.placeholders.selectCategory")} />
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
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("forms.labels.tags")}</FormLabel>
                      <MultiSelectCombobox options={tagOptions} selected={field.value || []} onChange={field.onChange} placeholder={t("forms.placeholders.selectTags")} />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* --- VISIBILITY --- */}
            <Card>
              <CardHeader>
                <CardTitle>{t("forms.labels.visibility")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("forms.labels.status")}</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="published">{t("forms.statuses.published")}</SelectItem>
                          <SelectItem value="pending">{t("forms.statuses.pending")}</SelectItem>
                          <SelectItem value="has-pending-review">{t("forms.statuses.has-pending-review")}</SelectItem>
                          <SelectItem value="rejected">{t("forms.statuses.rejected")}</SelectItem>
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
                      <FormLabel>{t("forms.labels.featured")}</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" size="lg" onClick={() => router.back()} type="button">
            {tCommon("actions.cancel")}
          </Button>
          <SubmitButton isEditMode={isEditMode} />
        </div>
      </form>
    </Form>
  );
}

// Reusable component for translation fields
const TranslationFields = ({ control, path }: { control: any; path: string }) => {
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
              <Input {...field} />
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
              <Textarea rows={3} {...field} />
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
              <Textarea rows={6} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
