import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import ReviewActionButtons from "@app/dashboard/reviews/___blocks/review-action-buttons";
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert";
import "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { getIdFromParams } from "@lib/action-handler";
import { findReviewById } from "@root/dal/reviews-dx";
import { findTagOptions } from "@root/dal/tags-dx";
import { findActiveCategoryOptions } from "@root/dal/termCategories-dx";
import { findTermById } from "@root/dal/terms-dx";
import { SearchParamsProps } from "@root/types";
import { Info } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TermForm } from "../___blocks/term-form";
import { TermFormValues } from "../term.types";

interface EditTermPageProps {
  params: Promise<{ termId: string }>;
  searchParams: SearchParamsProps;
}

export default async function EditTermPage(props: EditTermPageProps) {
  const termId = await getIdFromParams(Promise.resolve(props.params), "termId");
  const searchParamsObject = await props.searchParams;
  const reviewId = Number(searchParamsObject?.reviewId);

  const [term, categories, tags, review] = await Promise.all([
    findTermById({ termId, locale: "ar" }),
    findActiveCategoryOptions(i18nAppConfig.defaultLocale),
    findTagOptions(i18nAppConfig.defaultLocale),
    reviewId ? findReviewById(reviewId) : Promise.resolve(null),
  ]);

  if (!term) notFound();

  const t = await getTranslations();
  const initialDataForForm: Partial<TermFormValues> = {
    termId: term.termId,
    status: term.status,
    isFeatured: term.isFeatured,
    categoryRef: term.categoryRef ?? 0,
    tagIds: term.tagIds || [],
    content: term.content,
  };

  const termName = term.content.default[i18nAppConfig.defaultLocale]?.name || `Term #${termId}`;

  return (
    <FormPage isEditMode={true}>
      <FormPageHeader>
        <FormPageTitle>{t("Dashboard.pages.terms.editTitle")}</FormPageTitle>
        <FormPageDescription>{t("Dashboard.pages.terms.editDescription", { entityName: termName })}</FormPageDescription>
      </FormPageHeader>

      {review && (
        <Alert className="mx-6 box-border w-auto bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>{t("Dashboard.pages.terms.reviewAlertTitle")}</AlertTitle>
          <AlertDescription>
            {t("Dashboard.pages.terms.reviewAlertDescription", { fieldKey: review.fieldKey })}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-background/50 p-3 rounded-md">
                <p className="font-semibold text-foreground mb-1">{t(`Dashboard.forms.labels.${review.fieldKey}`)}</p>
                <p className="text-foreground wrap-break-word">{review.suggestedValue}</p>
              </div>
            </div>
            {review.explanation && (
              <div className="bg-background/50 p-3 rounded-md">
                <p className="font-semibold text-foreground mb-1">{t(`Dashboard.forms.labels.explanation`)}</p>
                <p className="text-muted-foreground italic wrap-break-word">"{review.explanation}"</p>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <FormPageContent>
        <TermForm initialData={initialDataForForm} categories={categories} tags={tags}>
          {/* Also pass the reviewId to the form if it exists */}
          {review && <input type="hidden" name="reviewId" value={review.reviewId} />}

          {review ? (
            <ReviewActionButtons reviewId={review.reviewId} />
          ) : (
            <FormPageActions>
              <Button variant="outline" size="lg" asChild>
                <Link href="/dashboard/terms">{t("Common.actions.cancel")}</Link>
              </Button>
              <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
            </FormPageActions>
          )}
        </TermForm>
      </FormPageContent>
    </FormPage>
  );
}
