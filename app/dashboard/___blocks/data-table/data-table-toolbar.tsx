"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId?: string;
  filterColumnPlaceholder?: string;
}

export function DataTableToolbar<TData>({ table, filterColumnId, filterColumnPlaceholder = "Filter by name..." }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  // Find the column dynamically using the prop
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Only render the Input if the specified column exists */}
        {filterColumn && <Input placeholder={filterColumnPlaceholder} value={(filterColumn.getFilterValue() as string) ?? ""} onChange={(event) => filterColumn.setFilterValue(event.target.value)} className="h-8 w-[150px] lg:w-[250px]" />}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
