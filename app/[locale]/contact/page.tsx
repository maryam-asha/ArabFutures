import { LinkedinIcon, MailIcon, TwitterIcon } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactForm } from "./contact-form";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Public.metadata.contact" });
  const siteName = await getTranslations({ locale, namespace: "Public.metadata" }).then((t) => t("siteName"));

  return {
    title: `${t("title")} | ${siteName}`,
    description: t("description"),

    openGraph: {
      title: `${t("title")} | ${siteName}`,
      description: t("description"),
      url: `/${locale}/contact`,
    },

    twitter: {
      title: `${t("title")} | ${siteName}`,
      description: t("description"),
    },

    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: "/en/contact",
        ar: "/ar/contact",
      },
    },
  };
}

const ReasonItem = ({ title, description }: { title: string; description: string }) => (
  <div className="relative ps-8">
    <div className="absolute start-0 top-1 h-2 w-2 rounded-full bg-primary"></div>
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default async function ContactPage() {
  const t = await getTranslations("Public.contact");

  const reasons = [
    { id: "collaborate", title: t("reasons.collaborate.title"), description: t("reasons.collaborate.description") },
    { id: "learn", title: t("reasons.learn.title"), description: t("reasons.learn.description") },
    { id: "speak", title: t("reasons.speak.title"), description: t("reasons.speak.description") },
    { id: "join", title: t("reasons.join.title"), description: t("reasons.join.description") },
  ];

  return (
    <div className="container mx-auto py-24 sm:py-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start max-w-6xl mx-auto">
        {/* --- LEFT COLUMN: Information & Reasons --- */}
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">{t("whyConnectTitle")}</h2>
            <div className="space-y-6">
              {reasons.map((reason) => (
                <ReasonItem key={reason.id} title={reason.title} description={reason.description} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground">{t("contactInfoTitle")}</h3>
              <a href={`mailto:${t("emailAddress")}`} className="flex items-center gap-2 mt-2 text-muted-foreground hover:text-primary transition-colors">
                <MailIcon className="h-4 w-4" />
                <span>{t("emailAddress")}</span>
              </a>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{t("socialTitle")}</h3>
              <div className="flex items-center gap-4 mt-2">
                <a href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                  <TwitterIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-6">{t("formTitle")}</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
