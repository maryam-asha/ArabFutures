import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getDashboardStats } from "@root/dal/stats-dx";
import { findRecentTerms } from "@root/dal/terms-dx";
import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import { BookText, Clock, Gem, MessageSquarePlus } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function DashboardHomePage() {
  const t = await getTranslations();
  const locale = (await getLocale()) as AppLocale;

  const [stats, recentTerms] = await Promise.all([getDashboardStats(), findRecentTerms(locale, 5)]);

  const defaultLocale = i18nAppConfig.defaultLocale;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="afs-display text-3xl tracking-tight">{t("Dashboard.pages.home.title")}</h1>
        <p className="mt-1 text-lg text-muted-foreground">{t("Dashboard.pages.home.welcome")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Dashboard.pages.home.totalTerms")}</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTerms}</div>
            <p className="text-xs text-muted-foreground">{t("Dashboard.pages.home.totalTermsDesc")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("Dashboard.pages.home.publishedTerms")}</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedTerms}</div>
            <p className="text-xs text-muted-foreground">{t("Dashboard.pages.home.publishedTermsDesc")}</p>
          </CardContent>
        </Card>
        <Link href="/dashboard/approvals" className="block hover:border-primary transition-colors">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("Dashboard.pages.home.pendingSuggestions")}</CardTitle>
              <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTerms}</div>
              <p className="text-xs text-muted-foreground">{t("Dashboard.pages.home.pendingSuggestionsDesc")}</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t("Dashboard.pages.home.recentActivity")}
            </CardTitle>
            <CardDescription>{t("Dashboard.pages.home.recentActivityDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTerms.length > 0 ? (
                recentTerms.map((term) => (
                  <div key={term.termId} className="flex items-center justify-between gap-4">
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium truncate">{term.content.default[locale]?.name || term.content.default[defaultLocale]?.name || `Term #${term.termId}`}</p>
                      <p className="text-sm text-muted-foreground">{term.categoryName || t("Dashboard.forms.placeholders.selectCategory")}</p>
                    </div>
                    <Badge variant={term.status === "published" ? "secondary" : "outline"} className="capitalize">
                      {t(`Dashboard.forms.statuses.${term.status}` as any)}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/terms/${term.termId}`}>{t("Common.actions.view")}</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-4">{t("Dashboard.pages.home.noRecentActivity")}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>{t("Dashboard.pages.home.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 w-full flex-1 justify-center">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard/terms/create">{t("Dashboard.pages.home.addTerm")}</Link>
            </Button>
            <Button asChild variant="secondary" className="w-full" size="lg">
              <Link href="/dashboard/term-categories/create">{t("Dashboard.pages.home.addCategory")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
