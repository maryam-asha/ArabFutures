import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getTranslations } from "next-intl/server";

import { TagForm } from "../___blocks/tag-form";

export default async function CreateTagPage() {
  const t = await getTranslations("Dashboard.pages.tags");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("addTitle")}</CardTitle>
        <CardDescription>{t("addDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <TagForm initialData={{}} />
      </CardContent>
    </Card>
  );
}
