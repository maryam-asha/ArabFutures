"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import { CollectionWithCount } from "@root/dal/dal.types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { collectionDeleteAction } from "../actions";

function SelectAllHeader({ table }: { table: Table<CollectionWithCount> }) {
  return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />;
}

function LabelHeader({ ns, token }: { ns: string; token: string }) {
  const t = useTranslations(ns);
  return <span>{t(token)}</span>;
}

function NameCell({ row }: { row: Row<CollectionWithCount> }) {
  const locale = useLocale() as AppLocale;
  return <div className="font-medium">{row.original.name?.[locale] || row.original.name?.en || "N/A"}</div>;
}

function StatusCell({ row }: { row: Row<CollectionWithCount> }) {
  const t = useTranslations("Dashboard.forms.labels");
  const isActive = row.original.isActive;
  return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? t("active") : t("inactive")}</Badge>;
}

function ActionsCell({ row }: { row: Row<CollectionWithCount> }) {
  const collection = row.original;
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
            <Link href={`/dashboard/collections/${collection.collectionId}`}>{tActions("edit")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteEntityButton entityId={collection.collectionId} entityName="collection" deleteAction={collectionDeleteAction} asChild>
            <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
          </DeleteEntityButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<CollectionWithCount>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="name" />,
    cell: ({ row }) => <NameCell row={row} />,
  },
  {
    accessorKey: "isActive",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "resourceCount",
    header: () => <LabelHeader ns="Dashboard.forms.labels" token="resources" />,
    cell: ({ row }) => <div>{row.original.resourceCount}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
