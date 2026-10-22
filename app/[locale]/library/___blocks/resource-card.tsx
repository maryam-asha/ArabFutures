import { AppLocale } from "@i18n/config";
import { cn } from "@lib/utils";
import type { ResourceDb } from "@root/dal/dal.types";
import { useTranslations } from "next-intl";

/** A single Library resource card: image background (or dark), type badge, title, description, authors, date. */
export function ResourceCard({ resource, locale }: { resource: ResourceDb; locale: AppLocale }) {
  const t = useTranslations("Public.library");
  const c = resource.content;
  const title = c.title?.[locale] || c.title?.en || c.title?.ar || "—";
  const description = c.description?.[locale] || c.description?.en || "";
  const authors = (c.authors ?? []).join(" | ");
  const hasImage = !!c.imageUrl;

  const inner = (
    <article className={cn("group relative flex min-h-[18rem] flex-col justify-end overflow-hidden border border-light/15 p-6 transition-colors hover:border-gold/70", !hasImage && "bg-ink-deep")}>
      {hasImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- resource images are arbitrary external URLs. */}
          <img src={c.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />
        </>
      )}
      <span className="bg-gold text-ink absolute end-4 top-4 z-10 px-2.5 py-1 text-xs font-medium capitalize">{t(`types.${resource.type}`)}</span>

      <div className="relative z-10">
        <h3 className="text-light text-xl leading-tight font-semibold">{title}</h3>
        {description && <p className="text-light/80 mt-2 line-clamp-2 text-sm leading-relaxed">{description}</p>}
        <div className="bg-light/15 my-4 h-px w-full" />
        {authors && <p className="text-light text-sm font-medium">{authors}</p>}
        {c.date && <p className="text-light/70 mt-1 text-xs">{c.date}</p>}
      </div>
    </article>
  );

  if (c.url) {
    return (
      <a href={c.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    );
  }
  return inner;
}
