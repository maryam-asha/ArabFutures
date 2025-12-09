import { DataTable } from "@app/dashboard/___blocks/data-table";
import { DataTablePage } from "@app/dashboard/___blocks/data-table-page";
import { Button } from "@components/ui/button";
import { findTermCategories } from "@root/dal/termCategories-dx";
import i18nAppConfig from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { ToastHandler } from "../___blocks/toast-handler";
import { columns } from "./___blocks/category-table-columns";
import { termCategoryBulkDeleteAction } from "./action";

interface TermCategoriesPageProps {
  searchParams: SearchParamsProps;
}

export default async function TermCategoriesPage(props: TermCategoriesPageProps) {
  const t = await getTranslations("Dashboard.pages.categories");
  const searchParamsObject = await props.searchParams;

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data: categories, totalCount } = await findTermCategories({
    locale: i18nAppConfig.defaultLocale,
    limit,
    offset,
    query,
  });

  const categoryBulkActions: BulkAction[] = [{ label: "delete", action: termCategoryBulkDeleteAction, isDestructive: true }];

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("title")}</DataTablePage.Title>
          <DataTablePage.Actions>
            <Button asChild>
              <Link href="/dashboard/term-categories/create">
                <Plus className="w-4 h-4 me-2" />
                {t("addTitle")}
              </Link>
            </Button>
          </DataTablePage.Actions>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={columns} data={categories} totalCount={totalCount} filterColumnId="name" bulkActions={categoryBulkActions} pkColumn="categoryId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
