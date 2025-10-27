"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { TagWithCount } from "@root/dal/tags-dx";
import i18nAppConfig from "@root/i18n/config";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { deleteTagAction } from "../actions";

export const columns: ColumnDef<TagWithCount>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const t = useTranslations("Dashboard.forms.labels");
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("name")}
          <ArrowUpDown className="ms-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.translations?.[i18nAppConfig.defaultLocale]?.name || "N/A";
      return <div className="font-medium">{name}</div>;
    },
    filterFn: (row, id, value) => {
      const name = row.original.translations?.[i18nAppConfig.defaultLocale]?.name?.toLowerCase();
      return name ? name.includes(value.toLowerCase()) : false;
    },
  },
  {
    accessorKey: "termCount",
    header: () => {
      const t = useTranslations("Dashboard.sidebar");
      return <span>{t("terms")}</span>;
    },
    cell: ({ row }) => {
      return <div>{row.original.termCount}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tag = row.original;
      const tActions = useTranslations("Common.actions");
      return (
        <div className="text-right">
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
                <Link href={`/dashboard/tags/${tag.tagId}`}>{tActions("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={tag.tagId} entityName="tag" deleteAction={deleteTagAction} asChild>
                <span className="text-destructive focus:bg-destructive/10">{tActions("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
