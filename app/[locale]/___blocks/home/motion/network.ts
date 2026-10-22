import { SCRUB, ScrollTrigger, gsap } from "@lib/gsap";

import type { JourneyKey } from "./journey";

type Q = (selector: string) => HTMLElement[];

/**
 * Desktop: pin the section and move the member track horizontally in sync with vertical scroll.
 * After the track has travelled, the pin holds a little longer for the View All diamond moment.
 */
export function networkDesktop(q: Q, dir: 1 | -1) {
  const section = q('[data-section="network"]')[0];
  const viewport = q("[data-network-viewport]")[0];
  const track = q("[data-network-track]")[0];
  const cards = q("[data-member-card]");

  const travel = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
  const hold = () => window.innerHeight * 0.9;

  // Section arrives: heading and track rise in.
  gsap.from([q("[data-network-head]")[0], viewport], {
    y: 70,
    autoAlpha: 0,
    stagger: 0.12,
    ease: "power2.out",
    scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: SCRUB },
  });

  const pin = ScrollTrigger.create({
    trigger: section,
    pin: true,
    start: "top top",
    end: () => `+=${travel() + hold()}`,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  });

  // Cards fade up as they enter from the trailing edge (per-frame set, so nothing piles up in the context).
  const setters = cards.map((card) => ({ opacity: gsap.quickSetter(card, "opacity"), y: gsap.quickSetter(card, "y", "px"), card }));
  const revealCards = () => {
    const vw = window.innerWidth;
    for (const { card, opacity, y } of setters) {
      const rect = card.getBoundingClientRect();
      const visible = dir > 0 ? vw - rect.left : rect.right;
      const p = gsap.utils.clamp(0, 1, visible / (rect.width * 0.85));
      opacity(0.12 + 0.88 * p);
      y((1 - p) * 36);
    }
  };

  gsap.to(track, {
    x: () => dir * -travel(),
    ease: "none",
    onUpdate: revealCards,
    scrollTrigger: {
      start: () => pin.start,
      end: () => pin.start + Math.max(travel(), 1),
      scrub: SCRUB,
      invalidateOnRefresh: true,
      onRefresh: revealCards,
    },
  });

  const keys = (): JourneyKey[] => {
    const vh = window.innerHeight;
    const s = pin.start + travel();
    return [
      { anchor: "network-rest", y: pin.start, ease: "power2.inOut" },
      { anchor: "network-rest", y: s + vh * 0.04 },
      { anchor: "network-viewall", y: s + vh * 0.3, ease: "power3.out" },
      { anchor: "network-viewall", y: s + vh * 0.56 },
      { anchor: "network-compact", y: s + vh * 0.82, ease: "power2.in" },
      { anchor: "network-compact", y: pin.end },
    ];
  };

  return {
    keys,
    viewAll: q("[data-viewall]")[0],
    cleanup: () => gsap.set(cards, { clearProps: "opacity,transform" }),
  };
}
