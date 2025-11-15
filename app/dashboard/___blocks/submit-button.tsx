"use client";

import { Button } from "@components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  isEditMode: boolean;
  createText?: string;
  updateText?: string;
  pendingText?: string;
}

export function SubmitButton({ isEditMode, createText = "Create", updateText = "Save Changes", pendingText = "Saving..." }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
      {pending ? pendingText : isEditMode ? updateText : createText}
    </Button>
  );
}
