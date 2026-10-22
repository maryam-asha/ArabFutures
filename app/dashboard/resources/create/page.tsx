import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { getCollectionOptionsAction } from "@app/dashboard/collections/actions";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { ResourceForm } from "../___blocks/resource-form";

export default async function CreateResourcePage() {
  const t = await getTranslations();
  const locale = i18nAppConfig.defaultLocale;
  const [categories, tags, collections] = await Promise.all([getActiveCategoryOptionsAction(locale), getTagOptionsAction(locale), getCollectionOptionsAction(locale)]);

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.resources.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.resources.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <ResourceForm initialData={{}} categories={categories} tags={tags} collections={collections}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/resources">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </ResourceForm>
      </FormPageContent>
    </FormPage>
  );
}
