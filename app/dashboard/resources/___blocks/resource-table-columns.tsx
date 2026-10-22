"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import type { ResourceDb } from "@root/dal/dal.types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { resourceDeleteAction } from "../actions";

function SelectAllHeader({ table }: { table: Table<ResourceDb> }) {
  return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />;
}

function LabelHeader({ ns, token }: { ns: string; token: string }) {
  const t = useTranslations(ns);
  return <span>{t(token)}</span>;
}

function TitleCell({ row }: { row: Row<ResourceDb> }) {
  const locale = useLocale() as AppLocale;
  const title = row.original.content.title?.[locale] || row.original.content.title?.en || "N/A";
  return <div className="font-medium">{title}</div>;
}

function TypeCell({ row }: { row: Row<ResourceDb> }) {
  const t = useTranslations("Dashboard.forms.resourceTypes");
  return (
    <Badge variant="outline" className="capitalize">
      {t(row.original.type)}
    </Badge>
  );
}

function StatusCell({ row }: { row: Row<ResourceDb> }) {
  const t = useTranslations("Dashboard.forms.labels");
  const isActive = row.original.isActive;
  return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? t("active") : t("inactive")}</Badge>;
}

function ActionsCell({ row }: { row: Row<ResourceDb> }) {
  const resource = row.original;
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
            <Link href={`/dashboard/resources/${resource.resourceId}`}>{tActions("edit")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteEntityButton entityId={resource.resourceId} entityName="resource" deleteAction={resourceDeleteAction} asChild>
            <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
          </DeleteEntityButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<ResourceDb>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="title" />,
    cell: ({ row }) => <TitleCell row={row} />,
  },
  {
    accessorKey: "type",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="resourceType" />,
    cell: ({ row }) => <TypeCell row={row} />,
  },
  {
    accessorKey: "categoryName",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="category" />,
    cell: ({ row }) => <div>{row.original.categoryName || "-"}</div>,
  },
  {
    accessorKey: "isActive",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
