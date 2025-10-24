"use client";

import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { TermCategoryWithCount } from "@root/dal/dal.types";
import i18nAppConfig from "@root/i18n/config";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@ui/badge";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<TermCategoryWithCount>[] = [
  // Column for bulk-action checkboxes
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
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Category Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.translations?.[i18nAppConfig.defaultLocale]?.name || "N/A";
      return <div className="font-medium">{name}</div>;
    },
  },
  // Column for Status
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <Badge variant={isActive ? "secondary" : "outline"}>{isActive ? "Active" : "Inactive"}</Badge>;
    },
  },
  // Column for Term Count
  {
    accessorKey: "termCount",
    header: "Terms",
    cell: ({ row }) => {
      return <div>{row.original.termCount}</div>;
    },
  },
  // Column for Row Actions
  {
    id: "actions",
    cell: ({ row }) => {
      const category = row.original;
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
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/term-categories/${category.categoryId}`}>Edit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/terms?category=${category.categoryId}`}>View Terms ({category.termCount})</Link>
              </DropdownMenuItem>
              {/* We'll add the generic delete button here later */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
