const i18nAppConfig = {
  locales: ["en", "ar"],
  defaultLocale: "ar",
  labels: {
    ar: "ع",
    en: "En",
  },
} as const;

export type AppLocale = (typeof i18nAppConfig.locales)[number];

/** Narrows an untrusted value to a known locale. */
export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (i18nAppConfig.locales as readonly string[]).includes(value);
}

/**
 * Validates an untrusted locale before it is interpolated into SQL JSON paths by the DAL.
 * The locale cannot be parameterized (it is part of a `->> '$.<locale>'` path), so every
 * code path that reaches the DAL must go through this allow-list check.
 */
export function assertAppLocale(value: unknown): AppLocale {
  if (!isAppLocale(value)) {
    throw new Error(`Invalid locale: ${String(value)}`);
  }
  return value;
}

export default i18nAppConfig;
