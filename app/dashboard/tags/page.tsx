import { DataTable } from "@app/dashboard/___blocks/data-table";
import { DataTablePage } from "@app/dashboard/___blocks/data-table-page";
import { columns } from "@app/dashboard/tags/___blocks/tag-table-columns";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { findTags } from "@root/dal/tags-dx";
import { SearchParamsProps } from "@root/types";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { ToastHandler } from "../___blocks/toast-handler";
import { tagBulkDeleteAction } from "./actions";

interface TagsPageProps {
  searchParams: SearchParamsProps;
}

export default async function TagsPage(props: TagsPageProps) {
  const searchParamsObject = await props.searchParams;

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data: tags, totalCount } = await findTags({
    locale: i18nAppConfig.defaultLocale,
    limit,
    offset,
    query,
  });

  const t = await getTranslations("Dashboard");
  const tagBulkActions: BulkAction[] = [{ label: "delete", action: tagBulkDeleteAction, isDestructive: true }];

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("pages.tags.title")}</DataTablePage.Title>
          <DataTablePage.Actions>
            <Button asChild>
              <Link href="/dashboard/tags/create">
                <Plus className="w-4 h-4 me-2" />
                {t("pages.tags.addTitle")}
              </Link>
            </Button>
          </DataTablePage.Actions>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={columns} data={tags} totalCount={totalCount} filterColumnId="name" filterColumnPlaceholder={t("forms.placeholders.search")} bulkActions={tagBulkActions} pkColumn="tagId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
