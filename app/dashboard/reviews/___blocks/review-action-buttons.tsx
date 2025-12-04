"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { FormPageActions, FormPageSubmitButton } from "@app/dashboard/___blocks/form-page";
import { rejectReviewAction } from "@app/dashboard/reviews/actions";
import { Button } from "@components/ui/button";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

function ReviewActionButtons({ reviewId }: { reviewId: number }) {
  const t = useTranslations();
  const tCommon = useTranslations("Common");
  const tToasts = useTranslations("Dashboard.toasts");
  const { csrfToken } = useReactiveCsrf();
  const [isRejecting, startRejectTransition] = useTransition();

  const handleReject = () => {
    const formData = new FormData();
    formData.append("reviewId", String(reviewId));
    formData.append("csrf_token", csrfToken);

    startRejectTransition(() => {
      toast.promise(rejectReviewAction({} as any, formData), {
        loading: tCommon("processing"),
        success: () => tToasts("rejectSuccess"),
        error: () => tToasts("rejectError"),
      });
    });
  };

  return (
    <FormPageActions>
      <Button variant="destructive" size="lg" onClick={handleReject} disabled={isRejecting}>
        {isRejecting ? tCommon("processing") : t("Common.actions.reject")}
      </Button>
      <FormPageSubmitButton updateText={t("Common.actions.approve")} pendingText={tCommon("saving")} />
    </FormPageActions>
  );
}

export default ReviewActionButtons;
