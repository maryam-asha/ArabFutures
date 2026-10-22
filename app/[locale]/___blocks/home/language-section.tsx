import { cn } from "@lib/utils";
import { getTranslations } from "next-intl/server";

import { buildConstellation } from "./constellation";

const { stars, links } = buildConstellation();
const byId = new Map(stars.map((s) => [s.id, s]));

/**
 * "A language that imagines, transforms the world." over a dot grid and a constellation.
 * The travelling square becomes the star marked `data-square-anchor="star"`.
 */
export default async function LanguageSection() {
  const t = await getTranslations("Public.home.language");

  return (
    <section id="language" data-section="language" aria-labelledby="language-title" className="afs-dotgrid relative overflow-hidden">
      <div data-language-stage className="relative flex min-h-[80svh] items-center justify-center py-28 lg:min-h-svh">
        <svg aria-hidden data-constellation-lines viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
          {links.map(({ a, b }) => {
            const s = byId.get(a)!;
            const e = byId.get(b)!;
            return (
              <line
                key={`${a}-${b}`}
                data-link
                data-x2={e.x}
                data-y2={e.y}
                x1={s.x}
                y1={s.y}
                x2={e.x}
                y2={e.y}
                stroke="#ffe2af"
                strokeOpacity={0.32}
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>
        {/* Pointer-proximity links are drawn here at runtime (hover-capable desktops only). */}
        <svg aria-hidden data-hover-lines className="pointer-events-none absolute inset-0 size-full" />

        <div aria-hidden data-stars className="pointer-events-none absolute inset-0">
          {stars.map((s) => (
            <span
              key={s.id}
              data-star={s.isSquare ? undefined : ""}
              data-square-anchor={s.isSquare ? "star" : undefined}
              data-rot={s.isSquare ? "45" : undefined}
              data-color={s.isSquare ? "#ffe2af" : undefined}
              data-glow={s.isSquare ? "1" : undefined}
              className={cn("absolute block", s.desktopOnly && "max-lg:hidden")}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, transform: "translate(-50%, -50%) rotate(45deg)" }}
            >
              <span
                data-twinkle
                className={cn("block size-full", s.bright ? "bg-gold shadow-[0_0_12px_2px_rgb(206_168_100/0.4)]" : "bg-gold-pale shadow-[0_0_7px_1px_rgb(255_226_175/0.28)]", s.isSquare && "bg-gold-pale")}
                style={{ opacity: s.bright ? 0.9 : 0.55 }}
              />
            </span>
          ))}
        </div>

        <h2 id="language-title" className="afs-display relative z-10 px-5 text-center text-[clamp(2.1rem,5.4vw,5.1rem)] font-semibold">
          <span data-language-line className="text-light block">
            {t("line1")}
          </span>
          <span data-language-line className="text-gold-pale block">
            {t("line2")}
          </span>
        </h2>
      </div>
    </section>
  );
}
