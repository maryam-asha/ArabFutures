import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig from "@i18n/config";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";

import { TermForm } from "../___blocks/term-form";

export default async function CreateTermPage() {
  const [categories, tags] = await Promise.all([findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lexicon Term</CardTitle>
        <CardDescription>Fill out the details for your new term.</CardDescription>
      </CardHeader>
      <CardContent>
        <TermForm initialData={{}} categories={categories} tags={tags} />
      </CardContent>
    </Card>
  );
}
