import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getIdFromParams } from "@lib/action-handler";
import { findCollectionById } from "@root/dal/collections-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CollectionForm } from "../___blocks/collection-form";
import { CollectionFormValues } from "../collection.types";

export default async function EditCollectionPage({ params }: { params: Promise<{ collectionId: string }> }) {
  const collectionId = await getIdFromParams(params, "collectionId");
  const collection = await findCollectionById(collectionId);

  if (!collection) notFound();

  const t = await getTranslations();

  const initialData: Partial<CollectionFormValues> = {
    collectionId: collection.collectionId,
    isActive: collection.isActive,
    displayOrder: collection.displayOrder,
    translations: {},
  };
  for (const loc of i18nAppConfig.locales) {
    initialData.translations![loc] = { name: collection.name?.[loc] || "" };
  }

  const name = collection.name?.[i18nAppConfig.defaultLocale] || `Collection #${collectionId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.collections.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.collections.editDescription", { entityName: name })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <CollectionForm initialData={initialData}>
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
