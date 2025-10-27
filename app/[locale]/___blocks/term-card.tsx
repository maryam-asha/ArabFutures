import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function TermCard({ term, onSelect }: { term: TermDb; onSelect: () => void }) {
  const t = useTranslations("Public.termCard");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;
  const otherLocale = i18nAppConfig.locales.find((locale) => locale !== currentLocale) || currentLocale;

  const primaryTranslation = term.translations?.[currentLocale] || { title: commonT("notAvailable") };
  const secondaryTranslation = term.translations?.[otherLocale];

  return (
    <Card className="flex flex-col group">
      <CardHeader>
        <CardTitle className="text-xl">{primaryTranslation.title}</CardTitle>
        {secondaryTranslation?.title && <CardDescription>{secondaryTranslation.title}</CardDescription>}
      </CardHeader>
      <CardContent className="grow">
        <p className="text-muted-foreground line-clamp-3">
          {primaryTranslation.briefDescription || t("noDescription")} {/* FIX */}
        </p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button onClick={onSelect} variant="outline" className="w-full">
          {t("readMore")} {/* FIX */}
          <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </Card>
  );
}
