"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Three trailing dots that follow a fine pointer at staggered lag. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return;

    const dots = Array.from(root.children) as HTMLElement[];
    const movers = dots.map((dot, i) => ({
      x: gsap.quickTo(dot, "x", { duration: 0.25 + i * 0.18, ease: "power3.out" }),
      y: gsap.quickTo(dot, "y", { duration: 0.25 + i * 0.18, ease: "power3.out" }),
    }));

    const onMove = (event: PointerEvent) => {
      root.style.opacity = "1";
      for (const m of movers) {
        m.x(event.clientX);
        m.y(event.clientY);
      }
    };
    const onLeave = () => (root.style.opacity = "0");

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[130] opacity-0 mix-blend-difference transition-opacity duration-300"
    >
      {[10, 7, 5].map((size, i) => (
        <span
          key={size}
          className="absolute left-0 top-0 rounded-full bg-[#ffffff]"
          style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, opacity: 1 - i * 0.3 }}
        />
      ))}
    </div>
  );
}
