"use client";

import i18nAppConfig, { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import { TermDb } from "@root/dal/dal.types";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

/** Lexicon card: tags, the term in the page language (gold) and its counterpart, a brief description, Read more. */
export default function TermCard({ term, onSelect, index = 0 }: { term: TermDb; onSelect: () => void; index?: number }) {
  const t = useTranslations("Public.termCard");
  const commonT = useTranslations("Common");
  const currentLocale = useLocale() as AppLocale;
  const otherLocale = i18nAppConfig.locales.find((locale) => locale !== currentLocale) || currentLocale;

  const primaryTitle = term.content.default[currentLocale]?.name || commonT("notAvailable");
  const secondaryTitle = term.content.default[otherLocale]?.name;
  const briefDescription = term.content.default[currentLocale]?.briefDescription || t("noDescription");
  const chips = term.tags.length > 0 ? term.tags.map((tag) => ({ key: `tag-${tag.tagId}`, label: tag.name[currentLocale] })) : term.categoryName ? [{ key: "category", label: term.categoryName }] : [];

  return (
    <article
      className="group border-light/35 hover:border-gold/80 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 flex h-full flex-col border p-8 transition-colors duration-300 motion-safe:fill-mode-both motion-safe:duration-500"
      style={{ animationDelay: `${(index % 12) * 45}ms` }}
    >
      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {chips.slice(0, 3).map((chip) => (
            <li key={chip.key} className="bg-ink-deep text-light/85 px-3 py-1.5 text-[0.8rem] font-medium">
              {chip.label}
            </li>
          ))}
        </ul>
      )}

      <h3 lang={currentLocale} className={cn("text-gold text-[1.6rem] leading-tight font-semibold", chips.length > 0 ? "mt-8" : "mt-2")}>
        {primaryTitle}
      </h3>
      {secondaryTitle && (
        // Aligned to the opposite side of the title (as in the design); the span keeps the other language's own direction.
        <p className="text-light/85 mt-1 text-end text-lg">
          <span lang={otherLocale} dir={otherLocale === "ar" ? "rtl" : "ltr"}>
            {secondaryTitle}
          </span>
        </p>
      )}

      <p className="text-light/85 mt-6 line-clamp-3 grow leading-relaxed">{briefDescription}</p>

      <button
        type="button"
        onClick={onSelect}
        className="afs-label border-light/70 text-light hover:border-gold hover:text-gold mt-8 inline-flex items-center gap-3 self-start border px-4 py-2 text-[0.8rem] transition-colors"
      >
        {t("readMore")}
        <span className="sr-only">: {primaryTitle}</span>
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
      </button>
    </article>
  );
}
