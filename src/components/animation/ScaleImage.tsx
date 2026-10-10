"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { Figure, type FigureProps } from "@/components/content/Figure";
import { cn } from "@/lib/utils";

export type ScaleImageProps = FigureProps & {
  wrapperClassName?: string;
  /** Starting scale. Scrubs down to 1 as the element crosses the viewport. */
  from?: number;
};

/**
 * Scroll-scrubbed scale. Reserved for the few full-bleed images that carry a
 * section on their own; applying it broadly would make the page feel restless.
 */
export function ScaleImage({ wrapperClassName, from = 1.18, ...figureProps }: ScaleImageProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root }) => {
      const inner = root.firstElementChild as HTMLElement | null;
      if (!inner) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          inner,
          { scale: from },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "center center",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    [from],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <div ref={scope} className={cn("relative overflow-hidden", wrapperClassName)}>
      <div className="h-full w-full">
        <Figure {...figureProps} className="h-full" />
      </div>
    </div>
  );
}
