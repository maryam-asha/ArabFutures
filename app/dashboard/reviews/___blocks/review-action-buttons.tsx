"use client";

import { useReactiveCsrf } from "@app/dashboard/___blocks/csrf-provider-client";
import { FormPageActions, FormPageSubmitButton } from "@app/dashboard/___blocks/form-page";
import { rejectReviewAction } from "@app/dashboard/reviews/actions";
import { Button } from "@components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

function ReviewActionButtons({ reviewId }: { reviewId: number }) {
  const t = useTranslations();
  const router = useRouter();
  const { csrfToken } = useReactiveCsrf();
  const [isRejecting, startRejectTransition] = useTransition();

  const handleReject = () => {
    const formData = new FormData();
    formData.append("reviewId", String(reviewId));
    formData.append("csrf_token", csrfToken);

    startRejectTransition(() => {
      toast.promise(rejectReviewAction({} as any, formData), {
        loading: t("Common.processing"),
        success: (result) => {
          return "Suggestion has been rejected.";
        },
        error: (err) => err.message || "Failed to reject suggestion.",
      });
    });
  };

  return (
    <FormPageActions>
      <Button variant="destructive" size="lg" onClick={handleReject} disabled={isRejecting}>
        {isRejecting ? t("Common.processing") : t("Common.actions.reject")}
      </Button>
      <FormPageSubmitButton updateText={t("Common.actions.approve")} pendingText={t("Common.saving")} />
    </FormPageActions>
  );
}

export default ReviewActionButtons;
