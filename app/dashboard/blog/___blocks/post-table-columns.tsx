"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import type { BlogPostDb } from "@root/dal/dal.types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { blogPostDeleteAction } from "../actions";

function SelectAllHeader({ table }: { table: Table<BlogPostDb> }) {
  return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />;
}

function LabelHeader({ token }: { token: string }) {
  const t = useTranslations("Dashboard.forms.labels");
  return <span>{t(token)}</span>;
}

function TitleCell({ row }: { row: Row<BlogPostDb> }) {
  const locale = useLocale() as AppLocale;
  const title = row.original.content.title?.[locale] || row.original.content.title?.en || "N/A";
  return <div className="font-medium">{title}</div>;
}

function FeaturedCell({ row }: { row: Row<BlogPostDb> }) {
  const t = useTranslations("Common");
  return row.original.isFeatured ? t("yes") : t("no");
}

function StatusCell({ row }: { row: Row<BlogPostDb> }) {
  const t = useTranslations("Dashboard.forms.labels");
  const isActive = row.original.isActive;
  return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? t("active") : t("inactive")}</Badge>;
}

function ActionsCell({ row }: { row: Row<BlogPostDb> }) {
  const post = row.original;
  const tActions = useTranslations("Common.actions");
  return (
    <div className="text-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{tActions("openMenu")}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{tActions("title")}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/blog/${post.postId}`}>{tActions("edit")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteEntityButton entityId={post.postId} entityName="post" deleteAction={blogPostDeleteAction} asChild>
            <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
          </DeleteEntityButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<BlogPostDb>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <LabelHeader token="title" />,
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    accessorKey: "categoryName",
    header: () => <LabelHeader token="category" />,
    cell: ({ row }) => <div>{row.original.categoryName || "-"}</div>,
  },
  {
    accessorKey: "isFeatured",
    header: () => <LabelHeader token="featured" />,
    cell: ({ row }) => <FeaturedCell row={row} />,
  },
  {
    accessorKey: "isActive",
    header: () => <LabelHeader token="status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
