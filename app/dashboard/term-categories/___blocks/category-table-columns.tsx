"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import { TermCategoryWithCount } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { termCategoryDeleteAction } from "../action";

export const columns: ColumnDef<TermCategoryWithCount>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("name");
    },
    cell: ({ row }) => {
      const locale = useLocale() as AppLocale;
      const name = row.original.name?.[locale] || "N/A";
      return <div className="font-medium">{name}</div>;
    },
    filterFn: (row, id, value) => {
      const locale = useLocale() as AppLocale;
      const name = row.original.name?.[locale]?.toLowerCase();
      return name ? name.includes((value as string).toLowerCase()) : false;
    },
  },
  {
    accessorKey: "isActive",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <span>{t("status")}</span>;
    },
    cell: ({ row }) => {
      const t = useTranslations("Dashboard.forms");
      const isActive = row.original.isActive;
      return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? t("labels.active") : t("labels.inactive")}</Badge>;
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
      const category = row.original;
      const tActions = useTranslations("Common.actions");
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{tActions("title")}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/term-categories/${category.categoryId}`}>{tActions("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={category.categoryId} entityName="category" deleteAction={termCategoryDeleteAction} asChild>
                <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
