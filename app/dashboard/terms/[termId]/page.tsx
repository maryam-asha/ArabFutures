import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findTermById } from "@root/dal/terms-dx";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { TermForm } from "../___blocks/term-form";
import { TermForm as TermFormType } from "../term.types";

export default async function EditTermPage({ params }: { params: Promise<{ termId: string }> }) {
  const termId = await getIdFromParams(params, "termId");
  const locale = (await getLocale()) as AppLocale;

  const [term, categories, tags] = await Promise.all([findTermById(termId), findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);

  if (!term) {
    notFound();
  }

  const tTerms = await getTranslations("Dashboard.pages.terms");

  // Transform the database object into the shape the form expects
  const initialDataForForm: Partial<TermFormType> = {
    termId: term.termId,
    status: term.status,
    isFeatured: term.isFeatured,
    categoryRef: term.categoryRef ?? 0,
    tags: term.tagIds,
    content: term.content, // The content object now maps directly
  };

  const termName = term.content.default[i18nAppConfig.defaultLocale]?.name || `Term #${termId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTerms("editTitle")}</CardTitle>
        <CardDescription>{tTerms("editDescription", { entityName: termName })}</CardDescription>
      </CardHeader>
      <CardContent>
        <TermForm initialData={initialDataForForm} categories={categories} tags={tags} />
      </CardContent>
    </Card>
  );
}
