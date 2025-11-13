import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { TermForm } from "../___blocks/term-form";

export default async function CreateTermPage() {
  const [categories, tags] = await Promise.all([findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);
  const t = await getTranslations();

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.terms.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.terms.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <TermForm initialData={{}} categories={categories} tags={tags}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/terms">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </TermForm>
      </FormPageContent>
    </FormPage>
  );
}
