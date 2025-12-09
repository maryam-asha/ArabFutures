"use client";

import { ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { DataTableProps } from "./data-table.type";

export function DataTable<TData, TValue>({ columns, data, totalCount, filterColumnId, filterColumnPlaceholder, bulkActions, pkColumn }: DataTableProps<TData, TValue> & { totalCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Dashboard.tables");

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const query = searchParams.get("query") ?? "";

  const pagination = React.useMemo(() => ({ pageIndex: page - 1, pageSize: limit }), [page, limit]);

  const columnFilters: ColumnFiltersState = React.useMemo(() => (filterColumnId ? [{ id: filterColumnId, value: query }] : []), [filterColumnId, query]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const updateUrlParams = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(window.location.search);
      for (const [key, value] of Object.entries(params)) {
        if (value === null || value === "") current.delete(key);
        else current.set(key, String(value));
      }
      const qs = current.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const table = useReactTable({
    data,
    columns,
    rowCount: totalCount,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),

    state: { pagination, columnFilters, sorting, rowSelection, columnVisibility },

    onPaginationChange: (updater) => {
      const old = table.getState().pagination;
      const next = typeof updater === "function" ? updater(old) : updater;
      updateUrlParams({ page: next.pageIndex + 1, limit: next.pageSize });
    },

    onColumnFiltersChange: (updater) => {
      const oldFilters = table.getState().columnFilters;
      const newFilters = typeof updater === "function" ? updater(oldFilters) : updater;

      const filterObject = newFilters.find((f) => f.id === filterColumnId);

      const newQueryValue = filterObject ? filterObject.value : null;

      updateUrlParams({ query: newQueryValue as string | null, page: 1 });
    },

    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} filterColumnId={filterColumnId} filterColumnPlaceholder={filterColumnPlaceholder} bulkActions={bulkActions} pkColumn={pkColumn} selectedRowCount={selectedRowCount} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan} className="text-start">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}
