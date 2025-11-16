import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { ReferencesField } from "@app/dashboard/___blocks/references-field";
import { TermTranslationFormSchema } from "@app/dashboard/terms/term.schema";
import { suggestNewTermAction } from "@app/public-actions";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { setServerErrors } from "@lib/form-helpers";
import { TermCategoryOption } from "@root/dal/dal.types";
import { CsrfInput } from "@waelhabbaldev/next-jwt-auth/client";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SuggestTranslationFormSchema = TermTranslationFormSchema;

const NewTermSuggestionSchema = z.object({
  categoryRef: z.coerce.number<number>().min(1, "Please select a category."),
  content: z.object({
    default: z.object({
      en: SuggestTranslationFormSchema,
      ar: SuggestTranslationFormSchema,
    }),
  }),
});
type SuggestionFormValues = z.infer<typeof NewTermSuggestionSchema>;

export function SuggestTermDialog({ categories, children }: { categories: TermCategoryOption[]; children: React.ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(suggestNewTermAction, { success: false, errors: {} as any });
  const [isPending, submitTransition] = useTransition();

  const t = useTranslations("Public.suggestDialog");
  const tCommon = useTranslations("Common");
  const tLabels = useTranslations("Dashboard.forms.labels");
  const { setCsrfToken } = useReactiveCsrf();

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(NewTermSuggestionSchema),
    defaultValues: {
      categoryRef: 0,
      content: {
        default: {
          en: { name: "", briefDescription: "", fullDescription: "", references: [] },
          ar: { name: "", briefDescription: "", fullDescription: "", references: [] },
        },
      },
    },
  });

  useEffect(() => {
    if (state.newCsrfToken) {
      setCsrfToken(state.newCsrfToken);
    }

    if (state.success) {
      toast.success(state.message);
      setIsOpen(false);
      form.reset();
    } else if (!state.success && state.message) {
      setServerErrors(state.errors, form.setError);
      toast.error(state.message);
    }
  }, [state, form, setCsrfToken]);

  const contentValue = useWatch({
    control: form.control,
    name: "content",
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            onSubmit={form.handleSubmit(() => {
              submitTransition(() => {
                formAction(new FormData(formRef.current!));
              });
            })}
            className="space-y-4"
          >
            <CsrfInput />
            <input type="hidden" name="content" value={JSON.stringify(contentValue)} />
            <FormField
              control={form.control}
              name="categoryRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("categoryLabel")}</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value > 0 ? String(field.value) : ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("categoryPlaceholder")} />
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
            <Tabs defaultValue="en" className="pt-2">
              <TabsList>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent forceMount value="en" className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="content.default.en.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* FIX 3: Add Brief Description field for English */}
                <FormField
                  control={form.control}
                  name="content.default.en.briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("briefDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.default.en.fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("fullDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <ReferencesField control={form.control} path="content.default.en.references" />
              </TabsContent>
              <TabsContent forceMount value="ar" className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="content.default.ar.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* FIX 4: Add Brief Description field for Arabic */}
                <FormField
                  control={form.control}
                  name="content.default.ar.briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("briefDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.default.ar.fullDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{tLabels("fullDescription")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <ReferencesField control={form.control} path="content.default.ar.references" />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" size="lg" disabled={isPending}>
              {isPending ? tCommon("saving") : t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
