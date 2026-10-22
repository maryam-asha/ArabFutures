import { DataTable } from "@app/dashboard/___blocks/data-table";
import { DataTablePage } from "@app/dashboard/___blocks/data-table-page";
import { Button } from "@components/ui/button";
import { findResources } from "@root/dal/resources-dx";
import i18nAppConfig from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { ToastHandler } from "../___blocks/toast-handler";
import { columns } from "./___blocks/resource-table-columns";
import { resourceBulkDeleteAction } from "./actions";

export default async function ResourcesPage(props: { searchParams: SearchParamsProps }) {
  const t = await getTranslations("Dashboard.pages.resources");
  const searchParamsObject = await props.searchParams;

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data, totalCount } = await findResources({ locale: i18nAppConfig.defaultLocale, limit, offset, query });

  const bulkActions: BulkAction[] = [{ label: "delete", action: resourceBulkDeleteAction, isDestructive: true }];

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("title")}</DataTablePage.Title>
          <DataTablePage.Actions>
            <Button asChild>
              <Link href="/dashboard/resources/create">
                <Plus className="w-4 h-4 me-2" />
                {t("addTitle")}
              </Link>
            </Button>
          </DataTablePage.Actions>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={columns} data={data} totalCount={totalCount} filterColumnId="title" bulkActions={bulkActions} pkColumn="resourceId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
