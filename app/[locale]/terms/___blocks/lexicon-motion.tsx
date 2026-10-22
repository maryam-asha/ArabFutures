"use client";

import { MEDIA, type MotionConditions, SCRUB, ScrollTrigger, SplitText, gsap, useGSAP } from "@lib/gsap";
import { useLocale } from "next-intl";
import { type ReactNode, useRef } from "react";

/**
 * Motion for the Lexicon page, in the homepage's vocabulary: the hero composition assembles out of its gold square,
 * the statement brightens word by word with scroll, the "Why it matters" cards rise in, and the numbered
 * "What makes it different" row is pinned and travelled horizontally on desktop. Nothing runs with reduced motion.
 */
export function LexiconMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  useGSAP(
    () => {
      const root = scope.current!;
      const q = gsap.utils.selector(root) as (selector: string) => HTMLElement[];
      const dir = getComputedStyle(root).direction === "rtl" ? -1 : 1;

      const mm = gsap.matchMedia();
      mm.add(MEDIA, (context) => {
        const { desktop, reduced } = context.conditions as MotionConditions;
        if (reduced) return;

        // Hero: headline rises, then the fanned squares open out from the gold one.
        gsap.set(q("[data-intro]"), { visibility: "visible", animation: "none" });
        const shapes = q("[data-lexicon-hero] [data-shape]");
        gsap
          .timeline({ delay: 0.1 })
          .from(q("[data-lexicon-hero] h1"), { y: 48, autoAlpha: 0, duration: 1.1, ease: "power3.out" })
          .from(q("[data-lexicon-hero] [data-hero-fade]"), { y: 24, autoAlpha: 0, duration: 0.9, ease: "power2.out" }, "-=0.7")
          .from(q("[data-lexicon-hero] [data-shape-gold]"), { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)" }, "-=0.8")
          .from(shapes, { rotation: 0, x: 0, y: 0, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.14 }, "-=0.35");

        // Statement: words brighten as the reader scrolls through it.
        const statement = q("[data-statement]")[0];
        if (statement) {
          const split = new SplitText(statement, { type: "words" });
          gsap.fromTo(split.words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 45%", scrub: SCRUB } });
        }

        ScrollTrigger.batch(q("[data-why-card]"), {
          start: "top 88%",
          onEnter: (batch) => gsap.fromTo(batch, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power3.out", stagger: 0.12, overwrite: true }),
        });

        q("[data-reveal]").forEach((el) =>
          gsap.from(el, { y: 40, autoAlpha: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" } }),
        );

        if (desktop) {
          const section = q("[data-diff-section]")[0];
          const viewport = q("[data-diff-viewport]")[0];
          const track = q("[data-diff-track]")[0];
          const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
          gsap.to(track, {
            x: () => dir * -travel(),
            ease: "none",
            scrollTrigger: { trigger: section, pin: true, start: "top top", end: () => `+=${travel()}`, scrub: SCRUB, anticipatePin: 1, invalidateOnRefresh: true },
          });
        }

        let alive = true;
        document.fonts?.ready.then(() => alive && ScrollTrigger.refresh());

        // The term grid grows with "Load more" and shrinks with filters: re-measure the triggers below it.
        const explorer = q("#explore")[0];
        let lastHeight = explorer?.offsetHeight ?? 0;
        const refresh = gsap.delayedCall(0.25, () => ScrollTrigger.refresh()).pause();
        const observer = new ResizeObserver(() => {
          if (!explorer || Math.abs(explorer.offsetHeight - lastHeight) < 2) return;
          lastHeight = explorer.offsetHeight;
          refresh.restart(true);
        });
        if (explorer) observer.observe(explorer);

        return () => {
          alive = false;
          observer.disconnect();
          refresh.kill();
        };
      });
    },
    { scope, dependencies: [locale], revertOnUpdate: true },
  );

  return <div ref={scope}>{children}</div>;
}
