import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getTranslations } from "next-intl/server";

import { CategoryForm } from "../___blocks/category-form";

export default async function CreateCategoryPage() {
  const tCategories = await getTranslations("Dashboard.pages.categories");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCategories("addTitle")}</CardTitle>
        <CardDescription>{tCategories("addDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={{}} />
      </CardContent>
    </Card>
  );
}
