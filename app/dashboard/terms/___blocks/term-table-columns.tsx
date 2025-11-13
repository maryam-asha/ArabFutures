"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import type { TermDb } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { termDeleteAction } from "../actions";

export const columns: ColumnDef<TermDb>[] = [
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
    accessorKey: "content",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("name");
    },
    cell: ({ row }) => {
      const locale = useLocale() as AppLocale;
      const defaultLocale = i18nAppConfig.defaultLocale;

      const name = row.original.content.default[locale]?.name || row.original.content.default[defaultLocale]?.name;

      return <div className="font-medium">{name || "N/A"}</div>;
    },

    filterFn: (row, id, value) => {
      const enName = row.original.content.default.en?.name?.toLowerCase();
      const arName = row.original.content.default.ar?.name?.toLowerCase();
      const query = (value as string).toLowerCase();
      return !!((enName && enName.includes(query)) || (arName && arName.includes(query)));
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
    accessorKey: "status",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("status")}</div>;
    },
    cell: ({ row }) => {
      const status = row.original.status;

      const variant: "secondary" | "outline" | "destructive" = status === "published" ? "secondary" : status === "rejected" ? "destructive" : "outline";

      return (
        <Badge variant={variant} className="capitalize">
          {status.replace("-", " ")}
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
