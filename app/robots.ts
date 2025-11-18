import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error("BASE_URL is not defined in environment variables");
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/setup-admin/"], // Block crawlers from admin areas
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
