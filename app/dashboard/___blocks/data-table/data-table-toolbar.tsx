"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { useReactiveCsrf } from "../csrf-provider-client";
import { BulkAction } from "./data-table.type";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterColumnId?: string;
  selectedRowCount: number;
  filterColumnPlaceholder?: string;
  pkColumn?: keyof TData;
  bulkActions?: BulkAction[];
}

/** Debounce hook */
function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function DataTableToolbar<TData>({ table, filterColumnId, filterColumnPlaceholder = "Filter...", bulkActions, pkColumn, selectedRowCount }: DataTableToolbarProps<TData>) {
  const tActions = useTranslations("Common.actions");
  const tDialogs = useTranslations("Dashboard.dialogs");
  const tCommon = useTranslations("Common");
  console.log(filterColumnId);
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;
  const [inputValue, setInputValue] = useState<string>((filterColumn?.getFilterValue() as string) ?? "");
  const debouncedValue = useDebouncedValue(inputValue, 400);

  useEffect(() => {
    if (filterColumn) filterColumn.setFilterValue(debouncedValue);
  }, [debouncedValue, filterColumn]);

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumn && <Input placeholder={filterColumnPlaceholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-8 w-[150px] lg:w-[250px]" />}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setInputValue("");
              table.resetColumnFilters();
            }}
            className="h-8 px-2 lg:px-3"
          >
            {tActions("reset")}
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Bulk actions */}
      {bulkActions && pkColumn && selectedRowCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ms-2">
              {tActions("title")} ({selectedRowCount})
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {bulkActions.map((action) => (
              <BulkActionMenuItem key={action.label} table={table} pkColumn={pkColumn} {...action} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

/** Internal bulk-action menu item */
function BulkActionMenuItem<TData>({ table, pkColumn, label, action, actionType, isDestructive }: BulkAction & { table: Table<TData>; pkColumn: keyof TData }) {
  const router = useRouter();
  const { csrfToken } = useReactiveCsrf();
  const tDialog = useTranslations("Dashboard.dialogs");
  const tActions = useTranslations("Common.actions");
  const tCommon = useTranslations("Common");
  const [isPending, startTransition] = useTransition();

  const selectedIds = useMemo(() => table.getFilteredSelectedRowModel().rows.map((r) => r.original[pkColumn] as string | number), [table.getState().rowSelection, pkColumn]);

  const handleAction = () => {
    const formData = new FormData();
    formData.append("csrf_token", csrfToken);
    formData.append("ids", JSON.stringify(selectedIds));
    if (actionType) formData.append("actionType", actionType);

    startTransition(() => {
      toast.promise(action({} as any, formData), {
        loading: tCommon("processing"),
        success: (result) => {
          if (result.success) {
            table.resetRowSelection();
            router.refresh();
            return result.message || tActions("actionSuccess");
          }
          throw new Error(result.message || tActions("actionError"));
        },
        error: (err: Error) => err.message,
      });
    });
  };

  if (isDestructive)
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onSelect={(e) => e.preventDefault()} disabled={isPending}>
            {tActions(label)}
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tDialog("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>{tDialog("confirmBulkDelete", { count: selectedIds.length })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{tCommon("actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
              {isPending ? tCommon("deleting") : tActions("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

  return (
    <DropdownMenuItem onClick={handleAction} disabled={isPending}>
      {tActions(label)}
    </DropdownMenuItem>
  );
}
