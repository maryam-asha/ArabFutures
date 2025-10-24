import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

import { CategoryForm } from "../___blocks/category-form";

export default async function CreateCategoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Term Category</CardTitle>
        <CardDescription>Fill out the details for your new category.</CardDescription>
      </CardHeader>
      <CardContent>
        <CategoryForm initialData={{}} />
      </CardContent>
    </Card>
  );
}
