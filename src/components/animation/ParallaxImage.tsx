"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { Figure, type FigureProps } from "@/components/content/Figure";
import { cn } from "@/lib/utils";

export type ParallaxImageProps = FigureProps & {
  wrapperClassName?: string;
  /** Travel as a percentage of the element's height. Keep it small. */
  strength?: number;
};

/**
 * Scroll-linked parallax.
 *
 * The inner element is oversized by exactly the travel distance, so the frame
 * is never exposed at either end of the scrub. Skipped entirely under reduced
 * motion — scrub-linked transforms are the first thing that preference means.
 */
export function ParallaxImage({
  wrapperClassName,
  strength = 12,
  ...figureProps
}: ParallaxImageProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root }) => {
      const inner = root.firstElementChild as HTMLElement | null;
      if (!inner) return;

      // Desktop only: on a phone the viewport is short enough that parallax
      // reads as drift, and the extra scrub work is not worth the frames.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.set(inner, { height: `${100 + strength * 2}%`, yPercent: -strength });
        gsap.to(inner, {
          yPercent: strength,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    [strength],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <div ref={scope} className={cn("relative overflow-hidden", wrapperClassName)}>
      <div className="relative h-full w-full">
        <Figure {...figureProps} className="h-full" />
      </div>
    </div>
  );
}
