"use client";

import { TermDb } from "@root/dal/dal.types";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { Badge } from "@ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/dialog";
import { useLocale, useTranslations } from "next-intl";

interface TermDialogProps {
  term: TermDb | null;
  onClose: () => void;
}
export function TermDialog({ term, onClose }: TermDialogProps) {
  const isOpen = !!term;
  const t = useTranslations("Public.termDialog");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;
  if (!term) {
    return null;
  }
  const otherLocale = i18nAppConfig.locales.find((l) => l !== currentLocale) || currentLocale;
  const primaryTranslation = term.translations?.[currentLocale];
  const secondaryTranslation = term.translations?.[otherLocale];
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{primaryTranslation?.title}</DialogTitle>
          {secondaryTranslation?.title && <DialogDescription className="text-lg">{secondaryTranslation.title}</DialogDescription>}
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-8 mt-4">
          <p className="text-lg text-muted-foreground">{primaryTranslation?.briefDescription}</p>

          {primaryTranslation?.fullDetail && (
            <div className="space-y-2">
              <h3 className="font-semibold text-xl border-b pb-2">{t("fullDescription")}</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{primaryTranslation.fullDetail}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="font-semibold text-xl border-b pb-2">{t("category")}</h3>
              <p className="text-muted-foreground">{term.categoryName || commonT("notAvailable")}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-xl border-b pb-2">{t("tags")}</h3>
              {term.tags?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {term.tags.map((tag: any) => (
                    <Badge key={tag.tagId} variant="secondary" className="text-base px-3 py-1">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">{commonT("notAvailable")}</p>
              )}
            </div>
          </div>
          {primaryTranslation?.references && primaryTranslation.references.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold text-xl border-b pb-2">{t("references")}</h3>
              <ul className="space-y-3 list-disc pl-5 text-muted-foreground">
                {primaryTranslation.references.map((ref) => (
                  <li key={ref.referenceId}>
                    {ref.url ? (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {ref.content}
                      </a>
                    ) : (
                      <span>{ref.content}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
