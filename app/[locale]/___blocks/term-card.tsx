import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import i18nAppConfig, { AppLocale } from "@i18n/config";
import { TermDb } from "@root/dal/dal.types";
import { Badge } from "@ui/badge";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function TermCard({ term, onSelect }: { term: TermDb; onSelect: () => void }) {
  const t = useTranslations("Public.termCard");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;
  const otherLocale = i18nAppConfig.locales.find((locale) => locale !== currentLocale) || currentLocale;

  const primaryTranslation = term.translations?.[currentLocale];
  const secondaryTranslation = term.translations?.[otherLocale];

  const title = primaryTranslation?.title || commonT("notAvailable");
  const briefDescription = primaryTranslation?.briefDescription || t("noDescription");

  return (
    <Card className="group relative flex flex-col overflow-hidden term-card transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <CardHeader>
        {term.categoryName && (
          <Badge variant="outline" className="w-fit mb-3 font-medium">
            {term.categoryName}
          </Badge>
        )}
        <CardTitle className="text-xl leading-tight">{title}</CardTitle>
        {secondaryTranslation?.title && <CardDescription>{secondaryTranslation.title}</CardDescription>}
      </CardHeader>

      <CardContent className="grow">
        <p className="text-muted-foreground line-clamp-3">{briefDescription}</p>
      </CardContent>

      <div className="p-6 pt-0 mt-auto">
        <Button onClick={onSelect} variant="outline" className="w-full">
          {t("readMore")}
          <ArrowRight className={`ms-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${currentLocale === "ar" ? "rotate-180 group-hover:-translate-x-1" : ""}`} />
        </Button>
      </div>
    </Card>
  );
}
