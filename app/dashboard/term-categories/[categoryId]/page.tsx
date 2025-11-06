import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getIdFromParams } from "@lib/action-handler";
import { findCategoryById } from "@root/dal/termCategories-dx";
import i18nAppConfig from "@root/i18n/config";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { CategoryForm } from "../___blocks/category-form";
import { CategoryForm as CategoryFormType } from "../category.types";

export default async function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const categoryId = await getIdFromParams(params, "categoryId");
  const category = await findCategoryById(categoryId);

  const tCategories = await getTranslations("Dashboard.pages.categories");

  if (!category) {
    notFound();
  }

  const initialDataForForm: Partial<CategoryFormType> = {
    ...category,
    translations: {},
  };
  for (const loc of i18nAppConfig.locales) {
    initialDataForForm.translations![loc] = {
      name: category.name?.[loc] || "",
    };
  }

  const categoryName = category.name?.[i18nAppConfig.defaultLocale] || `Category #${categoryId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCategories("editTitle")}</CardTitle>
        <CardDescription>{tCategories("editDescription", { entityName: categoryName })}</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={initialDataForForm} />
      </CardContent>
    </Card>
  );
}
