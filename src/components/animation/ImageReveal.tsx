"use client";

import { useRef } from "react";
import { useGsap } from "@/hooks/useGsap";
import { Figure, type FigureProps } from "@/components/content/Figure";
import { cn } from "@/lib/utils";

export type ImageRevealProps = FigureProps & {
  wrapperClassName?: string;
  direction?: "up" | "down";
  delay?: number;
  /** Adds a slow counter-scale so the image settles rather than snapping. */
  settle?: boolean;
};

/**
 * The standard image entrance. The ink drop itself lives in Figure; this adds
 * a slow counter-scale so the picture settles as the ink spreads.
 */
export function ImageReveal({
  wrapperClassName,
  direction = "up",
  delay = 0,
  settle = true,
  ...figureProps
}: ImageRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root, reduced }) => {
      if (reduced) return;
      const inner = root.firstElementChild as HTMLElement | null;
      if (!inner) return;

      if (!settle) return;
      gsap.set(inner, { scale: 1.14 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        scrollTrigger: { trigger: root, start: "top 86%", once: true },
        delay,
      });

      tl.to(inner, { scale: 1, duration: 2.2, ease: "power2.out" }, 0);
    },
    [direction, delay, settle],
    { scope },
  );

  return (
    <div ref={scope} className={cn("overflow-hidden", wrapperClassName)}>
      <Figure {...figureProps} />
    </div>
  );
}
