import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { BookText, Gem, MessageSquarePlus } from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DashboardHomePage() {
  const t = await getTranslations("Dashboard.pages.home");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-lg text-gray-600">{t("welcome")}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("title")}</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">{t("dataToBePopulated")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("publishedTerms")}</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">{t("dataToBePopulated")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("pendingSuggestions")}</CardTitle>
            <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">{t("dataToBePopulated")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
