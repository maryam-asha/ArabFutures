"use client";

import { Button } from "@components/ui/button";
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { TermForEditDb } from "@root/dal/dal.types";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { Badge } from "@ui/badge";
import { Separator } from "@ui/separator";
import { FileTextIcon, InfoIcon, LinkIcon, SquarePenIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

interface TermDialogBodyProps {
  term: TermForEditDb;
  onStartReview: () => void;
}

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export function TermDialogBody({ term, onStartReview }: TermDialogBodyProps) {
  const t = useTranslations("Public.termDialog");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;

  const otherDefaultLocale = i18nAppConfig.locales.find((l) => l !== currentLocale) || currentLocale;

  const sortedMoreTranslations = useMemo(() => {
    if (!term?.content?.more) return [];
    return [...term.content.more].sort((a, b) => {
      if (a.locale === currentLocale) return -1;
      if (b.locale === currentLocale) return 1;
      return a.locale.localeCompare(b.locale);
    });
  }, [term, currentLocale]);

  const primaryTranslation = term.content.default[currentLocale];
  const primaryTitle = primaryTranslation?.name || commonT("notAvailable");
  const primaryBrief = primaryTranslation?.briefDescription;
  const otherDefaultTranslation = term.content.default[otherDefaultLocale];
  const otherDefaultTitle = otherDefaultTranslation?.name;

  return (
    <div className="flex flex-col max-h-[85vh]">
      {/* FIX: Added `flex-1` to make this content area grow and push the footer down. */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <DialogHeader>
          {term.categoryName && <span className="font-semibold text-primary mb-2">{term.categoryName}</span>}
          <DialogTitle className="text-3xl font-bold leading-tight md:text-4xl">{primaryTitle}</DialogTitle>
          {otherDefaultTitle && <DialogDescription className="text-muted-foreground text-lg -mt-1">{otherDefaultTitle}</DialogDescription>}
        </DialogHeader>

        {primaryBrief && <p className="mt-6 text-lg text-foreground/80 leading-relaxed">{primaryBrief}</p>}

        <Separator className="my-8" />

        <div className="space-y-6">
          {primaryTranslation?.fullDescription && (
            <DetailSection title={t("fullDescription")}>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                <p>{primaryTranslation.fullDescription}</p>
              </div>
            </DetailSection>
          )}
          {sortedMoreTranslations.length > 0 && (
            <DetailSection title={t("otherTranslations")}>
              <div className="space-y-6">
                {sortedMoreTranslations.map((trans) => (
                  <div key={trans.locale} className="text-sm border-b pb-4 last:border-b-0">
                    <Badge variant="outline" className="mb-2 font-mono">
                      {trans.locale}
                    </Badge>
                    <p className="font-semibold text-foreground text-base">{trans.name}</p>
                    {trans.briefDescription && <p className="text-muted-foreground mt-1">{trans.briefDescription}</p>}

                    {/* --- START OF FIX --- */}

                    {/* 1. Render the Full Description if it exists */}
                    {trans.fullDescription && (
                      <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed mt-2">
                        <p>{trans.fullDescription}</p>
                      </div>
                    )}

                    {/* 2. Render the References if they exist */}
                    {trans.references && trans.references.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("references")}</h4>
                        <ul className="space-y-4">
                          {trans.references.map((ref, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
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
                                  <span className="text-muted-foreground wrap-break-word">{ref.content}</span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
                    {tag.name[currentLocale]}
                  </Badge>
                ))}
              </div>
            </DetailSection>
          )}
          {(primaryTranslation?.references?.length || 0) > 0 && (
            <DetailSection title={t("references")}>
              <ul className="space-y-6">
                {primaryTranslation?.references?.map((ref, index) => (
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
      <DialogFooter className="p-4 border-t bg-background">
        <div className="flex justify-between items-center w-full">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <InfoIcon className="h-4 w-4" />
            <span>{t("suggestionDisclaimer")}</span>
          </div>
          <Button onClick={onStartReview}>
            <SquarePenIcon className="h-4 w-4 me-2" />
            {t("suggestImprovement")}
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
