import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getIdFromParams } from "@lib/action-handler";
import { findCategoryById } from "@root/dal/termCategories-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { CategoryForm } from "../___blocks/category-form";

export default async function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const categoryId = await getIdFromParams(params, "categoryId");
  const category = await findCategoryById(categoryId);

  const tCategories = await getTranslations("Dashboard.pages.categories");

  if (!category) {
    notFound();
  }

  const categoryName = category.translations?.[i18nAppConfig.defaultLocale]?.name || `Category #${categoryId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCategories("editTitle")}</CardTitle>
        <CardDescription>{tCategories("editDescription", { entityName: categoryName })}</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={category} />
      </CardContent>
    </Card>
  );
}
