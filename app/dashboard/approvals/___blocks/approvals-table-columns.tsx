"use client";

import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { termDeleteAction, termsBulkUpdateAction } from "@app/dashboard/terms/actions";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

function ApproveTermButton({ termId }: { termId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const tToast = useTranslations("Dashboard.toasts");

  const handleApprove = () => {
    const formData = new FormData();
    formData.append("ids", JSON.stringify([termId]));
    formData.append("actionType", "approve");

    startTransition(() => {
      toast.promise(termsBulkUpdateAction({} as any, formData), {
        loading: "Approving...",
        success: (result) => {
          router.refresh();
          return "Term approved successfully.";
        },
        error: "Failed to approve term.",
      });
    });
  };

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleApprove} disabled={isPending}>
      <Check className="mr-2 h-4 w-4" />
      <span>Approve</span>
    </DropdownMenuItem>
  );
}

export const approvalColumns: ColumnDef<TermDb>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    id: "name",
    accessorFn: (row) => {
      const locale = i18nAppConfig.defaultLocale;
      return row.content.default[locale]?.name || row.content.default.en?.name || "No Name";
    },
    header: "Term Name",
    cell: ({ row }) => {
      console.log(row.original);
      const locale = useLocale() as AppLocale;
      const defaultLocale = i18nAppConfig.defaultLocale;
      const name = row.original.content.default[locale]?.name || row.original.content.default[defaultLocale]?.name || "";
      return (
        <Link href={`/dashboard/terms/${row.original.termId}`} className="font-medium hover:underline">
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => row.original.categoryName || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const term = row.original;
      const tCommon = useTranslations("Common.actions");

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ApproveTermButton termId={term.termId} />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/terms/${term.termId}`}>{tCommon("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={term.termId} entityName="term" deleteAction={termDeleteAction} asChild>
                <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{tCommon("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
