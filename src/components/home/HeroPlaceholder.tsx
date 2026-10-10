"use client";

import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { useGsap } from "@/hooks/useGsap";
import { Figure } from "@/components/content/Figure";
import { PageContainer } from "@/components/layout/PageContainer";
import { slot } from "@/data/assets";

/**
 * A still from the supplied hero frame sequence. The sequence itself belongs
 * to the cinematic hero, which is intentionally not built yet — this is just
 * its establishing frame standing in as the placeholder's static image.
 */
const heroImage = slot(
  "HERO IMAGE",
  "Two Choorakkodi practitioners mid-leap in a sword-and-shield sequence on the earthen floor of the kalari",
  {
    src: "/images/hero-section-frames-to-form-video/5.jpg",
    width: 1536,
    height: 1024,
  },
);

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  TEMPORARY HERO
 * ─────────────────────────────────────────────────────────────────────────
 *  The cinematic hero is deliberately NOT built yet.
 *
 *  This component is its seat: a full-viewport plate with no copy on it. The
 *  frames carry the section; the first words on the page belong to section 01.
 *  Replacing it is a one-line change in src/app/page.tsx:
 *
 *      -  <HeroPlaceholder />
 *      +  <CinematicHero />
 *
 *  Contract the replacement should honour so the rest of the page keeps
 *  working unchanged:
 *    · occupy roughly 100svh and sit first inside <main>
 *    · carry `data-nav-theme="dark" | "light"` so the navbar inverts correctly
 *    · render NO heading — the page's single <h1> lives in section 01, so a
 *      second one here would break the document outline
 *    · leave the top ~96px clear for the fixed navigation
 *    · end on solid ink at the bottom edge, because section 01 continues that
 *      black into its diagonal join (see <SectionSlope /> in LegacyIntro). The
 *      sequence's closing sword zoom runs into that cut.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function HeroPlaceholder() {
  const scope = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, root, reduced }) => {
      if (reduced) return;

      const indicator = root.querySelector<HTMLElement>("[data-hero-indicator]");
      const frame = root.querySelector<HTMLElement>("[data-hero-frame]");

      const tl = gsap.timeline({ delay: 0.15 });

      if (frame) {
        tl.fromTo(
          frame,
          { clipPath: "inset(14% 14% 14% 14%)", scale: 1.08 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.8, ease: "power3.inOut" },
          0,
        );
      }

      if (indicator) {
        tl.fromTo(indicator, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1.1);
        // A slow, continuous draw rather than a bounce — the brief rules out
        // bouncing, and the long cycle reads as breathing.
        gsap.to(indicator.querySelector("[data-indicator-line]"), {
          scaleY: 1,
          transformOrigin: "top center",
          duration: 1.2,
          repeat: -1,
          repeatDelay: 0.35,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    },
    [],
    { scope },
  );

  return (
    // No aria-labelledby: the plate carries no heading, and the photograph's
    // alt text is what describes it.
    <section
      ref={scope}
      data-nav-theme="dark"
      data-theme="dark"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink text-bone"
    >
      {/* Standing image. Swap for the film plate when the cinematic hero lands. */}
      <div data-hero-frame className="absolute inset-0 z-0">
        <Figure slot={heroImage} tone="ink" priority sizes="100vw" className="h-full w-full" />
        {/*
          Top: enough darkening for the transparent navbar to stay legible.
          Bottom: ramps to solid ink so the plate meets the next section's
          diagonal wedge with no seam.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,19,18,0.62)_0%,rgba(16,19,18,0.18)_26%,rgba(16,19,18,0.18)_62%,rgba(16,19,18,0.75)_88%,rgba(16,19,18,1)_100%)]"
        />
      </div>

      <PageContainer
        width="wide"
        className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-10 pt-32 sm:pt-36"
      >
        {/* Scroll cue — the only element on the plate, and wordless. */}
        <div data-hero-indicator className="flex items-end justify-between">
          <a
            href="#legacy"
            aria-label="Scroll to the introduction"
            className="group inline-flex h-11 w-11 items-center justify-center border border-bone/25 text-bone/70 transition-colors duration-500 hover:border-bone/60 hover:text-bone"
          >
            <ArrowDown
              className="h-4 w-4 transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-1"
              strokeWidth={1.6}
            />
          </a>

          <span aria-hidden="true" className="relative block h-16 w-px overflow-hidden bg-bone/12">
            <span
              data-indicator-line
              className="absolute inset-x-0 top-0 block h-full origin-top scale-y-0 bg-soil"
            />
          </span>
        </div>
      </PageContainer>
    </section>
  );
}
