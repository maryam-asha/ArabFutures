import { defineRouting } from "next-intl/routing";

import i18nAppConfig from "./config";

export const routing = defineRouting({
  locales: i18nAppConfig.locales,
  defaultLocale: i18nAppConfig.defaultLocale,
  localePrefix: "as-needed",
});
