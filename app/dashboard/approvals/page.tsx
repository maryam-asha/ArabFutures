import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { SearchParamsProps } from "@root/types";
import { getTranslations } from "next-intl/server";

import { DataTable } from "../___blocks/data-table";
import { DataTablePage } from "../___blocks/data-table-page";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { ToastHandler } from "../___blocks/toast-handler";
import { termBulkDeleteAction, termsBulkUpdateAction } from "../terms/actions";
import { approvalColumns } from "./___blocks/approvals-table-columns";

const approvalBulkActions: BulkAction[] = [
  { label: "approve", action: termsBulkUpdateAction, actionType: "approve" },
  { label: "delete", action: termBulkDeleteAction, isDestructive: true },
];

export default async function ApprovalsPage(params: { searchParams: SearchParamsProps }) {
  const searchParamsObject = await params.searchParams;
  const t = await getTranslations("Dashboard");

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data: pendingTerms, totalCount } = await findTerms({
    locale: i18nAppConfig.defaultLocale,
    status: "pending",
    limit,
    offset,
    query,
  });

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("pages.approvals.title")}</DataTablePage.Title>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={approvalColumns} data={pendingTerms} totalCount={totalCount} filterColumnId="name" filterColumnPlaceholder={t("forms.placeholders.search")} bulkActions={approvalBulkActions} pkColumn="termId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
