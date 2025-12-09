import { getCsrfTokenAction } from "@app/auth-actions";
import { SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";
import { auth } from "@lib/auth";
import { getPendingReviewCount } from "@root/dal/reviews-dx";
import { Separator } from "@ui/separator";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Inter, Tajawal } from "next/font/google";
import { Toaster } from "sonner";

import "../globals.css";
import CsrfManager from "./___blocks/csrf-provider-client";
import DashboardSidebar from "./___blocks/dashboard-sidebar";
import { DynamicBreadcrumb } from "./___blocks/dynamic-breadcrumb";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
});

export default async function DashboardShell({ children }: { children: React.ReactNode }) {
  await auth.protectPage();
  const initialCsrfToken = await getCsrfTokenAction();
  const messages = await getMessages();
  const currentLocale = await getLocale();
  const t = await getTranslations();
  const pendingReviewCount = await getPendingReviewCount();

  return (
    <html lang={currentLocale} dir={currentLocale === "ar" ? "rtl" : "ltr"} className={currentLocale === "ar" ? `${tajawal.variable} font-sans-arabic` : `${inter.variable} font-sans antialiased`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={currentLocale}>
          <div className="flex min-h-dvh w-full">
            <SidebarProvider>
              <DashboardSidebar pendingReviewCount={pendingReviewCount} />
              <div className="flex flex-1 flex-col">
                <header className="bg-card sticky top-0 z-50 border-b">
                  <div className="flex items-center justify-between gap-6 px-4 py-2 sm:px-6">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger />
                      <Separator orientation="vertical" className="hidden h-4! sm:block" />
                      <DynamicBreadcrumb />
                    </div>
                  </div>
                </header>
                <main className="size-full flex-1 px-4 py-6 sm:px-6">
                  <CsrfManager initialToken={initialCsrfToken}>{children}</CsrfManager>
                </main>
                <footer>
                  <div className="text-muted-foreground flex size-full items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
                    <p className="text-sm text-balance max-sm:text-center">
                      {`©${new Date().getFullYear()} `}
                      <a href="/" className="text-primary hover:underline">
                        {t("Public.hero.title")}
                      </a>
                    </p>
                  </div>
                </footer>
              </div>
            </SidebarProvider>
          </div>
        </NextIntlClientProvider>
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
