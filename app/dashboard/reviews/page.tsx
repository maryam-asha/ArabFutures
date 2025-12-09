import { DataTable } from "@app/dashboard/___blocks/data-table";
import { findReviewsByStatus } from "@root/dal/reviews-dx";
import { getTranslations } from "next-intl/server";

import { DataTablePage } from "../___blocks/data-table-page";
import { ToastHandler } from "../___blocks/toast-handler";
import { reviewColumns } from "./___blocks/review-table-columns";

export default async function ReviewsPage() {
  const t = await getTranslations("Dashboard");

  const pendingReviews = await findReviewsByStatus("pending");

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("pages.reviews.title")}</DataTablePage.Title>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={reviewColumns} data={pendingReviews} totalCount={pendingReviews.length} pkColumn="reviewId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
