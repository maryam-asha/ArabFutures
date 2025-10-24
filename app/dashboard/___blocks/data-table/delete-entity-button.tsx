"use client";

import { Button } from "@components/ui/button";
import { DropdownMenuItem } from "@components/ui/dropdown-menu";
import { type ActionState } from "@root/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@ui/alert-dialog";
import { useCsrf } from "@waelhabbaldev/next-jwt-auth/client";
import { useRouter } from "next/navigation";
import { type ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";

// This action type is generic enough to work with any delete action we create
type DeleteAction = (prevState: any, formData: FormData) => Promise<ActionState<any>>;

interface DeleteEntityButtonProps {
  entityId: number;
  entityName: string; // e.g., "category", "term"
  deleteAction: DeleteAction;
  onSuccess?: () => void;
  children: ReactNode;
  asChild?: boolean;
}

export function DeleteEntityButton({ entityId, entityName, deleteAction, onSuccess, children, asChild }: DeleteEntityButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const csrfToken = useCsrf() || "";

  const handleDelete = () => {
    const formData = new FormData();
    // The primary key column is derived from the entityName
    formData.append(`${entityName}Id`, entityId.toString());
    formData.append("csrf_token", csrfToken);

    startTransition(() => {
      toast.promise(deleteAction({} as any, formData), {
        loading: `Deleting ${entityName}...`,
        success: (result) => {
          if (result.success) {
            setIsOpen(false);
            if (onSuccess) {
              onSuccess();
            } else {
              router.refresh(); // Default behavior is to refresh the current view
            }
            return result.message || `Successfully deleted ${entityName}.`;
          } else {
            // If the server action returns success: false, it's treated as an error
            throw new Error(result.message);
          }
        },
        error: (error: Error) => {
          return error.message || `Failed to delete ${entityName}.`;
        },
      });
    });
  };

  const Trigger = asChild ? DropdownMenuItem : Button;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Trigger variant={asChild ? undefined : "destructive"} onClick={() => setIsOpen(true)} disabled={isPending} className={asChild ? "text-destructive focus:bg-destructive/10" : "w-full justify-start"}>
        {children}
      </Trigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete the {entityName}.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90" disabled={isPending}>
            {isPending ? "Deleting..." : "Delete Permanently"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
