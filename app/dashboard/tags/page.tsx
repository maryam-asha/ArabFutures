import { DataTable } from "@app/dashboard/___blocks/data-table";
import { columns } from "@app/dashboard/tags/___blocks/tag-table-columns";
import { Button } from "@components/ui/button";
import { findTags } from "@root/dal/tags-dx";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { tagBulkDeleteAction } from "./actions";

export default async function TagsPage() {
  const tags = await findTags();
  const tTag = await getTranslations("Dashboard.pages.tags");
  const tActions = await getTranslations("Common.actions");
  const tPlaceholdlders = await getTranslations("Dashboard.forms.placeholders");
  const tagBulkActions: BulkAction[] = [{ label: "delete", action: tagBulkDeleteAction, isDestructive: true }];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{tTag("title")}</h1>
        <Button asChild>
          <Link href="/dashboard/tags/create">
            <Plus className="w-4 h-4 me-2" />
            {tActions("add")}
          </Link>
        </Button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <DataTable columns={columns} data={tags} filterColumnId="name" filterColumnPlaceholder={tPlaceholdlders("search")} pkColumn="tagId" />
      </div>
    </div>
  );
}
