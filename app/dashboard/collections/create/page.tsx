import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { CollectionForm } from "../___blocks/collection-form";

export default async function CreateCollectionPage() {
  const t = await getTranslations();

  return (
    <FormPage isEditMode={false}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.collections.addTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.collections.addDescription")}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <CollectionForm initialData={{}}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/collections">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </CollectionForm>
      </FormPageContent>
    </FormPage>
  );
}
