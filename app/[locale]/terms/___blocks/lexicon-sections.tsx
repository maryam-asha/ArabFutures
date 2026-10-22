import { NETWORK_MEMBERS, toNetworkMember } from "@app/[locale]/___blocks/home/data/members";
import { MemberCard } from "@app/[locale]/___blocks/home/member-card";
import { ProjectStage } from "@app/[locale]/___blocks/home/project-stage";
import type { AppLocale } from "@i18n/config";
import { findFeaturedMembers } from "@root/dal/members-dx";
import { getLocale, getTranslations } from "next-intl/server";

import { GoldPattern } from "./gold-pattern";

/** Split "Title: explanation" copy points into their two parts. */
function splitPoint(point: string) {
  const at = point.indexOf(":");
  return at === -1 ? { title: point, text: "" } : { title: point.slice(0, at).trim(), text: point.slice(at + 1).trim() };
}

export async function LexiconHero() {
  const t = await getTranslations("Public");
  // Same two-line title as the Lexicon project on the homepage ("The Arab / Futures Lexicon").
  const titleLines = t.raw("home.projects.items.lexicon.title") as string[];

  return (
    <section data-lexicon-hero className="afs-container grid items-center gap-10 pt-12 pb-14 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:pt-16">
      <div>
        <h1 data-intro className="afs-display text-light text-[clamp(3rem,5.4vw,4.75rem)]">
          {titleLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p data-intro data-hero-fade className="text-light/90 mt-4 max-w-[40rem] text-lg leading-relaxed md:text-[1.4rem]">
          {t("termsPage.lexicon.subtitle")}
        </p>
      </div>
      {/* The Lexicon composition from the homepage projects, assembling on load. */}
      <ProjectStage project="lexicon" className="mx-auto max-w-[24rem] md:ms-auto md:me-0" />
    </section>
  );
}

export async function LexiconStatement() {
  const t = await getTranslations("Public.termsPage.lexicon");

  return (
    <section className="afs-container py-28 lg:py-40">
      <p data-statement className="afs-display text-light mx-auto max-w-[78rem] text-center text-[clamp(2rem,3.9vw,3.6rem)] leading-[1.18] font-light normal-case italic rtl:not-italic">
        {t.rich("statement", { hl: (chunks) => <span className="text-gold">{chunks}</span> })}
      </p>
    </section>
  );
}

export async function WhyItMatters() {
  const t = await getTranslations("Public.termsPage.why_it_matters");
  const points = (t.raw("points") as string[]).map(splitPoint);

  return (
    <section aria-labelledby="why-title" className="afs-container py-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <h2 id="why-title" className="afs-display text-light text-[clamp(2.4rem,3.6vw,3.2rem)]">
          {t("title")}
        </h2>
        <p className="text-light/85 max-w-[30rem] leading-relaxed">
          {t("intro")} {t("subtitle")}
        </p>
      </div>
      <ul className="mt-10 grid gap-x-[4.5rem] gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {points.map((point, index) => (
          <li key={point.title} data-why-card>
            <div className="overflow-hidden">
              <GoldPattern variant={index} className="aspect-[3/4] w-full transition-transform duration-700 ease-out hover:scale-[1.04]" />
            </div>
            <h3 className="afs-display text-gold-pale mt-4 text-[1.9rem] leading-[1.15]">{point.title}</h3>
            <p className="text-light/85 mt-2 leading-relaxed">{point.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Numbered row that overflows to the side: pinned and scrolled horizontally on desktop, swiped on touch. */
export async function WhatMakesItDifferent() {
  const t = await getTranslations("Public.termsPage.whatMakesItDifferent");
  const locale = await getLocale();
  const points = (t.raw("points") as string[]).map(splitPoint);

  return (
    <section data-diff-section aria-labelledby="diff-title" className="overflow-hidden py-20 lg:flex lg:min-h-svh lg:flex-col lg:justify-center">
      <h2 id="diff-title" className="afs-container afs-display text-light text-[clamp(2.4rem,3.6vw,3.2rem)]">
        {t("title")}
        {locale === "ar" ? "؟" : "?"}
      </h2>
      <div data-diff-viewport className="mt-12 overflow-x-auto [scrollbar-width:none] lg:motion-safe:overflow-visible">
        <ol data-diff-track className="flex w-max snap-x snap-mandatory gap-16 px-[clamp(1.25rem,5.3vw,5rem)] pb-2">
          {points.map((point, index) => (
            <li key={point.title} className="flex w-[min(86vw,40rem)] shrink-0 snap-start items-end gap-6">
              <span aria-hidden className="afs-display text-gold text-[clamp(8rem,15vw,15rem)] leading-[0.8] font-medium">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="pb-2">
                <h3 className="afs-display text-gold-pale text-[clamp(1.6rem,2.4vw,2.2rem)]">{point.title}</h3>
                <p className="text-light/90 mt-2 max-w-[22rem] leading-relaxed">{point.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** Lexicon contacts. Uses the placeholder network members until real profiles exist. */
export async function ReadyToCollaborate() {
  const t = await getTranslations("Public.termsPage.lexicon.collaborate");
  const locale = (await getLocale()) as AppLocale;

  // Prefer featured DB members; fall back to placeholders so the section stays populated.
  const featured = await findFeaturedMembers().catch(() => []);
  const contacts = featured.length > 0 ? featured.map(toNetworkMember) : NETWORK_MEMBERS.slice(1, 3);

  return (
    <section aria-labelledby="collab-title" className="bg-gold text-ink">
      <div data-reveal className="afs-container flex flex-col items-center py-20 text-center lg:py-24">
        <h2 id="collab-title" className="afs-display text-[clamp(2.6rem,4.4vw,4rem)]">
          {t("title")}
        </h2>
        <p className="text-ink/90 mt-3 max-w-[48rem] text-lg md:text-xl">{t("description")}</p>
        <ul className="mt-14 flex flex-wrap justify-center gap-7 text-start">
          {contacts.map((member) => (
            <MemberCard key={member.id} member={member} locale={locale} tone="dark" />
          ))}
        </ul>
      </div>
    </section>
  );
}
