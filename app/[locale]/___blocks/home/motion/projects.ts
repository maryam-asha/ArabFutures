import { SCRUB, gsap } from "@lib/gsap";

import { PROJECT_ORDER, SHAPE_IDS, boxToCss, shapeBox } from "../project-layouts";
import type { JourneyKey } from "./journey";

type Q = (selector: string) => HTMLElement[];

const MORPH_AT = 0.55; // within each step: rest first, then morph into the next project
const MORPH_DURATION = 1 - MORPH_AT;

/**
 * Desktop: pin the presenter and step through the projects. The pool shapes morph between the
 * per-project layouts while the journey square moves between the gold anchors in lockstep.
 */
export function projectsDesktop(q: Q, { progressLabel }: { progressLabel: (current: number) => string }) {
  const pinEl = q("[data-projects-pin]")[0];
  const panels = q("[data-project-panel]");
  const dashes = q("[data-projects-pin] [data-dash]");
  const live = q("[data-project-progress]")[0];
  const shapes = new Map(q("[data-project-stage] [data-shape]").map((el) => [el.dataset.shape!, el]));
  const n = PROJECT_ORDER.length;

  // Snap to the middle of each resting moment; 0 and 1 stay reachable so the pin never traps the reader.
  const snapPoints = [0, ...PROJECT_ORDER.map((_, i) => (i + MORPH_AT / 2) / n), 1];

  let active = 0;
  const setActive = (index: number) => {
    if (index === active) return;
    active = index;
    panels.forEach((panel, i) => (panel.style.pointerEvents = i === index ? "" : "none"));
    if (live) live.textContent = progressLabel(index + 1);
  };

  const tl = gsap.timeline({
    defaults: { ease: "power2.inOut" },
    scrollTrigger: {
      trigger: pinEl,
      pin: true,
      start: "top top",
      end: () => `+=${window.innerHeight * 0.75 * n}`,
      scrub: SCRUB,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      // No inertia: a jump (hash link, keyboard) lands on the nearest project instead of being projected past it.
      snap: { snapTo: snapPoints, inertia: false, duration: { min: 0.2, max: 0.6 }, delay: 0.15, ease: "power1.inOut" },
      onUpdate: (self) => setActive(Math.min(n - 1, Math.floor(self.progress * n + 1 - MORPH_AT - 0.17))),
    },
  });

  for (let i = 0; i < n - 1; i++) {
    const at = i + MORPH_AT;
    const next = PROJECT_ORDER[i + 1];
    for (const id of SHAPE_IDS) {
      const el = shapes.get(id);
      if (!el) continue;
      const b = boxToCss(shapeBox(next, id));
      tl.to(el, { left: b.left, top: b.top, width: b.width, height: b.height, rotation: b.rotation, opacity: b.opacity, duration: MORPH_DURATION }, at);
    }
    tl.to(panels[i], { opacity: 0, y: -24, duration: 0.18, ease: "power2.in" }, at);
    tl.set(panels[i + 1], { opacity: 1, y: 0 }, at + 0.17);
    tl.fromTo(panels[i + 1].querySelectorAll("[data-panel-part]"), { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.26, stagger: 0.05, ease: "power3.out", immediateRender: false }, at + 0.17);
    tl.to(dashes[i], { backgroundColor: "rgba(234, 234, 234, 0.4)", duration: 0.1 }, at + 0.2);
    tl.to(dashes[i + 1], { backgroundColor: "#cea864", duration: 0.1 }, at + 0.2);
  }
  tl.set({}, {}, n);

  // Keyboard users: focusing a CTA in another project scrolls the presenter to that project.
  const onFocus = (index: number) => () => {
    const st = tl.scrollTrigger!;
    if (index !== active) window.scrollTo({ top: st.start + ((index + MORPH_AT / 2) / n) * (st.end - st.start), behavior: "instant" });
  };
  const focusHandlers = panels.map((panel, i) => {
    const handler = onFocus(i);
    panel.addEventListener("focusin", handler);
    return () => panel.removeEventListener("focusin", handler);
  });

  const keys = (): JourneyKey[] => {
    const st = tl.scrollTrigger!;
    const len = st.end - st.start;
    const at = (p: number) => st.start + (p / n) * len;
    const out: JourneyKey[] = [];
    PROJECT_ORDER.forEach((_, i) => {
      out.push({ anchor: `project-${i}`, y: at(i), ease: "power2.inOut" });
      out.push({ anchor: `project-${i}`, y: i === n - 1 ? st.end : at(i + MORPH_AT) });
    });
    return out;
  };

  return {
    keys,
    cleanup: () => {
      focusHandlers.forEach((off) => off());
      panels.forEach((panel, i) => (panel.style.pointerEvents = i === 0 ? "" : "none"));
    },
  };
}

/** Mobile: stacked projects reveal as they scroll in. */
export function projectsMobile(q: Q) {
  q("[data-project-item]").forEach((item) => {
    gsap.from(item.children, {
      y: 40,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: "power2.out",
      scrollTrigger: { trigger: item, start: "top 82%", toggleActions: "play none none reverse" },
    });
  });
}
