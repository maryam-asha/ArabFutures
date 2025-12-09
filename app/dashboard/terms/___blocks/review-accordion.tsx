"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion";
import { Button } from "@components/ui/button";
import { TermReviewDb } from "@root/dal/dal.types";
import { CheckCircle, FileTextIcon, LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface ReviewAccordionProps {
  reviews: TermReviewDb[];
  selectedReviewIds: number[];
  onReviewSelect: (id: number) => void;
}

export function ReviewAccordion({ reviews, selectedReviewIds, onReviewSelect }: ReviewAccordionProps) {
  const t = useTranslations("Dashboard.pages.terms");
  const tLabels = useTranslations("Dashboard.forms.labels");

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className="mx-6 mb-6">
      <h3 className="mb-2 text-lg font-semibold">{t("pendingReviewsTitle", { count: reviews.length })}</h3>
      <Accordion type="multiple" className="w-full">
        {reviews.map((review, index) => {
          const hasReferences = review.references && review.references.length > 0;

          const isSelected = selectedReviewIds.includes(review.reviewId);
          return (
            <AccordionItem value={`item-${index}`} key={review.reviewId}>
              <AccordionTrigger>
                <div className="flex items-center gap-2 text-start">
                  {isSelected && <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />}
                  <span className="truncate">{t("reviewFrom", { date: new Date(review.createdAt).toLocaleDateString() })}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 bg-muted/50 p-4">
                <div>
                  <p className="font-semibold text-foreground mb-1">{tLabels("suggestedChange")}</p>
                  <p className="text-foreground whitespace-pre-wrap rounded-md border bg-background p-2">{review.suggestedChange}</p>
                </div>

                {review.explanation && (
                  <div>
                    <p className="font-semibold text-foreground mb-1">{tLabels("explanation")}</p>
                    <p className="text-muted-foreground italic">"{review.explanation}"</p>
                  </div>
                )}

                {hasReferences && (
                  <div>
                    <p className="font-semibold text-foreground mb-2">{tLabels("references")}</p>
                    <ul className="space-y-3">
                      {review.references?.map((ref, refIndex) => (
                        <li key={refIndex} className="flex items-start gap-2 text-sm">
                          {ref.url ? (
                            <>
                              <LinkIcon className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline break-all">
                                {ref.content || ref.url}
                              </a>
                            </>
                          ) : (
                            <>
                              <FileTextIcon className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                              <span className="text-muted-foreground break-all">{ref.content}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <Button size="sm" variant={isSelected ? "default" : "outline"} onClick={() => onReviewSelect(review.reviewId)}>
                  {isSelected ? t("reviewSelected") : t("selectReview")}
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
