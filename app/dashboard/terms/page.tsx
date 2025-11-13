import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { SearchParamsProps } from "@root/types";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { columns } from "./___blocks/term-table-columns";
import { termBulkDeleteAction, termsBulkUpdateAction } from "./actions";

const termBulkActions: BulkAction[] = [
  { label: "approve", action: termsBulkUpdateAction, actionType: "approve" },
  { label: "pending", action: termsBulkUpdateAction, actionType: "pend" },
  { label: "feature", action: termsBulkUpdateAction, actionType: "feature" },
  { label: "unfeature", action: termsBulkUpdateAction, actionType: "unfeature" },
  { label: "delete", action: termBulkDeleteAction, isDestructive: true },
];

export default async function TermsPage(props: { searchParams: SearchParamsProps }) {
  const searchParamsObject = await props.searchParams;

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data: terms, totalCount } = await findTerms({
    locale: i18nAppConfig.defaultLocale,
    limit,
    offset,
    query,
  });

  const t = await getTranslations("Dashboard");
  const tActions = await getTranslations("Common.actions");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("sidebar.terms")}</h1>
        <Button asChild>
          <Link href="/dashboard/terms/create">
            <Plus className="w-4 h-4 me-2" />
            {tActions("add")}
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={columns} data={terms} totalCount={totalCount} filterColumnId="content" filterColumnPlaceholder={t("forms.placeholders.search")} bulkActions={termBulkActions} pkColumn="termId" />
      </div>
    </div>
  );
}
