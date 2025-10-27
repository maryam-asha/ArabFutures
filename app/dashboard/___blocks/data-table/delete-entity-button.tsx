"use client";

import { Button } from "@components/ui/button";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { type ActionState } from "@root/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@ui/alert-dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

import { useReactiveCsrf } from "../csrf-provider-client";

type DeleteAction = (prevState: any, formData: FormData) => Promise<ActionState<any>>;

interface DeleteEntityButtonProps {
  entityId: number;
  entityName: string;
  deleteAction: DeleteAction;
  onSuccess?: () => void;
  children: ReactNode;
  asChild?: boolean;
}

export function DeleteEntityButton({ entityId, entityName, deleteAction, onSuccess, children, asChild }: DeleteEntityButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { csrfToken } = useReactiveCsrf() || "";

  const tCommon = useTranslations("Common");
  const tDailog = useTranslations("Dashboard.dialogs");
  const tToast = useTranslations("Dashboard.toasts");

  const handleDelete = () => {
    const formData = new FormData();
    formData.append(`${entityName}Id`, entityId.toString());
    formData.append("csrf_token", csrfToken);

    startTransition(() => {
      toast.promise(deleteAction({} as any, formData), {
        loading: tCommon("deleting"),
        success: (result) => {
          if (result.success) {
            setIsOpen(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.refresh();
            }
            return result.message || tToast("deleteSuccess", { entityName });
          } else {
            throw new Error(result.message);
          }
        },
        error: (error: Error) => {
          return error.message || tToast("deleteError", { entityName });
        },
      });
    });
  };

  const Trigger = asChild ? DropdownMenuItem : Button;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Trigger
        onSelect={(e) => {
          if (asChild) {
            e.preventDefault();
          }
          setIsOpen(true);
        }}
        onClick={asChild ? undefined : () => setIsOpen(true)}
        disabled={isPending}
        className={asChild ? "text-destructive focus:bg-destructive/10" : "w-full justify-start"}
        variant={asChild ? undefined : "destructive"}
      >
        {children}
      </Trigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tDailog("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {tDailog("noUndo")} {tDailog("confirmDelete", { entityName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon("actions.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
            {isPending ? tCommon("deleting") : tDailog("deletePermanently")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
