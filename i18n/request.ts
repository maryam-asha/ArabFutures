import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";

import i18nAppConfig from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(i18nAppConfig.locales, requested) ? requested : i18nAppConfig.defaultLocale;
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
