import i18nAppConfig, { AppLocale } from "@root/i18n/config";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import type React from "react";

import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const appLocale = locale as AppLocale;

  const title = "Terms";
  const description = "all terms";
  const keywords = "";
  const ogTitle = title;
  const ogDescription = description;
  const ogImage = "/default-og-image.jpg";
  const twitterImage = "/default-twitter-image.jpg";

  return {
    title,
    description,
    keywords: keywords.split(",").map((k) => k.trim()),
    alternates: {
      canonical: process.env.BASE_URL,
    },
    openGraph: {
      siteName: "HOMAM Jewelry",
      title: ogTitle,
      description: ogDescription,
      type: "website",
      url: process.env.BASE_URL,
      images: [{ url: ogImage }],
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [twitterImage],
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

  return (
    <html lang={locale} className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
