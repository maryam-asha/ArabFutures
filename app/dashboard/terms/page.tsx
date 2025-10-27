import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { termColumns } from "./___blocks/term-table-columns";
import { termBulkDeleteAction, termsBulkUpdateAction } from "./actions";

const termBulkActions: BulkAction[] = [
  { label: "approve", action: termsBulkUpdateAction, actionType: "approve" },
  { label: "pending", action: termsBulkUpdateAction, actionType: "pend" },
  { label: "feature", action: termsBulkUpdateAction, actionType: "feature" },
  { label: "unfeature", action: termsBulkUpdateAction, actionType: "unfeature" },
  { label: "delete", action: termBulkDeleteAction, isDestructive: true },
];

export default async function TermsPage() {
  const terms = await findTerms({
    locale: i18nAppConfig.defaultLocale,
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
        <DataTable columns={termColumns} data={terms} filterColumnId="title" filterColumnPlaceholder={t("forms.labels.title")} bulkActions={termBulkActions} pkColumn="termId" />
      </div>
    </div>
  );
}
