import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Cta } from "./afs-cta";
import { PROJECT_ORDER, type ProjectId } from "./home/project-layouts";
import { ProgressDashes, ProjectStage } from "./home/project-stage";

type CtaKey = "exploreLibrary" | "support" | "learnMore" | "partner";
type ProjectCta = { key: CtaKey; href: string; variant: "outline" | "text" };

/** Only real destinations are linked; projects without a page yet show "Coming soon" instead of a dead link. */
const PROJECT_CTAS: Record<ProjectId, { comingSoon?: boolean; ctas: ProjectCta[] }> = {
  library: { comingSoon: true, ctas: [{ key: "support", href: "/contact", variant: "text" }] },
  lexicon: {
    ctas: [
      { key: "learnMore", href: "/terms", variant: "outline" },
      { key: "partner", href: "/contact", variant: "text" },
    ],
  },
  network: {
    ctas: [
      { key: "learnMore", href: "/#network", variant: "outline" },
      { key: "partner", href: "/contact", variant: "text" },
    ],
  },
  diploma: { comingSoon: true, ctas: [{ key: "partner", href: "/contact", variant: "text" }] },
  children: { ctas: [{ key: "partner", href: "/contact", variant: "text" }] },
};

export default async function ProjectsSection() {
  const t = await getTranslations("Public.home.projects");
  const total = PROJECT_ORDER.length;

  const panel = (id: ProjectId, index: number): ReactNode => {
    const title = t.raw(`items.${id}.title`) as string[];
    const config = PROJECT_CTAS[id];
    return (
      <>
        <h3 data-panel-part className="afs-display text-light text-[clamp(2.2rem,3.9vw,3.6rem)]">
          {title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h3>
        <p data-panel-part className="text-light/90 mt-5 max-w-[42rem] text-lg leading-relaxed md:text-[1.35rem]">
          {t(`items.${id}.description`)}
          {config.comingSoon && id === "diploma" && <span className="text-gold-pale"> {t("comingSoon")}</span>}
        </p>
        <div data-panel-part className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
          {config.comingSoon && id !== "diploma" && <span className="afs-label border-light/30 text-light/60 border px-3 py-2 text-xs">{t("comingSoon")}</span>}
          {config.ctas.map((cta) => (
            <Cta key={cta.key} href={cta.href} variant={cta.variant} size="sm" data-project-cta={index}>
              {t(`cta.${cta.key}`)}
            </Cta>
          ))}
        </div>
      </>
    );
  };

  return (
    <section id="projects" data-section="projects" aria-labelledby="projects-title" className="relative">
      {/* Desktop with motion: one pinned stage, the composition morphs from project to project. */}
      <div data-projects-pin className="afs-container hidden min-h-svh flex-col justify-center py-14 lg:motion-safe:flex">
        <h2 id="projects-title" className="afs-display text-light text-center text-[clamp(2.6rem,4.2vw,3.6rem)]">
          {t("title")}
        </h2>
        <div className="mt-[clamp(2rem,6vh,5rem)] grid grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] items-center gap-[clamp(2rem,4vw,4rem)]">
          <ProjectStage project={PROJECT_ORDER[0]} shared className="max-h-[62svh] max-w-[38rem] justify-self-start" />
          <div>
            <ProgressDashes active={0} total={total} className="mb-6" />
            <p className="sr-only" data-project-progress aria-live="polite">
              {t("progress", { current: 1, total })}
            </p>
            <div className="grid">
              {PROJECT_ORDER.map((id, index) => (
                <div key={id} data-project-panel={index} className="[grid-area:1/1]" style={index > 0 ? { opacity: 0, pointerEvents: "none" } : undefined}>
                  {panel(id, index)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile and reduced motion: the same projects as a readable stacked list. */}
      <div className="afs-container py-20 lg:motion-safe:hidden">
        <h2 className="afs-display text-light text-center text-[clamp(2.6rem,8vw,3.6rem)]">{t("title")}</h2>
        <ol className="mt-16 flex flex-col gap-24">
          {PROJECT_ORDER.map((id, index) => (
            <li key={id} data-project-item className="grid items-center gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
              <ProjectStage project={id} className="mx-auto max-w-[26rem]" />
              <div>
                <ProgressDashes active={index} total={total} className="mb-6" />
                {panel(id, index)}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
