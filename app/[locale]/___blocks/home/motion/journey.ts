import { SCRUB, ScrollTrigger, gsap } from "@lib/gsap";

/**
 * The square's journey: one writer for one element.
 *
 * The page provides an ordered list of keys `{ anchor, y }` (scroll positions, rebuilt on every
 * ScrollTrigger refresh). Between two keys with the same anchor the square rests on that anchor;
 * between different anchors it interpolates from one to the other. Anchors are real elements in
 * their sections, so their live rects already account for pins, wrapping, resizes and RTL. The
 * square is therefore a pure function of scroll position, and scrolling back up simply replays it.
 */

export type JourneyKey = { anchor: string; y: number; ease?: string };

export type JourneyFrame = { from: string; to: string; t: number };

export type JourneyOverlay = { root: HTMLElement; pos: HTMLElement; face: HTMLElement; glow: HTMLElement };

type AnchorState = { cx: number; cy: number; size: number; rot: number; color: string; glow: number };

const BASE = 256; // overlay square is drawn at its largest size and scaled down, so edges stay crisp

export function createJourney({
  scope,
  overlay,
  dir,
  buildKeys,
  onFrame,
}: {
  scope: HTMLElement;
  overlay: JourneyOverlay;
  dir: 1 | -1;
  buildKeys: () => JourneyKey[];
  onFrame?: (frame: JourneyFrame) => void;
}) {
  let keys: JourneyKey[] = [];
  const anchors = new Map<string, HTMLElement | null>();
  const eases = new Map<string, gsap.EaseFunction>();

  const anchor = (name: string) => {
    if (!anchors.has(name)) anchors.set(name, scope.querySelector<HTMLElement>(`[data-square-anchor="${name}"]`));
    return anchors.get(name) ?? null;
  };
  const ease = (name = "power2.inOut") => {
    if (!eases.has(name)) eases.set(name, gsap.parseEase(name));
    return eases.get(name)!;
  };

  const read = (name: string): AnchorState | null => {
    const el = anchor(name);
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      // Centre from the (axis-aligned) rect, size from the layout box, angle from data-rot.
      cx: rect.left + rect.width / 2,
      cy: rect.top + rect.height / 2,
      size: el.offsetWidth,
      rot: Number(el.dataset.rot ?? 0) * dir,
      color: el.dataset.color ?? "#cea864",
      glow: el.dataset.glow ? 1 : 0,
    };
  };

  const setX = gsap.quickSetter(overlay.pos, "x", "px");
  const setY = gsap.quickSetter(overlay.pos, "y", "px");
  // quickSetter doesn't resolve the "scale" alias, so both axes are written explicitly.
  const setScaleX = gsap.quickSetter(overlay.pos, "scaleX");
  const setScaleY = gsap.quickSetter(overlay.pos, "scaleY");
  const setRot = gsap.quickSetter(overlay.pos, "rotation", "deg");
  const setGlow = gsap.quickSetter(overlay.glow, "opacity");

  // Smoothed scroll input, using the same lag as the scrubbed section timelines.
  const scroll = { y: window.scrollY };
  const yTo = gsap.quickTo(scroll, "y", { duration: SCRUB, ease: "power3" });

  let frame: JourneyFrame = { from: "", to: "", t: 0 };
  let lastTarget = Number.NaN;
  let force = 0;
  let lastColor = "";

  const locate = (y: number): JourneyFrame | null => {
    if (!keys.length) return null;
    if (y <= keys[0].y) return { from: keys[0].anchor, to: keys[0].anchor, t: 0 };
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i];
      const b = keys[i + 1];
      if (y < b.y) {
        if (a.anchor === b.anchor) return { from: a.anchor, to: a.anchor, t: 0 };
        const span = b.y - a.y;
        return { from: a.anchor, to: b.anchor, t: span > 0 ? ease(b.ease)((y - a.y) / span) : 1 };
      }
    }
    const last = keys[keys.length - 1];
    return { from: last.anchor, to: last.anchor, t: 0 };
  };

  const render = () => {
    const target = window.scrollY;
    if (target !== lastTarget) {
      lastTarget = target;
      yTo(target);
      force = Math.max(force, 2);
    }
    // Idle: nothing scrolled, smoothing settled, no pending layout change.
    if (Math.abs(scroll.y - target) < 0.5 && force <= 0) return;
    if (force > 0) force--;

    const next = locate(scroll.y);
    if (!next) return;
    const a = read(next.from);
    const b = next.to === next.from ? a : read(next.to);
    if (!a || !b) return;

    const t = next.t;
    const lerp = (p: number, q: number) => p + (q - p) * t;
    const size = lerp(a.size, b.size);
    setX(lerp(a.cx, b.cx) - BASE / 2);
    setY(lerp(a.cy, b.cy) - BASE / 2);
    const scale = Math.max(size, 0.0001) / BASE;
    setScaleX(scale);
    setScaleY(scale);
    setRot(lerp(a.rot, b.rot));
    // The glow belongs to the star size only: it fades out in the first third of a departure
    // and in over the last third of an arrival, so a growing square never carries a large halo.
    setGlow(a.glow * gsap.utils.clamp(0, 1, 1 - t * 3) + b.glow * gsap.utils.clamp(0, 1, t * 3 - 2));
    const color = a.color === b.color ? a.color : (gsap.utils.interpolate(a.color, b.color, t) as string);
    if (color !== lastColor) {
      overlay.face.style.backgroundColor = color;
      lastColor = color;
    }

    frame = next;
    onFrame?.(next);
  };

  const rebuild = () => {
    const built = buildKeys();
    // Keys must be monotonic even when a section collapses on small viewports.
    for (let i = 1; i < built.length; i++) built[i].y = Math.max(built[i].y, built[i - 1].y);
    keys = built;
    anchors.clear();
    force = 30;
  };

  gsap.ticker.add(render);
  ScrollTrigger.addEventListener("refresh", rebuild);

  return {
    /** Keep rendering for a number of frames even without scrolling (intros, layout shifts). */
    bump(frames = 60) {
      force = Math.max(force, frames);
    },
    /** True while the square rests on the given anchor. */
    isResting(name: string) {
      return frame.from === name && frame.to === name;
    },
    kill() {
      gsap.ticker.remove(render);
      ScrollTrigger.removeEventListener("refresh", rebuild);
      gsap.set([overlay.pos, overlay.glow, overlay.face], { clearProps: "all" });
    },
  };
}

export type Journey = ReturnType<typeof createJourney>;

/** How strongly the square currently "is" a given anchor (1 at rest there, fading while travelling). */
export function anchorWeight(frame: JourneyFrame, name: string) {
  if (frame.from === name && frame.to === name) return 1;
  if (frame.to === name) return frame.t;
  if (frame.from === name) return 1 - frame.t;
  return 0;
}
