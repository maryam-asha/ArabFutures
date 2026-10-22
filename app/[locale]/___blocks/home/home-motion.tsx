"use client";

import { MEDIA, type MotionConditions, ScrollTrigger, gsap, useGSAP } from "@lib/gsap";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useRef } from "react";

import { heroHover, heroIntro } from "./motion/hero";
import { type JourneyKey, anchorWeight, createJourney } from "./motion/journey";
import { languageMotion } from "./motion/language";
import { networkDesktop } from "./motion/network";
import { projectsDesktop, projectsMobile } from "./motion/projects";
import { PROJECT_ORDER } from "./project-layouts";

const LIGHT = "#eaeaea";
const INK = "#1e1e1e";

/**
 * The homepage's single motion boundary. Sections stay server components and expose data-*
 * hooks; this component owns the travelling-square overlay and creates every ScrollTrigger in
 * document order (hero → network → language → projects → journey), so later triggers account for
 * the pin spacing of earlier ones. Reduced motion: nothing runs and the in-flow anchors remain the
 * static squares.
 */
export function HomeMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations("Public.home.projects");

  useGSAP(
    () => {
      const root = scope.current!;
      const q = gsap.utils.selector(root) as (selector: string) => HTMLElement[];
      const dir: 1 | -1 = getComputedStyle(root).direction === "rtl" ? -1 : 1;
      const overlay = {
        root: q("[data-square-overlay]")[0],
        pos: q("[data-sq-pos]")[0],
        intro: q("[data-sq-intro]")[0],
        hover: q("[data-sq-hover]")[0],
        face: q("[data-sq-face]")[0],
        glow: q("[data-sq-glow]")[0],
      };

      const mm = gsap.matchMedia();
      mm.add(MEDIA, (context) => {
        const { desktop, reduced } = context.conditions as MotionConditions;
        if (reduced) return;

        // 1. Sections, in document order.
        const network = desktop ? networkDesktop(q, dir) : null;
        const language = languageMotion(q, { desktop, isArabic: locale === "ar" });
        const projects = desktop ? projectsDesktop(q, { progressLabel: (current) => t("progress", { current, total: PROJECT_ORDER.length }) }) : null;
        if (!desktop) projectsMobile(q);

        q("[data-reveal]").forEach((el) =>
          gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }),
        );

        // 2. The journey, last. The overlay takes over from the in-flow anchors it travels between.
        const used = desktop ? ["hero", "network-rest", "star", "project-0", "project-1", "project-2", "project-3", "project-4"] : ["hero", "star"];
        gsap.set(
          used.map((name) => q(`[data-square-anchor="${name}"]`)[0]).filter(Boolean),
          { opacity: 0 },
        );

        let lastViewAllWeight = -1;
        let hover: ReturnType<typeof heroHover> | null = null;
        const journey = createJourney({
          scope: root,
          overlay,
          dir,
          buildKeys: () => {
            const vh = window.innerHeight;
            const keys: JourneyKey[] = [
              { anchor: "hero", y: 0 },
              { anchor: "hero", y: vh * 0.04 },
            ];
            if (network) keys.push(...network.keys());
            keys.push(...language.keys());
            if (projects) keys.push(...projects.keys());
            return keys;
          },
          onFrame: (frame) => {
            hover?.reset();
            if (!network?.viewAll) return;
            // The View All label turns dark while it sits on the gold diamond.
            const w = Math.round(anchorWeight(frame, "network-viewall") * 100) / 100;
            if (w !== lastViewAllWeight) {
              lastViewAllWeight = w;
              network.viewAll.style.color = w > 0 ? (gsap.utils.interpolate(LIGHT, INK, gsap.utils.clamp(0, 1, w * 1.6 - 0.3)) as string) : "";
            }
          },
        });
        hover = heroHover(q, overlay, journey);
        heroIntro(q, overlay, journey);

        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        // Web fonts change line lengths and section heights: re-measure once they are in.
        let alive = true;
        document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

        return () => {
          alive = false;
          journey.kill();
          hover?.cleanup();
          language.cleanup();
          network?.cleanup();
          projects?.cleanup();
          if (network?.viewAll) network.viewAll.style.color = "";
        };
      });
    },
    { scope, dependencies: [locale], revertOnUpdate: true },
  );

  return (
    <div ref={scope} className="relative">
      {/* The travelling square. Fixed, non-interactive, below the header (z-50) and the network section (z-35). */}
      <div aria-hidden data-square-overlay className="pointer-events-none invisible fixed inset-0 z-30 overflow-hidden opacity-0">
        <div data-sq-pos className="absolute top-0 left-0 h-[256px] w-[256px] origin-center will-change-transform">
          <div data-sq-glow className="absolute -inset-[260%] opacity-0 [background:radial-gradient(closest-side,rgb(255_226_175/0.5),rgb(255_226_175/0.08)_45%,transparent)]" />
          <div data-sq-intro className="size-full">
            <div data-sq-hover className="size-full">
              <div data-sq-face className="bg-gold size-full" />
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
