import { Button } from "@components/ui/button";
import { findTermCategories } from "@root/dal/termCategories-dx";
import i18nAppConfig from "@root/i18n/config";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { columns } from "./___blocks/category-table-columns";
import { termCategoryBulkDeleteAction } from "./action";

export default async function TermCategoriesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const tCategories = await getTranslations("Dashboard.pages.categories");
  const { page: _page, limit: _limit, query: _query } = await searchParams;

  const page = Number(_page ?? "1");
  const limit = Number(_limit ?? "10");
  const query = (_query as string) ?? undefined;
  const offset = (page - 1) * limit;

  // Fetch paginated data from the updated DAL function
  const { data: categories, totalCount } = await findTermCategories({
    locale: i18nAppConfig.defaultLocale,
    limit,
    offset,
    query,
  });

  const categoryBulkActions: BulkAction[] = [{ label: "delete", action: termCategoryBulkDeleteAction, isDestructive: true }];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bo ld tracking-tight">{tCategories("title")}</h1>
        <Button asChild>
          <Link href="/dashboard/term-categories/create">
            <Plus className="w-4 h-4 me-2" />
            {tCategories("addTitle")}
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={columns} data={categories} totalCount={totalCount} filterColumnId="name" bulkActions={categoryBulkActions} pkColumn="categoryId" />
      </div>
    </div>
  );
}
