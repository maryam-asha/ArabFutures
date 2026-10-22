import CsrfManager from "@app/dashboard/___blocks/csrf-provider-client";
import { cn } from "@lib/utils";
import i18nAppConfig from "@root/i18n/config";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Barlow, Barlow_Condensed, Tajawal } from "next/font/google";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type React from "react";
import { Toaster } from "sonner";

import "../globals.css";
import PublicFooter from "./___blocks/footer";
import PublicHeader from "./___blocks/header";

const barlow = Barlow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600"],
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-barlow-condensed",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-tajawal",
  weight: ["400", "500", "700"],
});

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await props.params;

  const t = await getTranslations({ locale, namespace: "Public.metadata" });
  const siteName = t("siteName");
  const description = t("description");

  return {
    metadataBase: new URL(process.env.BASE_URL!),
    title: siteName,
    description: description,

    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        "x-default": `/${i18nAppConfig.defaultLocale}`,
      },
    },

    openGraph: {
      title: siteName,
      description: description,
      url: "/",
      siteName: siteName,

      images: [
        {
          url: "/og_image.png",
          width: 1200,
          height: 630,
          alt: `Logo for ${siteName}`,
        },
      ],
      locale: locale,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: description,
      images: ["/og_image.png"],
    },
  };
}

// Runs before first paint: lets CSS hide intro elements only when GSAP is going to reveal them.
const MOTION_GATE_SCRIPT = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("motion-ok")}catch(e){}`;

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
  const cookieStore = await cookies();
  const csrfToken = cookieStore.get("csrf_token")?.value ?? "";

  return (
    // suppressHydrationWarning: the inline script below adds `motion-ok` before hydration.
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={cn("theme-afs", barlow.variable, barlowCondensed.variable, tajawal.variable)} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground font-sans antialiased overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CsrfManager initialToken={csrfToken}>
            <div className="flex flex-col min-h-dvh">
              <PublicHeader />
              <main className="grow">{children}</main>
              <PublicFooter />
            </div>
          </CsrfManager>
        </NextIntlClientProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
