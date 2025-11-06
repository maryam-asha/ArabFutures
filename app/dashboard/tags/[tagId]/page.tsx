import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getIdFromParams } from "@lib/action-handler";
import { findTagById } from "@root/dal/tags-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { TagForm } from "../___blocks/tag-form";
import { TagForm as TagFormType } from "../tag.types";

export default async function EditTagPage({ params }: { params: Promise<{ tagId: string }> }) {
  const tagId = await getIdFromParams(params, "tagId");
  const tag = await findTagById(tagId);
  const tTags = await getTranslations("Dashboard.pages.tags");

  if (!tag) {
    notFound();
  }

  const initialDataForForm: Partial<TagFormType> = {
    tagId: tag.tagId,
    translations: {},
  };
  for (const loc of i18nAppConfig.locales) {
    initialDataForForm.translations![loc] = {
      name: tag.name?.[loc] || "",
    };
  }

  const tagName = tag.name?.[i18nAppConfig.defaultLocale] || `Tag #${tagId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTags("editTitle")}</CardTitle>
        <CardDescription>{tTags("editDescription", { entityName: tagName })}</CardDescription>
      </CardHeader>
      <CardContent>
        <TagForm initialData={initialDataForForm} />
      </CardContent>
    </Card>
  );
}
