import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { Button } from "@components/ui/button";
import { getIdFromParams } from "@lib/action-handler";
import { findTagById } from "@root/dal/tags-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TagForm } from "../___blocks/tag-form";
import { TagFormValues } from "../tag.types";

export default async function EditTagPage({ params }: { params: Promise<{ tagId: string }> }) {
  const tagId = await getIdFromParams(params, "tagId");
  const tag = await findTagById(tagId);

  if (!tag) notFound();

  const t = await getTranslations();

  const initialDataForForm: Partial<TagFormValues> = {
    tagId: tag.tagId,
    translations: {},
  };
  for (const loc of i18nAppConfig.locales) {
    initialDataForForm.translations![loc] = { name: tag.name?.[loc] || "" };
  }

  const tagName = tag.name?.[i18nAppConfig.defaultLocale] || `Tag #${tagId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.tags.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.tags.editDescription", { entityName: tagName })}</FormPageDescription>
      </FormPageHeader>
      <FormPageContent>
        <TagForm initialData={initialDataForForm}>
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
