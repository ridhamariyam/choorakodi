"use client";

import { useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/useGsap";
import { cn } from "@/lib/utils";

export type TextRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  start?: string;
};

/**
 * A single block that fades and rises into place. The workhorse reveal — used
 * for paragraphs, metadata and small groups where a per-line split is overkill.
 */
export function TextReveal({
  children,
  className,
  delay = 0,
  y = 24,
  duration = 1,
  start = "top 88%",
}: TextRevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root, reduced }) => {
      if (reduced) return;
      const travel = window.innerWidth < 768 ? Math.min(y, 16) : y;
      gsap.set(root, { opacity: 0, y: travel });
      gsap.to(root, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        scrollTrigger: { trigger: root, start, once: true },
      });
    },
    [delay, y, duration, start],
    { scope },
  );

  return (
    <div ref={scope} className={cn(className)}>
      {children}
    </div>
  );
}
