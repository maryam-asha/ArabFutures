import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { TagForm } from "../___blocks/tag-form";

export default async function CreateTagPage() {
  const t = await getTranslations();

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.tags.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.tags.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <TagForm initialData={{}}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/tags">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </TagForm>
      </FormPageContent>
    </FormPage>
  );
}
