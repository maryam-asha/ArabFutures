import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getIdFromParams } from "@lib/action-handler";
import { findCategoryById } from "@root/dal/termCategories-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "../___blocks/category-form";
import { CategoryFormValues } from "../category.types";

export default async function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const categoryId = await getIdFromParams(params, "categoryId");
  const category = await findCategoryById(categoryId);

  if (!category) notFound();

  const t = await getTranslations();

  const initialDataForForm: Partial<CategoryFormValues> = { ...category, translations: {} };
  for (const loc of i18nAppConfig.locales) {
    initialDataForForm.translations![loc] = { name: category.name?.[loc] || "" };
  }

  const categoryName = category.name?.[i18nAppConfig.defaultLocale] || `Category #${categoryId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.categories.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.categories.editDescription", { entityName: categoryName })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <CategoryForm initialData={initialDataForForm}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/term-categories">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </CategoryForm>
      </FormPageContent>
    </FormPage>
  );
}
