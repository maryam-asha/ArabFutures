import { getTranslations } from "next-intl/server";

import { Cta } from "../afs-cta";

/** The Figma shows a placeholder ("A nice quote"); this uses the approved line from the Lexicon copy. */
export async function QuoteSection() {
  const t = await getTranslations("Public.termsPage.why_it_matters");

  return (
    <section aria-label={t("title")} className="afs-container py-24 lg:py-36">
      <blockquote data-reveal className="afs-display text-light mx-auto max-w-[60rem] text-center text-[clamp(2rem,4.2vw,3.6rem)] font-light italic rtl:not-italic">
        “{t("intro")}”
      </blockquote>
    </section>
  );
}

export async function GetInvolvedSection() {
  const t = await getTranslations("Public.home");

  return (
    <section aria-labelledby="involved-title" className="grid lg:grid-cols-2">
      <div data-reveal className="flex justify-end">
        <div className="w-full max-w-[756px] px-[clamp(1.25rem,5.3vw,5rem)] py-16 lg:py-20">
          <h2 id="involved-title" className="afs-display text-light text-[clamp(2.4rem,3.4vw,3.2rem)]">
            {t("involved.title")}
          </h2>
          <p className="text-light/90 mt-4 text-lg leading-relaxed">
            {t("involved.line1")}
            <br />
            {t("involved.line2")}
          </p>
          <Cta href="/contact" variant="text" size="sm" className="mt-8">
            {t("involved.cta")}
          </Cta>
        </div>
      </div>
      <div data-reveal className="bg-gold flex">
        <div className="w-full max-w-[756px] px-[clamp(1.25rem,5.3vw,5rem)] py-16 lg:py-20">
          <h2 className="afs-display text-ink text-[clamp(2.4rem,3.4vw,3.2rem)]">{t("support.title")}</h2>
          <p className="text-ink/90 mt-4 text-lg leading-relaxed">{t("support.description")}</p>
          <Cta href="/contact" variant="dark-text" size="sm" className="mt-8">
            {t("support.cta")}
          </Cta>
        </div>
      </div>
    </section>
  );
}
