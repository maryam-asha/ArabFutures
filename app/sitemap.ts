import i18nAppConfig from "@i18n/config";
import { findTerms } from "@root/dal/terms-dx";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined in environment variables");
  }

  // 1. Static pages (Home, Contact, etc.)
  const staticRoutes = ["", "/contact", "/terms"].flatMap((route) =>
    i18nAppConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
    })),
  );

  // 2. Dynamic pages (e.g., individual terms)
  // Fetch all published terms to generate their sitemap entries
  const { data: terms } = await findTerms({ locale: "en", status: "published", limit: 10000 }); // Fetch a large number
  const termRoutes = terms.flatMap((term) =>
    i18nAppConfig.locales.map((locale) => ({
      url: `${baseUrl}/${locale}/terms/${term.termId}`, // Assuming this is your URL structure
      lastModified: new Date(term.updatedAt),
    })),
  );

  return [...staticRoutes, ...termRoutes];
}
