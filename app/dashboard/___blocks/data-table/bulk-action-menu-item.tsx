"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@components/ui/alert-dialog";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { toast } from "sonner";

import { useReactiveCsrf } from "../csrf-provider-client";
import { BulkAction } from "./data-table.type";

export function BulkActionMenuItem<TData>({ table, pkColumn, label, action, actionType, isDestructive }: BulkAction & { table: Table<TData>; pkColumn: keyof TData }) {
  const tDialog = useTranslations("Dashboard.dialogs");
  const tCommon = useTranslations("Common");

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { csrfToken, setCsrfToken } = useReactiveCsrf();
  const selectedIds = React.useMemo(() => table.getFilteredSelectedRowModel().rows.map((row) => row.original[pkColumn] as number | string), [table.getState().rowSelection, pkColumn]);

  const handleAction = () => {
    const formData = new FormData();
    formData.append("csrf_token", csrfToken);
    formData.append("ids", JSON.stringify(selectedIds));
    if (actionType) {
      formData.append("actionType", actionType);
    }

    startTransition(() => {
      toast.promise(action({} as any, formData), {
        loading: tCommon("processing"),
        success: (result) => {
          if (result.success) {
            if (result.newCsrfToken) {
              setCsrfToken(result.newCsrfToken);
            }
            table.resetRowSelection();
            router.refresh(); // Re-fetches Server Components
            return result.message || tCommon("actionSuccess");
          }
          throw new Error(result.message || tCommon("actionError"));
        },
        error: (error: Error) => error.message,
      });
    });
  };

  if (isDestructive) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onSelect={(e) => e.preventDefault()} disabled={isPending}>
            {label}
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
              {isPending ? tCommon("deleting") : tCommon("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <DropdownMenuItem onClick={handleAction} disabled={isPending}>
      {label}
    </DropdownMenuItem>
  );
}
