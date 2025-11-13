import { DataTable } from "@app/dashboard/___blocks/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { findReviewsByStatus } from "@root/dal/reviews-dx";
import { getTranslations } from "next-intl/server";

import { reviewColumns } from "./___blocks/review-table-columns";

export default async function ReviewsPage() {
  const t = await getTranslations("Dashboard.pages.reviews");

  const pendingReviews = await findReviewsByStatus("pending");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t("pendingTitle")}</CardTitle>
          <CardDescription>{t("pendingDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={reviewColumns} data={pendingReviews} totalCount={pendingReviews.length} pkColumn="reviewId" />
        </CardContent>
      </Card>
    </div>
  );
}
