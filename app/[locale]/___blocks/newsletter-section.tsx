import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { NewsletterForm } from "./newsletter-form";

export default async function NewsletterSection() {
  const t = await getTranslations("Public.newsletter");

  return (
    <section id="newsletter" className="py-16 sm:py-24">
      <div className="container mx-auto">
        <div className="bg-muted/40 p-8 md:p-12 lg:p-16 rounded-2xl flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t("title")}</h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("description")}</p>
          <div className="flex justify-center mt-8 w-full">
            <Suspense fallback={<div className="h-12 w-full max-w-lg mx-auto bg-input rounded-md" />}>
              <NewsletterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
