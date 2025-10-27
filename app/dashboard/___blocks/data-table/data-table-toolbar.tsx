"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { startTransition, useMemo } from "react";
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
export function DataTableToolbar<TData>({ table, filterColumnId, filterColumnPlaceholder = "Filter...", bulkActions, pkColumn, selectedRowCount }: DataTableToolbarProps<TData>) {
  const tActions = useTranslations("Common.actions");
  const isFiltered = table.getState().columnFilters.length > 0;
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;
  console.log("render the toolbar ...");

  console.log(bulkActions?.length);
  console.log(pkColumn);
  console.log(selectedRowCount);
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterColumn && <Input placeholder={filterColumnPlaceholder} value={(filterColumn.getFilterValue() as string) ?? ""} onChange={(event) => filterColumn.setFilterValue(event.target.value)} className="h-8 w-[150px] lg:w-[250px]" />}
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            {tActions("reset")}
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {bulkActions && pkColumn && selectedRowCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ms-2">
              {tActions("title")} ({selectedRowCount})
              <ChevronDown className="ms-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {bulkActions.map((bulkAction) => (
              <BulkActionMenuItem key={bulkAction.label} table={table} pkColumn={pkColumn} {...bulkAction} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

function BulkActionMenuItem<TData>({ table, pkColumn, label, action, actionType, isDestructive }: BulkAction & { table: Table<TData>; pkColumn: keyof TData }) {
  const { csrfToken } = useReactiveCsrf();
  const router = useRouter();

  const tDialog = useTranslations("Dashboard.dialogs");
  const tActions = useTranslations("Common.actions");

  const selectedIds = useMemo(() => table.getFilteredSelectedRowModel().rows.map((row) => row.original[pkColumn] as number | string), [table.getState().rowSelection, pkColumn]);

  const handleAction = () => {
    const formData = new FormData();
    formData.append("csrf_token", csrfToken);
    formData.append("ids", JSON.stringify(selectedIds));
    if (actionType) {
      formData.append("actionType", actionType);
    }

    startTransition(() => {
      toast.promise(
        // We call the action with the FormData object, which matches the ServerAction type.
        action({} as any, formData),
        {
          loading: tActions("title"),
          success: (result) => {
            if (result.success) {
              table.resetRowSelection();
              router.refresh();
              return result.message || tActions("actionSuccess");
            }
            throw new Error(result.message || tActions("actionError"));
          },
          error: (error: Error) => error.message,
        },
      );
    });
  };

  if (isDestructive) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10"
            onSelect={(e) => e.preventDefault()} // Prevent closing dropdown
          >
            {tActions(`${label}`)}
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{tDialog("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>{tDialog("confirmBulkDelete", { count: selectedIds.length })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tActions("cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className="bg-destructive hover:bg-destructive/90">
              {tActions("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return <DropdownMenuItem onClick={handleAction}>{tActions(label)}</DropdownMenuItem>;
}
