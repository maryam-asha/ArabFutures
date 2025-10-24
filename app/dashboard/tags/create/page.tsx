import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

import { TagForm } from "../___blocks/tag-form";

export default function CreateTagPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Tag</CardTitle>
        <CardDescription>Create a new tag to organize your lexicon terms.</CardDescription>
      </CardHeader>
      <CardContent>
        <TagForm initialData={{}} />
      </CardContent>
    </Card>
  );
}
