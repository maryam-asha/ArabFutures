import { getTranslations } from "next-intl/server";

import { ContactForm } from "./contact-form";

export default async function ContactPage() {
  const t = await getTranslations("Public.contact");

  return (
    <div className="container py-16 md:py-24">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t("description")}</p>
      </div>
      <div className="max-w-xl mx-auto mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
