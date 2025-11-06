import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findTermById } from "@root/dal/terms-dx";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { TermForm } from "../___blocks/term-form";
import { termSaveAction } from "../actions";
import { TermForm as TermFormType } from "../term.types";

export default async function EditTermPage({ params }: { params: Promise<{ termId: string }> }) {
  const termId = await getIdFromParams(params, "termId");
  const locale = (await getLocale()) as AppLocale;
  const [term, categories, tags] = await Promise.all([findTermById(termId, locale), findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);

  const tTerms = await getTranslations("Dashboard.pages.terms");

  if (!term) {
    notFound();
  }

  const initialDataForForm: Partial<TermFormType> = {
    termId: term.termId,
    status: term.status,
    isFeatured: term.isFeatured,
    categoryRef: term.categoryRef ?? 0,
    tags: term.tagIds,
    translations: {},
  };

  for (const loc of i18nAppConfig.locales) {
    const titleEntry = term.title?.[loc]?.[0];
    initialDataForForm.translations![loc] = {
      title: titleEntry?.value || "",
      references: titleEntry?.references || [],
      briefDescription: term.briefDescription?.[loc] || "",
      fullDetail: term.fullDetail?.[loc] || "",
    };
  }

  const defaultLocaleTitle = term.title?.[i18nAppConfig.defaultLocale]?.[0]?.value;
  const termTitle = defaultLocaleTitle || `Term #${termId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTerms("editTitle")}</CardTitle>
        <CardDescription>{tTerms("editDescription", { entityName: termTitle })}</CardDescription>
      </CardHeader>
      <CardContent>
        <TermForm initialData={initialDataForForm} categories={categories} tags={tags} mode="dashboard" action={termSaveAction} />
      </CardContent>
    </Card>
  );
}
