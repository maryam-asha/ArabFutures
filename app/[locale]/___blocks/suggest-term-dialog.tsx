"use client";

import { TermForm } from "@app/dashboard/terms/___blocks/term-form";
import { suggestTermAction } from "@app/public-actions";
import { TermCategoryOption } from "@root/dal/dal.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@ui/dialog";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface SuggestTermDialogProps {
  categories: TermCategoryOption[];
  children: React.ReactNode;
}

export function SuggestTermDialog({ categories, children }: SuggestTermDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Dashboard");
  const tPublic = useTranslations("Public.hero");

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tPublic("ctaPrimary")}</DialogTitle>
          <DialogDescription>{t("pages.terms.addDescription")}</DialogDescription>
        </DialogHeader>
        <TermForm initialData={{}} categories={categories} tags={[]} mode="public" action={suggestTermAction} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
