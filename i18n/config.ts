const i18nAppConfig = {
  locales: ["en", "ar"],
  defaultLocale: "ar",
  labels: {
    ar: "ع",
    en: "En",
  },
} as const;

export type AppLocale = (typeof i18nAppConfig.locales)[number];
export default i18nAppConfig;
