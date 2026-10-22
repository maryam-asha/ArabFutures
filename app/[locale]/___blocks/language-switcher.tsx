"use client";

import i18nAppConfig from "@i18n/config";
import { usePathname, useRouter } from "@i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

/** Two locales, so a single toggle that names the other language. */
export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Public.nav");
  const nextLocale = i18nAppConfig.locales.find((code) => code !== locale) ?? i18nAppConfig.defaultLocale;

  return (
    <button
      type="button"
      disabled={isPending}
      lang={nextLocale}
      onClick={() => startTransition(() => router.replace(pathname, { locale: nextLocale }))}
      className="text-light hover:text-gold border-light/30 hover:border-gold flex h-9 min-w-9 items-center justify-center border px-2 text-sm font-medium transition-colors disabled:opacity-50"
    >
      {i18nAppConfig.labels[nextLocale]}
      <span className="sr-only">{t("change-language-sr")}</span>
    </button>
  );
}
