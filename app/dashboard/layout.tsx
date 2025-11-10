import LanguageDropdown from "@components/blocks/dropdown-language";
import ProfileDropdown from "@components/blocks/dropdown-profile";
import { SidebarProvider, SidebarTrigger } from "@components/ui/sidebar";
import { auth } from "@lib/auth";
import { getPendingReviewCount } from "@root/dal/reviews-dx";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@ui/breadcrumb";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { LanguagesIcon } from "lucide-react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { Inter, Tajawal } from "next/font/google";

import "../globals.css";
import CsrfManager from "./___blocks/csrf-provider-client";
import DashboardSidebar from "./___blocks/dashboard-sidebar";

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

export default async function DashboardShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await auth.protectPage();
  const messages = await getMessages();
  const currentLocale = await getLocale();
  const t = await getTranslations("Dashboard");
  const publicT = await getTranslations("Public");

  const pendingReviewCount = await getPendingReviewCount();

  return (
    <html lang={currentLocale} dir={currentLocale === "ar" ? "rtl" : "ltr"} className={currentLocale === "ar" ? `${tajawal.variable} font-sans-arabic` : `${inter.variable} font-sans antialiased`}>
      <body className="bg-neutral-50 text-neutral-900 overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={currentLocale}>
          <div className="flex min-h-dvh w-full">
            <SidebarProvider>
              <DashboardSidebar pendingReviewCount={pendingReviewCount} />
              <div className="flex flex-1 flex-col">
                <header className="bg-card sticky top-0 z-50 border-b">
                  <div className="flex  items-center justify-between gap-6 px-4 py-2 sm:px-6">
                    <div className="flex items-center gap-4">
                      <SidebarTrigger className="[&_svg]:size-5!" />
                      <Separator orientation="vertical" className="hidden h-4! sm:block" />
                      <Breadcrumb className="hidden sm:block">
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbLink href="#">{t("home")}</BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">{t("overview")}</BreadcrumbLink>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <LanguageDropdown
                        trigger={
                          <Button variant="ghost" size="icon">
                            <LanguagesIcon />
                          </Button>
                        }
                      />
                      <ProfileDropdown
                        trigger={
                          <Button variant="ghost" size="icon" className="size-9.5">
                            <Avatar className="size-9.5 rounded-md">
                              <AvatarImage src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png" />
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                          </Button>
                        }
                      />
                    </div>
                  </div>
                </header>
                <main className="size-full flex-1 px-4 py-6 sm:px-6">
                  <CsrfManager>{children}</CsrfManager>
                </main>
                <footer>
                  <div className="text-muted-foreground flex size-full items-center justify-between gap-3 px-4 py-3 max-sm:flex-col sm:gap-6 sm:px-6">
                    <p className="text-sm text-balance max-sm:text-center">
                      {`©${new Date().getFullYear()} `}
                      <a href="#" className="text-primary">
                        {publicT("hero.title")}
                      </a>
                    </p>
                  </div>
                </footer>
              </div>
            </SidebarProvider>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
