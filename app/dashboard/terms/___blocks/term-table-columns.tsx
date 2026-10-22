"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import type { TermDb } from "@root/dal/dal.types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { termDeleteAction } from "../actions";

// Column header/cell renderers are extracted into real components so the hooks they use obey the
// Rules of Hooks (TanStack renders them via flexRender, but lowercase render fns trip the linter).

function LabelHeader({ namespace, token }: { namespace: string; token: string }) {
  const t = useTranslations(namespace);
  return <div>{t(token)}</div>;
}

function SelectAllHeader({ table }: { table: Table<TermDb> }) {
  const t = useTranslations("Dashboard.tables");
  return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label={t("selectAll")} />;
}

function NameCell({ row }: { row: Row<TermDb> }) {
  const locale = useLocale() as AppLocale;
  const defaultLocale = i18nAppConfig.defaultLocale;
  const name = row.original.content.default[locale]?.name || row.original.content.default[defaultLocale]?.name;
  return <div className="font-medium">{name || "N/A"}</div>;
}

function StatusCell({ row }: { row: Row<TermDb> }) {
  const t = useTranslations("Dashboard.forms.statuses");
  const status = row.original.status;
  const variant: "secondary" | "outline" | "destructive" = status === "published" ? "secondary" : status === "rejected" ? "destructive" : "outline";
  return (
    <Badge variant={variant} className="capitalize">
      {t(status)}
    </Badge>
  );
}

function FeaturedCell({ row }: { row: Row<TermDb> }) {
  const t = useTranslations("Common");
  return row.original.isFeatured ? t("yes") : t("no");
}

function ActionsCell({ row }: { row: Row<TermDb> }) {
  const term = row.original;
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
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/terms/${term.termId}`}>{tActions("edit")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteEntityButton entityId={term.termId} entityName="term" deleteAction={termDeleteAction} asChild>
            <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
          </DeleteEntityButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<TermDb>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "content",
    header: () => <LabelHeader namespace="Dashboard.forms.labels" token="name" />,
    cell: ({ row }) => <NameCell row={row} />,
    filterFn: (row, id, value) => {
      const enName = row.original.content.default.en?.name?.toLowerCase();
      const arName = row.original.content.default.ar?.name?.toLowerCase();
      const query = (value as string).toLowerCase();
      return !!((enName && enName.includes(query)) || (arName && arName.includes(query)));
    },
  },
  {
    accessorKey: "categoryName",
    header: () => <LabelHeader namespace="Dashboard.forms.labels" token="category" />,
    cell: ({ row }) => <div>{row.original.categoryName || "-"}</div>,
  },
  {
    accessorKey: "status",
    header: () => <LabelHeader namespace="Dashboard.forms.labels" token="status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "isFeatured",
    header: () => <LabelHeader namespace="Dashboard.forms.labels" token="featured" />,
    cell: ({ row }) => <FeaturedCell row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
