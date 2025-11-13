"use client";

import { Button } from "@components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { TermForEditDb } from "@root/dal/dal.types";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { Badge } from "@ui/badge";
import { Separator } from "@ui/separator";
import { Edit, FileTextIcon, LinkIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

import { ReviewTarget } from "./review-submission-dialog";

interface TermDialogBodyProps {
  term: TermForEditDb;
  onEdit: (target: ReviewTarget) => void;
}

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">{title}</h3>
    {children}
  </div>
);

export function TermDialogBody({ term, onEdit }: TermDialogBodyProps) {
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

  const EditButton = ({ onClick }: { onClick: () => void }) => (
    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground shrink-0" onClick={onClick}>
      <Edit className="h-4 w-4" />
      <span className="sr-only">{t("suggestEdit")}</span>
    </Button>
  );

  return (
    <div className="p-8 md:p-12">
      <DialogHeader>
        {term.categoryName && <span className="font-semibold text-primary mb-2">{term.categoryName}</span>}
        <DialogTitle className="text-3xl font-bold leading-tight md:text-4xl flex items-center gap-2">
          {primaryTitle}
          <EditButton onClick={() => onEdit({ identifier: `default-${currentLocale}`, fieldKey: "name", currentValue: primaryTitle })} />
        </DialogTitle>
        {otherDefaultTitle && (
          <DialogDescription className="flex items-center gap-2 text-muted-foreground text-lg -mt-1">
            <span>{otherDefaultTitle}</span>
            <EditButton onClick={() => onEdit({ identifier: `default-${otherDefaultLocale}`, fieldKey: "name", currentValue: otherDefaultTitle })} />
          </DialogDescription>
        )}
      </DialogHeader>

      {primaryBrief && (
        <p className="mt-6 text-lg text-foreground/80 leading-relaxed flex items-start gap-2">
          <span>{primaryBrief}</span>
          <EditButton onClick={() => onEdit({ identifier: `default-${currentLocale}`, fieldKey: "briefDescription", currentValue: primaryBrief })} />
        </p>
      )}

      <Separator className="my-8" />

      <div className="space-y-6">
        {primaryTranslation?.fullDescription && (
          <DetailSection title={t("fullDescription")}>
            <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed flex items-start gap-2">
              <p>{primaryTranslation.fullDescription}</p>
              <EditButton onClick={() => onEdit({ identifier: `default-${currentLocale}`, fieldKey: "fullDescription", currentValue: primaryTranslation.fullDescription! })} />
            </div>
          </DetailSection>
        )}
        {sortedMoreTranslations.length > 0 && (
          <DetailSection title={t("otherTranslations")}>
            <div className="space-y-6">
              {sortedMoreTranslations.map((trans, index) => (
                <div key={trans.locale} className="text-sm border-b pb-4 last:border-b-0">
                  <Badge variant="outline" className="mb-2 font-mono">
                    {trans.locale}
                  </Badge>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-foreground text-base">{trans.name}</p>
                    <EditButton onClick={() => onEdit({ identifier: `more-${index}`, fieldKey: "name", currentValue: trans.name })} />
                  </div>
                  {trans.briefDescription && (
                    <div className="flex items-start justify-between gap-2 mt-1">
                      <p className="text-muted-foreground">{trans.briefDescription}</p>
                      <EditButton onClick={() => onEdit({ identifier: `more-${index}`, fieldKey: "briefDescription", currentValue: trans.briefDescription! })} />
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
  );
}
