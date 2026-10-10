/**
 * Single GSAP entry point.
 *
 * Plugins are registered exactly once, here, rather than in every component
 * that needs them. This module is client-only — importing it from a server
 * component will fail at build time, which is the intended guard rail.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // The animation language is "controlled, not chaotic": one shared set of
  // defaults keeps every reveal on the same curve and stops per-component
  // easing drift.
  gsap.defaults({ ease: "power3.out", duration: 1 });

  // ScrollTrigger recalculates on resize; on mobile the URL-bar show/hide
  // fires resize constantly, so ignore height-only changes there.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared easing tokens, mirroring the CSS custom properties. */
export const EASE = {
  kalari: "power3.out",
  strike: "power2.inOut",
  expo: "expo.out",
} as const;

/** Standard scroll-reveal trigger position. Used by every reveal utility. */
export const REVEAL_START = "top 85%";

export { gsap, ScrollTrigger, SplitText };
