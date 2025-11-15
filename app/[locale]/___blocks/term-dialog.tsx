"use client";

import { getTermDetailsAction } from "@app/terms-actions";
import { Dialog, DialogContent, DialogTitle } from "@components/ui/dialog";
import { Skeleton } from "@components/ui/skeleton";
import { AppLocale } from "@i18n/config";
import { TermForEditDb } from "@root/dal/dal.types";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ReviewSubmissionDialog } from "./review-submission-dialog";
import { TermDialogBody } from "./term-dialog-body";

interface TermDialogProps {
  termId: number | null;
  onClose: () => void;
}

const LoadingSkeleton = () => (
  <div className="p-8 md:p-12">
    <Skeleton className="h-5 w-1/4 mb-4" />
    <Skeleton className="h-10 w-3/4 mb-2" />
    <Skeleton className="h-6 w-1/2 mb-8" />
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
);

export function TermDialog({ termId, onClose }: TermDialogProps) {
  const [term, setTerm] = useState<TermForEditDb | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReviewing, setIsReviewing] = useState(false);

  const t = useTranslations("Common");
  const tPublic = useTranslations("Public.termDialog");
  const locale = useLocale() as AppLocale;

  useEffect(() => {
    if (!termId) {
      setTerm(null);
      return;
    }

    setIsLoading(true);
    getTermDetailsAction(locale, termId)
      .then((data) => {
        if (data) {
          setTerm(data);
        } else {
          toast.error(t("loadError"));
          onClose();
        }
      })
      .catch(() => {
        toast.error(t("loadError"));
        onClose();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [termId, locale, onClose, t]);

  const handleReviewSuccess = () => {
    setIsReviewing(false);
    onClose();
  };

  return (
    <>
      <Dialog open={!!termId} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogTitle className="sr-only">{term?.content.default[locale]?.name || tPublic("termDetails")}</DialogTitle>
        <DialogContent className="sm:max-w-max max-w-5xl p-0">{isLoading || !term ? <LoadingSkeleton /> : <TermDialogBody term={term} onStartReview={() => setIsReviewing(true)} />}</DialogContent>
      </Dialog>

      <ReviewSubmissionDialog isOpen={isReviewing} onClose={() => setIsReviewing(false)} termId={termId ?? undefined} onSuccess={handleReviewSuccess} />
    </>
  );
}
