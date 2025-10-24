import { DataTable } from "@app/dashboard/___blocks/data-table";
import { columns } from "@app/dashboard/tags/___blocks/tag-table-columns";
import { Button } from "@components/ui/button";
import { findTags } from "@root/dal/tags-dx";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function TagsPage() {
  const tags = await findTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tags</h1>
        <Button asChild>
          <Link href="/dashboard/tags/create">
            <Plus className="w-4 h-4 mr-2" />
            Add New Tag
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={columns} data={tags} filterColumnId="name" filterColumnPlaceholder="Filter by tag name..." />
      </div>
    </div>
  );
}
