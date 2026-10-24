import { DataTable } from "@app/dashboard/___blocks/data-table";
import { DataTablePage } from "@app/dashboard/___blocks/data-table-page";
import { Button } from "@components/ui/button";
import { findBlogPosts } from "@root/dal/blog-dx";
import i18nAppConfig from "@root/i18n/config";
import { SearchParamsProps } from "@root/types";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

import { BulkAction } from "../___blocks/data-table/data-table.type";
import { ToastHandler } from "../___blocks/toast-handler";
import { columns } from "./___blocks/post-table-columns";
import { blogPostBulkDeleteAction } from "./actions";

export default async function BlogPostsPage(props: { searchParams: SearchParamsProps }) {
  const t = await getTranslations("Dashboard.pages.blog");
  const searchParamsObject = await props.searchParams;

  const page = Number(searchParamsObject?.page ?? "1");
  const limit = Number(searchParamsObject?.limit ?? "10");
  const query = (searchParamsObject?.query as string) ?? undefined;
  const offset = (page - 1) * limit;

  const { data, totalCount } = await findBlogPosts({ locale: i18nAppConfig.defaultLocale, limit, offset, query });

  const bulkActions: BulkAction[] = [{ label: "delete", action: blogPostBulkDeleteAction, isDestructive: true }];

  return (
    <>
      <ToastHandler />
      <DataTablePage>
        <DataTablePage.Header>
          <DataTablePage.Title>{t("title")}</DataTablePage.Title>
          <DataTablePage.Actions>
            <Button asChild>
              <Link href="/dashboard/blog/create">
                <Plus className="w-4 h-4 me-2" />
                {t("addTitle")}
              </Link>
            </Button>
          </DataTablePage.Actions>
        </DataTablePage.Header>
        <DataTablePage.Table>
          <DataTable columns={columns} data={data} totalCount={totalCount} filterColumnId="title" bulkActions={bulkActions} pkColumn="postId" />
        </DataTablePage.Table>
      </DataTablePage>
    </>
  );
}
