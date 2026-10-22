import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { getCollectionOptionsAction } from "@app/dashboard/collections/actions";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findResourceById } from "@root/dal/resources-dx";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ResourceForm } from "../___blocks/resource-form";
import { ResourceFormValues } from "../resource.types";

export default async function EditResourcePage({ params }: { params: Promise<{ resourceId: string }> }) {
  const resourceId = await getIdFromParams(params, "resourceId");
  const locale = i18nAppConfig.defaultLocale;

  const [resource, categories, tags, collections] = await Promise.all([findResourceById({ resourceId, locale }), getActiveCategoryOptionsAction(locale), getTagOptionsAction(locale), getCollectionOptionsAction(locale)]);

  if (!resource) notFound();

  const t = await getTranslations();
  const c = resource.content;

  const initialData: Partial<ResourceFormValues> = {
    resourceId: resource.resourceId,
    type: resource.type,
    categoryRef: resource.categoryRef ?? undefined,
    language: resource.language ?? "",
    isActive: resource.isActive,
    displayOrder: resource.displayOrder,
    tagIds: resource.tagIds,
    collectionIds: resource.collectionIds,
    content: {
      title: { en: c.title?.en ?? "", ar: c.title?.ar ?? "" },
      description: { en: c.description?.en ?? "", ar: c.description?.ar ?? "" },
      authors: c.authors ?? [],
      imageUrl: c.imageUrl ?? "",
      url: c.url ?? "",
      date: c.date ?? "",
    },
  };

  const title = c.title?.[locale] || c.title?.en || `Resource #${resourceId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.resources.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.resources.editDescription", { entityName: title })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <ResourceForm initialData={initialData} categories={categories} tags={tags} collections={collections}>
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
