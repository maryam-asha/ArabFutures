import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { CategoryForm } from "../___blocks/category-form";

export default async function CreateCategoryPage() {
  const t = await getTranslations();

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.categories.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.categories.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <CategoryForm initialData={{}}>
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
