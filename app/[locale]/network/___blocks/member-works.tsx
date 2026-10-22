import { AppLocale } from "@i18n/config";
import type { MemberWorkDb } from "@root/dal/dal.types";

type LocaleRecord = Partial<Record<AppLocale, string>> | undefined;

function pick(field: LocaleRecord, locale: AppLocale): string {
  if (!field) return "";
  return field[locale] || field[locale === "ar" ? "en" : "ar"] || "";
}

/** The "Selected Works" row from the member detail design: a horizontal, scroll-snapping card track. */
export function MemberWorks({ works, locale, title, intro, blogLabel }: { works: MemberWorkDb[]; locale: AppLocale; title: string; intro: string; blogLabel: string }) {
  if (works.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="afs-display text-light text-[clamp(1.8rem,3vw,2.6rem)]">{title}</h2>
      <p className="text-light/80 mt-2 max-w-[48rem]">{intro}</p>

      <div className="mt-8 overflow-x-auto [scrollbar-width:none]">
        <ul className="flex w-max snap-x snap-mandatory gap-6 pb-2">
          {works.map((work, index) => {
            const workTitle = pick(work.title, locale);
            const workDesc = pick(work.description, locale);
            const meta = [work.date, work.readTime].filter(Boolean).join(" · ");
            const card = (
              <article className="border-light/15 flex h-full w-[min(82vw,22rem)] shrink-0 snap-start flex-col border">
                <div className="relative aspect-[16/10] overflow-hidden bg-[linear-gradient(160deg,#2f2f2f,#1a1a1a)]">
                  {work.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- work images are arbitrary external URLs.
                    <img src={work.imageUrl} alt={workTitle} className="h-full w-full object-cover" />
                  )}
                  <span className="bg-gold/90 text-ink absolute end-3 top-3 px-2 py-0.5 text-xs font-medium">{work.type || blogLabel}</span>
                </div>
                <div className="flex grow flex-col p-5">
                  {meta && <p className="text-light/60 text-xs">{meta}</p>}
                  <h3 className="text-light mt-2 text-lg font-semibold">{workTitle}</h3>
                  {workDesc && <p className="text-light/75 mt-2 line-clamp-2 text-sm leading-relaxed">{workDesc}</p>}
                  {work.tags && work.tags.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {work.tags.map((tag, i) => (
                        <li key={i} className="bg-ink-deep text-light/85 px-3 py-1 text-xs font-medium">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            );
            return (
              <li key={index}>
                {work.url ? (
                  <a href={work.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {card}
                  </a>
                ) : (
                  card
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
