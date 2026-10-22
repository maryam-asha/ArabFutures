"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import type { MemberDb } from "@root/dal/dal.types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { memberDeleteAction } from "../actions";

function SelectAllHeader({ table }: { table: Table<MemberDb> }) {
  return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />;
}

function LabelHeader({ token }: { token: string }) {
  const t = useTranslations("Dashboard.forms.labels");
  return <span>{t(token)}</span>;
}

function NameCell({ row }: { row: Row<MemberDb> }) {
  const locale = useLocale() as AppLocale;
  const content = row.original.content;
  const name = content.name?.[locale] || content.name?.en || "N/A";
  const role = content.role?.[locale] || content.role?.en || "";
  return (
    <div>
      <div className="font-medium">{name}</div>
      {role && <div className="text-xs text-muted-foreground">{role}</div>}
    </div>
  );
}

function StatusCell({ row }: { row: Row<MemberDb> }) {
  const t = useTranslations("Dashboard.forms.labels");
  const isActive = row.original.isActive;
  return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? t("active") : t("inactive")}</Badge>;
}

function ActionsCell({ row }: { row: Row<MemberDb> }) {
  const member = row.original;
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
            <Link href={`/dashboard/members/${member.memberId}`}>{tActions("edit")}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DeleteEntityButton entityId={member.memberId} entityName="member" deleteAction={memberDeleteAction} asChild>
            <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tActions("delete")}</span>
          </DeleteEntityButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const columns: ColumnDef<MemberDb>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectAllHeader table={table} />,
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <LabelHeader token="name" />,
    cell: ({ row }) => <NameCell row={row} />,
  },
  {
    accessorKey: "slug",
    header: () => <LabelHeader token="slug" />,
    cell: ({ row }) => <span className="font-mono text-sm text-muted-foreground">{row.original.slug}</span>,
  },
  {
    accessorKey: "isActive",
    header: () => <LabelHeader token="status" />,
    cell: ({ row }) => <StatusCell row={row} />,
  },
  {
    accessorKey: "displayOrder",
    header: () => <LabelHeader token="displayOrder" />,
    cell: ({ row }) => <div>{row.original.displayOrder}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
