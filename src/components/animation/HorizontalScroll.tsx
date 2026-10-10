"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

export type HorizontalScrollProps = {
  children: ReactNode;
  className?: string;
  railClassName?: string;
  /** Minimum width at which the pinned horizontal scroll engages. */
  breakpoint?: number;
  /** Trailing space so the last item can reach the left edge. */
  endPadding?: string;
};

/**
 * Pinned horizontal scrolling on large screens; a native, snapping,
 * touch-friendly rail everywhere else.
 *
 * Pinning a short viewport is a bad trade — it removes the user's sense of
 * page position for very little gain — so below the breakpoint the rail is
 * simply an overflow container the finger already knows how to use.
 */
export function HorizontalScroll({
  children,
  className,
  railClassName,
  breakpoint = 1024,
  endPadding = "clamp(1.25rem, 5vw, 5.5rem)",
}: HorizontalScrollProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root }) => {
      const rail = root.querySelector<HTMLElement>("[data-rail]");
      if (!rail) return;

      const mm = gsap.matchMedia();
      mm.add(`(min-width: ${breakpoint}px)`, () => {
        // Recomputed on every refresh so a font swap or image load can't leave
        // the last card unreachable.
        const distance = () => Math.max(0, rail.scrollWidth - window.innerWidth);
        if (distance() === 0) return;

        gsap.to(rail, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    [breakpoint],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <div ref={scope} className={cn("relative lg:h-screen lg:overflow-hidden", className)}>
      <div
        data-rail
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain",
          "lg:h-full lg:snap-none lg:overflow-visible",
          railClassName,
        )}
        style={{ paddingRight: endPadding }}
      >
        {children}
      </div>
    </div>
  );
}
