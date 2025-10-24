import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findTermById } from "@root/dal/terms-dx";
import { notFound } from "next/navigation";

import { TermForm } from "../___blocks/term-form";

export default async function EditTermPage({ params }: { params: Promise<{ termId: string }> }) {
  const termId = await getIdFromParams(params, "termId");

  // Fetch the term data and the form options in parallel
  const [term, categories, tags] = await Promise.all([findTermById(termId), findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);

  if (!term) {
    notFound();
  }

  const termTitle = term.translations?.[i18nAppConfig.defaultLocale]?.title || `Term #${termId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Lexicon Term</CardTitle>
        <CardDescription>Modify the details for "{termTitle}".</CardDescription>
      </CardHeader>
      <CardContent>
        <TermForm initialData={term as any} categories={categories} tags={tags} />
      </CardContent>
    </Card>
  );
}
