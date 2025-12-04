"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
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
import { useState, useTransition } from "react";
import { toast } from "sonner";

function ApproveTermButton({ termId, setMenuOpen }: { termId: number; setMenuOpen: (open: boolean) => void }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations();
  const { csrfToken } = useReactiveCsrf();

  const handleApprove = () => {
    setMenuOpen(false);

    const formData = new FormData();
    formData.append("ids", JSON.stringify([termId]));
    formData.append("actionType", "approve");
    formData.append("csrf_token", csrfToken);

    startTransition(() => {
      toast.promise(termsBulkUpdateAction({} as any, formData), {
        loading: t("Common.processing"),
        success: (result) => {
          router.refresh();
          return t("Dashboard.toasts.approveSuccess", { entityName: "Term" });
        },
        error: t("Dashboard.toasts.approveError", { entityName: "Term" }),
      });
    });
  };

  return (
    <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleApprove} disabled={isPending}>
      <Check className="mr-2 h-4 w-4" />
      <span>{t("Common.actions.approve")}</span>
    </DropdownMenuItem>
  );
}

export const approvalColumns: ColumnDef<TermDb>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const t = useTranslations("Dashboard.tables");
      return <Checkbox className="ms-3" checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label={t("selectAll")} />;
    },
    cell: ({ row }) => <Checkbox className="ms-3" checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
  },
  {
    id: "name",
    accessorFn: (row) => {
      const locale = i18nAppConfig.defaultLocale;
      return row.content.default[locale]?.name || row.content.default.en?.name || "No Name";
    },
    header: ({ column }) => {
      const t = useTranslations("Dashboard.forms.labels");
      return t("name");
    },
    cell: ({ row }) => {
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
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("category")}</div>;
    },
    cell: ({ row }) => row.original.categoryName || "-",
  },
  {
    accessorKey: "status",
    header: () => {
      const t = useTranslations("Dashboard.forms.labels");
      return <div>{t("status")}</div>;
    },
    cell: ({ row }) => {
      const tStatus = useTranslations("Dashboard.status");
      const status = row.original.status;

      return (
        <Badge variant="outline" className="capitalize">
          {tStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const [menuOpen, setMenuOpen] = useState(false);
      const term = row.original;
      const t = useTranslations("Common.actions");

      return (
        <div className="text-right">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ApproveTermButton termId={term.termId} setMenuOpen={setMenuOpen} />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/terms/${term.termId}`}>{t("edit")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DeleteEntityButton entityId={term.termId} entityName="term" deleteAction={termDeleteAction} asChild>
                <span className="text-destructive focus:bg-destructive/10 w-full cursor-pointer">{t("delete")}</span>
              </DeleteEntityButton>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
