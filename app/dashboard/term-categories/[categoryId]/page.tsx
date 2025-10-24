import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getIdFromParams } from "@lib/action-handler";
import { findCategoryById } from "@root/dal/termCategories-dx";
import { notFound } from "next/navigation";

import { CategoryForm } from "../___blocks/category-form";

export default async function EditCategoryPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const categoryId = await getIdFromParams(params, "categoryId");
  const category = await findCategoryById(categoryId); // Assumes you create this function in termCategories-dx.ts

  if (!category) {
    notFound();
  }

  const categoryName = category.translations?.en?.name || `Category #${categoryId}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Term Category</CardTitle>
        <CardDescription>Modify the details for "{categoryName}".</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={category} />
      </CardContent>
    </Card>
  );
}

// You will also need to create the `findCategoryById` in `termCategories-dx.ts`
// which would be a simple SELECT query with a WHERE clause.
