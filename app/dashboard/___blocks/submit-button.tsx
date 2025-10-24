"use client";

import { Button } from "@components/ui/button";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  isEditMode: boolean;
  createText?: string;
  updateText?: string;
  pendingText?: string;
}

export function SubmitButton({ isEditMode, createText = "Create", updateText = "Save Changes", pendingText = "Saving..." }: SubmitButtonProps) {
  // useFormStatus is a hook that provides the status of the parent <form>.
  // It MUST be used in a component that is a child of a <form> element.
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} size="lg">
      {pending ? pendingText : isEditMode ? updateText : createText}
    </Button>
  );
}
