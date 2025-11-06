import { DataTable } from "@app/dashboard/___blocks/data-table";
import { columns } from "@app/dashboard/tags/___blocks/tag-table-columns";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTags } from "@root/dal/tags-dx";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { tagBulkDeleteAction } from "./actions";

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const { page: _page, limit: _limit, query: _query } = await searchParams;

  const page = Number(_page ?? "1");
  const limit = Number(_limit ?? "10");
  const query = (_query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data: tags, totalCount } = await findTags({
    locale: i18nAppConfig.defaultLocale,
    limit,
    offset,
    query,
  });
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
        <DataTable columns={columns} data={tags} totalCount={totalCount} filterColumnId="name" filterColumnPlaceholder={tPlaceholdlders("search")} bulkActions={tagBulkActions} pkColumn="tagId" />
      </div>
    </div>
  );
}
