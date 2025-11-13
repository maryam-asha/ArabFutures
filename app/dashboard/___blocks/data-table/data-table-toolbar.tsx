"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Input } from "@components/ui/input";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

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
  const t = useTranslations();
  const filterColumn = filterColumnId ? table.getColumn(filterColumnId) : undefined;

  const currentFilterValue = (filterColumn?.getFilterValue() as string) ?? "";

  const [inputValue, setInputValue] = useState(currentFilterValue);
  const [debouncedInputValue] = useDebounce(inputValue, 400);

  useEffect(() => {
    setInputValue(currentFilterValue);
  }, [currentFilterValue]);

  useEffect(() => {
    if (filterColumn && debouncedInputValue !== currentFilterValue) {
      filterColumn.setFilterValue(debouncedInputValue);
    }
  }, [debouncedInputValue, currentFilterValue, filterColumn]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">{filterColumn && <Input placeholder={filterColumnPlaceholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="h-8 w-[150px] lg:w-[250px]" />}</div>
      {bulkActions && pkColumn && selectedRowCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ms-2">
              {t("Common.actions.title")} ({selectedRowCount})
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

function BulkActionMenuItem<TData>({ table, pkColumn, label, action, actionType, isDestructive }: BulkAction & { table: Table<TData>; pkColumn: keyof TData }) {
  const router = useRouter();
  const { csrfToken } = useReactiveCsrf();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const selectedIds = useMemo(() => table.getFilteredSelectedRowModel().rows.map((r) => r.original[pkColumn] as string | number), [table.getState().rowSelection, pkColumn]);

  const handleAction = () => {
    const formData = new FormData();
    formData.append("csrf_token", csrfToken);
    formData.append("ids", JSON.stringify(selectedIds));
    if (actionType) formData.append("actionType", actionType);

    startTransition(() => {
      toast.promise(action({} as any, formData), {
        loading: t("Common.processing"),
        success: (result) => {
          if (result.success) {
            table.resetRowSelection();
            router.refresh();
            return result.message || t("Common.actionSuccess");
          }
          throw new Error(result.message || t("Common.actionError"));
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
            {t(`Common.actions.${label}`)}
          </DropdownMenuItem>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Dashboard.dialogs.areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>{t("Dashboard.dialogs.confirmBulkDelete", { count: selectedIds.length })}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>{t("Common.actions.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
              {isPending ? t("Common.deleting") : t("Common.actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

  return (
    <DropdownMenuItem onClick={handleAction} disabled={isPending}>
      {t(`Common.actions.${label}`)}
    </DropdownMenuItem>
  );
}
