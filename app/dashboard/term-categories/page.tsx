import { Button } from "@components/ui/button";
import { findTermCategories } from "@root/dal/termCategories-dx";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { BulkAction } from "../___blocks/data-table/data-table.type";
import { columns } from "./___blocks/category-table-columns";
import { termCategoryBulkDeleteAction } from "./action";

export default async function TermCategoriesPage() {
  const categories = await findTermCategories();
  const tCategories = await getTranslations("Dashboard.pages.categories");
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
        <DataTable columns={columns} data={categories} filterColumnId="name" bulkActions={[]} pkColumn="categoryId" />
      </div>
    </div>
  );
}
