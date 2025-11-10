"use client";

import { submitReviewAction } from "@app/public-actions";
import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@components/ui/form";
import { Textarea } from "@components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { TermDb, TermMoreTranslation } from "@root/dal/dal.types";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { Badge } from "@ui/badge";
import { Separator } from "@ui/separator";
import { Edit, FileTextIcon, LinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// =================================================================
// Types and Schemas
// =================================================================

// State to manage which specific piece of a term is being reviewed
type ReviewTarget = {
  identifier: string; // e.g., 'default-en', 'more-0'
  fieldKey: "name" | "briefDescription" | "fullDescription";
  currentValue: string;
};

interface TermDialogProps {
  term: TermDb | null;
  onClose: () => void;
}

const ReviewFormSchema = z.object({
  suggestedValue: z.string().trim().min(2, "Suggestion must be at least 2 characters."),
  explanation: z.string().trim().optional(),
});
type ReviewFormValues = z.infer<typeof ReviewFormSchema>;

interface ReviewSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  target: ReviewTarget | null;
  termId?: number;
}

// =================================================================
// Main Component: TermDialog
// =================================================================

export function TermDialog({ term, onClose }: TermDialogProps) {
  const [reviewTarget, setReviewTarget] = useState<ReviewTarget | null>(null);
  const t = useTranslations("Public.termDialog");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;

  const handleReviewSuccess = () => {
    setReviewTarget(null); // Close the review form
    onClose(); // Close the main term dialog
  };

  if (!term) {
    return null;
  }

  // Extract primary content based on the current locale
  const primaryTranslation = term.content.default[currentLocale];
  const primaryTitle = primaryTranslation?.name || commonT("notAvailable");
  const primaryBrief = primaryTranslation?.briefDescription;
  const primaryFull = primaryTranslation?.fullDescription;
  const primaryReferences = primaryTranslation?.references || [];

  // Extract other translations to display
  const otherTranslations: (TermMoreTranslation & { identifier: string })[] = [];
  i18nAppConfig.locales.forEach((loc) => {
    if (loc !== currentLocale) {
      otherTranslations.push({
        ...term.content.default[loc],
        locale: loc,
        identifier: `default-${loc}`,
      });
    }
  });
  term.content.more.forEach((item, index) => {
    otherTranslations.push({ ...item, identifier: `more-${index}` });
  });

  return (
    <>
      <Dialog open={!!term && !reviewTarget} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-3xl p-0">
          <div className="max-h-[85vh] overflow-y-auto">
            <div className="p-8 md:p-12">
              <DialogHeader>
                {term.categoryName && <span className="font-semibold text-primary mb-2">{term.categoryName}</span>}
                <DialogTitle className="text-3xl font-bold leading-tight md:text-4xl flex items-center gap-2">
                  {primaryTitle}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0" onClick={() => setReviewTarget({ identifier: `default-${currentLocale}`, fieldKey: "name", currentValue: primaryTitle })}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              {primaryBrief && (
                <p className="mt-6 text-lg text-foreground/80 leading-relaxed flex items-start gap-2">
                  <span>{primaryBrief}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0" onClick={() => setReviewTarget({ identifier: `default-${currentLocale}`, fieldKey: "briefDescription", currentValue: primaryBrief })}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </p>
              )}

              <Separator className="my-8" />

              <div className="space-y-10">
                {primaryFull && (
                  <DetailSection title={t("fullDescription")}>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed flex items-start gap-2">
                      <p>{primaryFull}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0" onClick={() => setReviewTarget({ identifier: `default-${currentLocale}`, fieldKey: "fullDescription", currentValue: primaryFull })}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </DetailSection>
                )}

                {otherTranslations.length > 0 && (
                  <DetailSection title={t("otherTranslations")}>
                    <div className="space-y-4">
                      {otherTranslations.map((trans) => (
                        <div key={trans.identifier} className="text-sm">
                          <Badge variant="outline" className="mb-1">
                            {trans.locale}
                          </Badge>
                          <p className="font-semibold text-foreground">{trans.name}</p>
                          {trans.briefDescription && <p className="text-muted-foreground">{trans.briefDescription}</p>}
                        </div>
                      ))}
                    </div>
                  </DetailSection>
                )}

                {term.tags && term.tags.length > 0 && (
                  <DetailSection title={t("tags")}>
                    <div className="flex flex-wrap gap-2">
                      {term.tags.map((tag) => (
                        <Badge key={tag.tagId} variant="secondary" className="text-sm px-3 py-1">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </DetailSection>
                )}

                {primaryReferences.length > 0 && (
                  <DetailSection title={t("references")}>
                    <ul className="space-y-4">
                      {primaryReferences.map((ref, index) => (
                        <li key={index} className="flex items-start gap-3 text-base">
                          {ref.url ? (
                            <>
                              <LinkIcon className="h-4 w-4 shrink-0 mt-1 text-primary" />
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline break-all">
                                {ref.content || ref.url}
                              </a>
                            </>
                          ) : (
                            <>
                              <FileTextIcon className="h-4 w-4 shrink-0 mt-1 text-muted-foreground" />
                              <span className="text-muted-foreground wrap-break-word">{ref.content}</span>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </DetailSection>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Renders the separate dialog for submitting a review */}
      <ReviewSubmissionDialog isOpen={!!reviewTarget} onClose={() => setReviewTarget(null)} target={reviewTarget} termId={term?.termId} onSuccess={handleReviewSuccess} />
    </>
  );
}

// =================================================================
// Helper Components
// =================================================================

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    {children}
  </div>
);

function ReviewSubmissionDialog({ isOpen, onClose, onSuccess, target, termId }: ReviewSubmissionDialogProps) {
  const t = useTranslations("Public.reviewDialog");
  const [state, formAction] = useActionState(submitReviewAction, { success: false, errors: {} as any });
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewFormSchema),
    defaultValues: { suggestedValue: "", explanation: "" },
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onSuccess();
      form.reset();
    } else if (state.message && form.formState.isSubmitted) {
      toast.error(state.message);
    }
  }, [state, onSuccess, form]);

  if (!target || !termId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title", { fieldName: target.fieldKey })}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="text-sm p-3 bg-muted/50 rounded-md wrap-break-word">
          <p className="text-muted-foreground font-medium">{t("currentValue")}</p>
          <p className="mt-1">{target.currentValue}</p>
        </div>
        <Form {...form}>
          <form
            action={formAction}
            onSubmit={(evt) => {
              evt.preventDefault();
              form.handleSubmit(() => {
                formAction(new FormData(evt.currentTarget));
              })(evt);
            }}
            className="space-y-4"
          >
            {/* Hidden inputs to pass essential data to the server action */}
            <input type="hidden" name="termRef" value={termId} />
            <input type="hidden" name="translationIdentifier" value={target.identifier} />
            <input type="hidden" name="fieldKey" value={target.fieldKey} />
            <input type="hidden" name="references" value="[]" /> {/* Placeholder for future implementation */}
            <FormField
              control={form.control}
              name="suggestedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("suggestionLabel")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="explanation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("explanationLabel")}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t("explanationPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
              {form.formState.isSubmitting ? t("submitting") : t("submitButton")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
