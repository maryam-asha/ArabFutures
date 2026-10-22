import { gsap } from "@lib/gsap";

import type { Journey } from "./journey";

type Q = (selector: string) => HTMLElement[];

/** Headline intro; the square lands last, like the full stop of the sentence. */
export function heroIntro(q: Q, overlay: { root: HTMLElement; intro: HTMLElement }, journey: Journey) {
  const lines = q("[data-hero-line]");
  const fades = q("[data-hero-fade]");

  gsap.set(q("[data-intro]"), { visibility: "visible", animation: "none" });

  const tl = gsap.timeline({ delay: 0.15, onStart: () => journey.bump(240) });
  tl.from(lines, { y: 48, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.14 })
    .from(fades, { y: 24, autoAlpha: 0, duration: 0.9, ease: "power2.out", stagger: 0.12 }, "-=0.65")
    .set(overlay.root, { autoAlpha: 1 }, "-=0.95")
    .fromTo(overlay.intro, { scale: 0, rotation: -135 }, { scale: 1, rotation: 0, duration: 0.9, ease: "back.out(2.2)" }, "<");
  return tl;
}

/**
 * Hover on the hero square: it turns into a small diamond (foreshadowing the View All diamond)
 * and softens its corners. Runs on the overlay's inner layer only, so it never competes with the
 * journey for the same transform.
 */
export function heroHover(q: Q, overlay: { hover: HTMLElement; face: HTMLElement }, journey: Journey) {
  const target = q('[data-square-anchor="hero"]')[0];
  if (!target) return { reset() {}, cleanup() {} };

  let active = false;
  const enter = () => {
    if (active || !journey.isResting("hero")) return;
    active = true;
    gsap.to(overlay.hover, { rotation: 45, scale: 1.6, duration: 0.6, ease: "back.out(2.4)", overwrite: true });
    gsap.to(overlay.face, { borderRadius: "16%", duration: 0.5, ease: "power2.out", overwrite: true });
  };
  const leave = () => {
    if (!active) return;
    active = false;
    gsap.to(overlay.hover, { rotation: 0, scale: 1, duration: 0.7, ease: "power3.out", overwrite: true });
    gsap.to(overlay.face, { borderRadius: "0%", duration: 0.6, ease: "power2.out", overwrite: true });
  };
  const onPointerEnter = (e: PointerEvent) => e.pointerType !== "touch" && enter();
  const onPointerLeave = (e: PointerEvent) => e.pointerType !== "touch" && leave();
  // Touch has no hover: a tap toggles the same state.
  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === "touch") (active ? leave : enter)();
  };

  target.addEventListener("pointerenter", onPointerEnter);
  target.addEventListener("pointerleave", onPointerLeave);
  target.addEventListener("pointerup", onPointerUp);

  return {
    /** Called every journey frame: once the square leaves the hero it returns to its resting shape. */
    reset: () => {
      if (active && !journey.isResting("hero")) leave();
    },
    cleanup: () => {
      target.removeEventListener("pointerenter", onPointerEnter);
      target.removeEventListener("pointerleave", onPointerLeave);
      target.removeEventListener("pointerup", onPointerUp);
    },
  };
}
