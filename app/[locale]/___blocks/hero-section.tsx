import { getTranslations } from "next-intl/server";

import { Cta } from "./afs-cta";

const JOIN_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeM17A9FAn27cf0euJYTqxGc-ZHxpAQbC8JBfuGjEq9HAS2IA/viewform";

export default async function HeroSection() {
  const t = await getTranslations("Public.home.hero");

  return (
    <section id="hero" data-section="hero" className="relative flex min-h-[calc(100svh-5.5rem)] items-center justify-center py-20">
      <div className="afs-container flex flex-col items-center text-center">
        <h1 data-intro className="afs-display text-light text-[clamp(2.6rem,7vw,6.6rem)]">
          <span data-hero-line className="block">
            {t("lead")} <span className="text-gold">{t("accent")}</span>
          </span>
          <span data-hero-line className="block">
            {t("line2")}
          </span>
          <span data-hero-line className="text-gold mt-[0.12em] block text-[0.55em] font-light">
            {t("subtitle")}
            {/* The journey's starting point: the square sits like a full stop at the end of the line. */}
            <span
              aria-hidden
              data-square-anchor="hero"
              data-rot="0"
              data-color="#cea864"
              className="bg-gold relative ms-[0.22em] inline-block size-[0.15em] align-baseline before:absolute before:-inset-4 before:content-['']"
            />
          </span>
        </h1>

        <p data-intro data-hero-fade className="text-light/90 mt-8 max-w-[42rem] text-lg leading-relaxed text-balance md:text-[1.4rem]">
          {t("description")}
        </p>

        <div data-intro data-hero-fade className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:gap-24">
          <Cta href="/#projects">{t("ctaPrimary")}</Cta>
          <Cta href={JOIN_FORM_URL} target="_blank" rel="noopener noreferrer" variant="text">
            {t("ctaSecondary")}
          </Cta>
        </div>
      </div>
    </section>
  );
}
