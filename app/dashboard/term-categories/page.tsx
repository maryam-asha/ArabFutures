import { Button } from "@components/ui/button";
import { findTermCategories } from "@root/dal/termCategories-dx";
import { Plus } from "lucide-react";
import Link from "next/link";

import { DataTable } from "../___blocks/data-table";
import { columns } from "./___blocks/category-table-columns";

export default async function TermCategoriesPage() {
  const categories = await findTermCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Term Categories</h1>
        <Button asChild>
          <Link href="/dashboard/term-categories/create">
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={columns} data={categories} filterColumnId="name" filterColumnPlaceholder="Filter by category name..." />
      </div>
    </div>
  );
}
