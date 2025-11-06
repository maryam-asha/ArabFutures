"use client";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { Badge } from "@ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog";
import { Separator } from "@ui/separator";
import { FileTextIcon, LinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface TermDialogProps {
  term: TermDb | null;
  onClose: () => void;
}

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export function TermDialog({ term, onClose }: TermDialogProps) {
  const isOpen = !!term;
  const t = useTranslations("Public.termDialog");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;

  if (!term) {
    return null;
  }

  const otherLocale = i18nAppConfig.locales.find((l) => l !== currentLocale) || currentLocale;

  const primaryTitle = term.title?.[currentLocale]?.[0]?.value || commonT("notAvailable");
  const primaryReferences = term.title?.[currentLocale]?.[0]?.references || [];
  const secondaryTitle = term.title?.[otherLocale]?.[0]?.value;
  const briefDescription = term.briefDescription?.[currentLocale];
  const fullDetail = term.fullDetail?.[currentLocale];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0">
        <div className="max-h-[85vh] overflow-y-auto">
          <div className="term-dialog-content relative p-8 md:p-12">
            <div className="pl-6">
              <DialogHeader>
                {term.categoryName && <span className="font-semibold text-primary mb-2">{term.categoryName}</span>}
                <DialogTitle className="text-3xl font-bold leading-tight md:text-4xl">{primaryTitle}</DialogTitle>
                {secondaryTitle && <DialogDescription className="text-lg pt-1 text-muted-foreground/80">{secondaryTitle}</DialogDescription>}
              </DialogHeader>

              {briefDescription && <p className="mt-6 text-lg text-foreground/80 leading-relaxed">{briefDescription}</p>}

              <Separator className="my-8" />

              <div className="space-y-10">
                {fullDetail && (
                  <DetailSection title={t("fullDescription")}>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">{fullDetail}</div>
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
                              <a href={ref.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline wrap-break-word">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
