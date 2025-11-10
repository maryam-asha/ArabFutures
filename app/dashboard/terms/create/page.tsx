import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig from "@i18n/config";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { getTranslations } from "next-intl/server";

import { TermForm } from "../___blocks/term-form";

export default async function CreateTermPage() {
  const [categories, tags] = await Promise.all([findActiveCategoryOptions(i18nAppConfig.defaultLocale), findTagOptions(i18nAppConfig.defaultLocale)]);
  const tTerm = await getTranslations("Dashboard.pages.terms");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTerm("addTitle")}</CardTitle>
        <CardDescription>{tTerm("addDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TermForm
          // Pass an empty object for creation mode
          initialData={{}}
          categories={categories}
          tags={tags}
        />
      </CardContent>
    </Card>
  );
}
