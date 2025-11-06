"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { DeleteEntityButton } from "@app/dashboard/___blocks/data-table/delete-entity-button";
import { termDeleteAction, termUpdateStatusAction } from "@app/dashboard/terms/actions";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Checkbox } from "@components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Check, MoreHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

// Helper component to handle the status update action
function ApproveButton({ termId }: { termId: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const tToast = useTranslations("Dashboard.toasts");
  const tCommon = useTranslations("Common");
  const { csrfToken, setCsrfToken } = useReactiveCsrf();

  const handleApprove = () => {
    const formData = new FormData();
    formData.append("id", termId.toString());
    formData.append("actionType", "approve");
    formData.append("csrf_token", csrfToken);

    startTransition(() => {
      toast.promise(termUpdateStatusAction({} as any, formData), {
        loading: tCommon("processing"),
        success: (result) => {
          if (result.success) {
            if (result.newCsrfToken) setCsrfToken(result.newCsrfToken);
            router.refresh();
            return tToast("approveSuccess", { entityName: "Term" });
          }
          throw new Error(result.message);
        },
        error: (error) => error.message || tToast("approveError", { entityName: "Term" }),
      });
    });
  };

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleApprove} disabled={isPending}>
      <Check className="mr-2 h-4 w-4" />
      <span>{tCommon("actions.approve")}</span>
    </DropdownMenuItem>
  );
}

export const approvalColumns: ColumnDef<TermDb>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      const t = useTranslations("Dashboard.forms.labels");
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          {t("title")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const locale = useLocale() as AppLocale;
      const title = row.original.title?.[locale]?.[0]?.value || "N/A";
      return <div className="font-medium">{title}</div>;
    },
    filterFn: (row, id, value) => {
      const locale = useLocale() as AppLocale;
      const title = row.original.title?.[locale]?.[0]?.value?.toLowerCase();
      return title ? title.includes((value as string).toLowerCase()) : false;
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
                <span className="sr-only">{tCommon("openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ApproveButton termId={term.termId} />
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
