"use client";

import FormPage, { FormPageActions, FormPageContent, FormPageDescription, FormPageHeader, FormPageSubmitButton, FormPageTitle } from "@app/dashboard/___blocks/form-page";
import { getPendingReviewsByTermId } from "@app/dashboard/reviews/actions";
import { getTagOptionsAction } from "@app/dashboard/tags/actions";
import { getActiveCategoryOptionsAction } from "@app/dashboard/term-categories/action";
import { getTermDetailsAction } from "@app/terms-actions";
import { Button } from "@components/ui/button";
import i18nAppConfig from "@i18n/config";
import { TagOption, TermCategoryOption, TermForEditDb, TermReviewDb } from "@root/dal/dal.types";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ReviewAccordion } from "../___blocks/review-accordion";
import { TermForm } from "../___blocks/term-form";
import { TermFormSkeleton } from "../___blocks/term-form-skeleton";
import { TermFormValues } from "../term.types";

export default function EditTermPage() {
  const params = useParams();
  const termId = Number(params.termId);
  console.log(termId);

  const [term, setTerm] = useState<TermForEditDb | null>(null);
  const [categories, setCategories] = useState<TermCategoryOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [reviews, setReviews] = useState<TermReviewDb[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations();

  useEffect(() => {
    async function fetchData() {
      try {
        const [termData, categoriesData, tagsData, reviewsData] = await Promise.all([
          getTermDetailsAction("ar", termId),
          getActiveCategoryOptionsAction(i18nAppConfig.defaultLocale),
          getTagOptionsAction(i18nAppConfig.defaultLocale),
          getPendingReviewsByTermId(termId),
        ]);

        if (!termData) {
          notFound();
        }

        setTerm(termData);
        setCategories(categoriesData);
        setTags(tagsData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch term data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (termId) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [termId]);

  const handleReviewSelect = (id: number) => {
    setSelectedReviewIds((prevIds) => (prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]));
  };

  if (isLoading) {
    return <TermFormSkeleton />;
  }

  // This check is now safe because isLoading is false. If term is still null,
  // it means notFound() was called and this component will unmount.
  if (!term) {
    notFound();
  }

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

      <ReviewAccordion reviews={reviews} selectedReviewIds={selectedReviewIds} onReviewSelect={handleReviewSelect} />

      <FormPageContent>
        <TermForm initialData={initialDataForForm} categories={categories} tags={tags} selectedReviewIds={selectedReviewIds}>
          <FormPageActions>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard/terms">{t("Common.actions.cancel")}</Link>
            </Button>
            <FormPageSubmitButton createText={t("Common.actions.create")} updateText={t("Common.actions.save")} pendingText={t("Common.saving")} />
          </FormPageActions>
        </TermForm>
      </FormPageContent>
    </FormPage>
  );
}
