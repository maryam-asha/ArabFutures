import i18nAppConfig from "@root/i18n/config";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Inter, Tajawal } from "next/font/google";
import { notFound } from "next/navigation";
import type React from "react";

import "../globals.css";
import PublicFooter from "./___blocks/footer";
import PublicHeader from "./___blocks/header";

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

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Public.metadata" });
  const title = t("title");
  const description = t("description");

  return {
    title,
    description,
    openGraph: {
      siteName: title,
      title,
      description,
      type: "website",
      url: process.env.BASE_URL,
      locale,
    },
  };
}
export function generateStaticParams() {
  return i18nAppConfig.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(i18nAppConfig.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={locale === "ar" ? `${tajawal.variable} font-sans-arabic` : `${inter.variable} font-sans antialiased`}>
      <body className="bg-background text-foreground overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="grow">{children}</main>
            <PublicFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
