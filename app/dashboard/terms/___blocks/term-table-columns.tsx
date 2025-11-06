"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { termDeleteAction } from "../actions";

export const termColumns: ColumnDef<TermDb>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useTranslations("Dashboard.tables");
      return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label={t("selectAll")} />;
    },
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      const t = useTranslations("Dashboard.forms.labels");
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("title")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const locale = useLocale() as AppLocale;
      const title = row.original.title?.[locale]?.[0]?.value || "N/A";
      return <div className="font-medium">{title}</div>;
    },
    filterFn: (row, id, value) => {
      const locale = useLocale() as AppLocale;
      const title = row.original.title?.[locale]?.[0]?.value?.toLowerCase();
      return title ? title.includes((value as string).toLowerCase()) : false;
    },
  },
  {
    accessorKey: "categoryName",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("category")}</div>;
    },
    cell: ({ row }) => {
      return <div>{row.original.categoryName || "-"}</div>;
    },
  },
  {
    accessorKey: "tags",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("tags")}</div>;
    },
    cell: ({ row }) => {
      const tags = row.original.tags;
      if (!tags || tags.length === 0) return <span>-</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge key={tag.tagId} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("status")}</div>;
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge variant={status === "published" ? "secondary" : "outline"} className="capitalize">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("featured")}</div>;
    },
    cell: ({ row }) => {
      const t = useTranslations("Common");
      return row.original.isFeatured ? t("yes") : t("no");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const term = row.original;
      const t_common = useTranslations("Common.actions");
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t_common("openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/terms/${term.termId}`}>{t_common("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={term.termId} entityName="term" deleteAction={termDeleteAction} asChild>
                <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{t_common("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
