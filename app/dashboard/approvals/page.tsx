import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { SearchParamsProps } from "@root/types";
import { getTranslations } from "next-intl/server";

import { DataTable } from "../___blocks/data-table";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { termBulkDeleteAction, termsBulkUpdateAction } from "../terms/actions";
import { approvalColumns } from "./___blocks/approvals-table-columns";

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

  const approvalBulkActions: BulkAction[] = [
    { label: "approve", action: termsBulkUpdateAction, actionType: "approve" },
    { label: "delete", action: termBulkDeleteAction, isDestructive: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("sidebar.approvals")}</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={approvalColumns} data={pendingTerms} totalCount={totalCount} filterColumnId="name" filterColumnPlaceholder={t("forms.placeholders.search")} bulkActions={approvalBulkActions} pkColumn="termId" />
      </div>
    </div>
  );
}
