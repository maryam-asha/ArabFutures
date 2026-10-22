import { SCRUB, ScrollTrigger, SplitText, gsap } from "@lib/gsap";

import type { JourneyKey } from "./journey";

type Q = (selector: string) => HTMLElement[];

/**
 * "A language that imagines, transforms the world."
 * The statement is typed out (chars in Latin; whole words in Arabic so letters stay joined),
 * the stars appear, and the constellation lines draw out from their stars. The square settles in as
 * one of the stars while the text is being typed.
 */
export function languageMotion(q: Q, { desktop, isArabic }: { desktop: boolean; isArabic: boolean }) {
  const section = q('[data-section="language"]')[0];
  const stage = q("[data-language-stage]")[0];
  const stars = q("[data-star]");
  const links = q("[data-link]") as unknown as SVGLineElement[];

  const split = new SplitText(q("[data-language-line]"), { type: isArabic ? "words" : "words,chars" });
  const units = isArabic ? split.words : split.chars;

  // Lines start collapsed onto their origin star and are drawn out later.
  const coord = (el: Element, name: string) => Number(el.getAttribute(name) ?? (el as SVGElement).dataset[name]);
  gsap.set(links, { attr: { x2: (_: number, el: Element) => coord(el, "x1"), y2: (_: number, el: Element) => coord(el, "y1") } });

  const pin = desktop
    ? ScrollTrigger.create({ trigger: section, pin: true, start: "top top", end: () => `+=${window.innerHeight * 1.1}`, anticipatePin: 1 })
    : null;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: pin
      ? { start: () => pin.start - window.innerHeight * 0.55, end: () => pin.end - window.innerHeight * 0.2, scrub: SCRUB }
      : { trigger: section, start: "top 75%", end: "center 45%", scrub: SCRUB },
  });
  tl.from(units, { autoAlpha: 0, duration: 0.02, stagger: 0.5 / units.length }, 0.02)
    .from(stars, { autoAlpha: 0, scale: 0, duration: 0.12, ease: "back.out(3)", stagger: { each: 0.35 / Math.max(stars.length, 1), from: "random" } }, 0.12)
    .to(links, { attr: { x2: (_: number, el: Element) => Number((el as SVGElement).dataset.x2), y2: (_: number, el: Element) => Number((el as SVGElement).dataset.y2) }, duration: 0.18, stagger: 0.04, ease: "power2.out" }, 0.5)
    .set({}, {}, 1);

  // As the section scrolls away the constellation dims, handing over to the projects.
  if (pin) {
    gsap.to([q("[data-stars]")[0], q("[data-constellation-lines]")[0]], {
      opacity: 0.2,
      ease: "none",
      scrollTrigger: { start: () => pin.end, end: () => pin.end + window.innerHeight * 0.7, scrub: SCRUB },
    });
  }

  // Ambient twinkle, only while the section is on screen.
  const twinkle = gsap.timeline({ paused: true });
  q("[data-star] [data-twinkle]").forEach((el) => {
    twinkle.to(el, { opacity: gsap.utils.random(0.85, 1), duration: gsap.utils.random(1.8, 4.6), repeat: -1, yoyo: true, ease: "sine.inOut" }, gsap.utils.random(0, 3));
  });
  ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive ? twinkle.play() : twinkle.pause()) });

  const cleanupHover = desktop && window.matchMedia("(hover: hover)").matches ? pointerConstellation(stage, q) : () => {};

  const keys = (): JourneyKey[] => {
    const st = tl.scrollTrigger!;
    if (pin) return [{ anchor: "star", y: pin.start + (pin.end - pin.start) * 0.3, ease: "power2.inOut" }, { anchor: "star", y: pin.end }];
    return [{ anchor: "star", y: st.end, ease: "power2.inOut" }];
  };

  return { keys, cleanup: cleanupHover };
}

/** Desktop pointer: nearby stars wire themselves to the cursor and to each other (after the Constellation Hero artifact). */
function pointerConstellation(stage: HTMLElement, q: Q) {
  const svg = q("[data-hover-lines]")[0] as unknown as SVGSVGElement;
  const stars = q("[data-stars] > span");
  const RADIUS = 190;
  const MAX_LINES = 36;
  const NS = "http://www.w3.org/2000/svg";

  const pool: SVGLineElement[] = [];
  for (let i = 0; i < MAX_LINES; i++) {
    const line = document.createElementNS(NS, "line");
    line.setAttribute("stroke", "#ffe2af");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("stroke-opacity", "0");
    svg.appendChild(line);
    pool.push(line);
  }

  let points: { x: number; y: number }[] = [];
  let pointer = { x: 0, y: 0 };
  let raf = 0;

  const measure = () => {
    const box = stage.getBoundingClientRect();
    points = stars
      .filter((s) => s.offsetParent !== null)
      .map((s) => {
        const r = s.getBoundingClientRect();
        return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
      });
  };
  const set = (i: number, x1: number, y1: number, x2: number, y2: number, o: number) => {
    const l = pool[i];
    l.setAttribute("x1", `${x1}`);
    l.setAttribute("y1", `${y1}`);
    l.setAttribute("x2", `${x2}`);
    l.setAttribute("y2", `${y2}`);
    l.setAttribute("stroke-opacity", o.toFixed(2));
  };
  const clear = (from = 0) => {
    for (let i = from; i < pool.length; i++) pool[i].setAttribute("stroke-opacity", "0");
  };
  const draw = () => {
    raf = 0;
    const near = points
      .map((p) => ({ p, d: Math.hypot(p.x - pointer.x, p.y - pointer.y) }))
      .filter((n) => n.d < RADIUS)
      .sort((a, b) => a.d - b.d);
    let i = 0;
    for (const { p, d } of near) {
      if (i >= MAX_LINES) break;
      set(i++, pointer.x, pointer.y, p.x, p.y, (1 - d / RADIUS) * 0.5);
    }
    for (let a = 0; a < near.length && i < MAX_LINES; a++) {
      let linksForStar = 0;
      for (let b = a + 1; b < near.length && linksForStar < 3 && i < MAX_LINES; b++) {
        const d = Math.hypot(near[a].p.x - near[b].p.x, near[a].p.y - near[b].p.y);
        if (d < RADIUS * 0.8) {
          set(i++, near[a].p.x, near[a].p.y, near[b].p.x, near[b].p.y, (1 - d / (RADIUS * 0.8)) * 0.35);
          linksForStar++;
        }
      }
    }
    clear(i);
  };

  const onEnter = () => measure();
  const onMove = (e: PointerEvent) => {
    const box = stage.getBoundingClientRect();
    pointer = { x: e.clientX - box.left, y: e.clientY - box.top };
    if (!points.length) measure();
    if (!raf) raf = requestAnimationFrame(draw);
  };
  const onLeave = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    clear();
  };

  stage.addEventListener("pointerenter", onEnter);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);
  window.addEventListener("scroll", onLeave, { passive: true });

  return () => {
    cancelAnimationFrame(raf);
    stage.removeEventListener("pointerenter", onEnter);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    window.removeEventListener("scroll", onLeave);
    pool.forEach((l) => l.remove());
  };
}
