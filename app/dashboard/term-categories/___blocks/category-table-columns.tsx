"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import i18nAppConfig from "@i18n/config";
import { TermCategoryWithCount } from "@root/dal/termCategories-dx";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { termCategoryDeleteAction } from "../action";

export const columns: ColumnDef<TermCategoryWithCount>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name", // A virtual key for sorting/filtering
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
    // Custom filter function to search within the nested translations object
    filterFn: (row, id, value) => {
      const name = row.original.translations?.[i18nAppConfig.defaultLocale]?.name?.toLowerCase();
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
  // Column for Term Count
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
  // Column for Row Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
      const t = useTranslations("Dashboard");
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
              <DropdownMenuLabel>{tActions("edit")}</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/term-categories/${category.categoryId}`}>{tActions("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/terms?category=${category.categoryId}`}>
                  {t("sidebar.terms")} ({category.termCount})
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={category.categoryId} entityName="category" deleteAction={termCategoryDeleteAction} asChild>
                <span className="text-destructive focus:bg-destructive/10 w-full">{tActions("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
