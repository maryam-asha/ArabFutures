"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

// Mobile browsers resize the viewport when the address bar shows/hides; don't re-layout pins for that.
ScrollTrigger.config({ ignoreMobileResize: true });

/** One smoothing constant shared by every scrubbed timeline and the square journey, so they stay in sync. */
export const SCRUB = 0.6;

export const MEDIA = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023.98px) and (prefers-reduced-motion: no-preference)",
  reduced: "(prefers-reduced-motion: reduce)",
} as const;

export type MotionConditions = { desktop: boolean; mobile: boolean; reduced: boolean };

export { gsap, ScrollTrigger, SplitText, useGSAP };
