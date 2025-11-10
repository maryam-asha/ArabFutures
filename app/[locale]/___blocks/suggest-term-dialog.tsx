"use client";

import { suggestNewTermAction } from "@app/public-actions";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { TermCategoryOption } from "@root/dal/dal.types";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// --- Client-side validation schema for the new suggestion form ---
const TermTranslationFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  briefDescription: z.string().trim().optional(),
});
const NewTermSuggestionSchema = z.object({
  categoryRef: z.coerce.number<number>().min(1, "Please select a category."),
  content: z.object({
    default: z.object({
      en: TermTranslationFormSchema,
      ar: TermTranslationFormSchema,
    }),
  }),
});
type SuggestionFormValues = z.infer<typeof NewTermSuggestionSchema>;

interface SuggestTermDialogProps {
  categories: TermCategoryOption[];
  children: React.ReactNode;
}

export function SuggestTermDialog({ categories, children }: SuggestTermDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction] = useActionState(suggestNewTermAction, { success: false, errors: {} as any });
  const t = useTranslations("Public.suggestDialog");
  const tCommon = useTranslations("Common");

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(NewTermSuggestionSchema),
    defaultValues: {
      categoryRef: 0,
      content: { default: { en: { name: "" }, ar: { name: "" } } },
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful && state.success) {
      toast.success(state.message);
      form.reset();
      setIsOpen(false);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [form, state, t]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <FormField
              control={form.control}
              name="categoryRef"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("categoryLabel")}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value > 0 ? String(field.value) : ""}>
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
              <TabsContent value="en" className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="content.default.en.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nameLabel")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.default.en.briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("briefDescriptionLabel")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="ar" className="space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="content.default.ar.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("nameLabel")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content.default.ar.briefDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("briefDescriptionLabel")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? tCommon("saving") : t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
