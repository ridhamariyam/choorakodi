import { cn } from "@/lib/utils";

/**
 * The dashed path that wanders between chapters. A solid copy of the curve is
 * used as a mask; the chapter scrubs its dash offset so the dashes appear to
 * be drawn along as you scroll.
 */
export function Trail({ side, id, className }: { side: "left" | "right"; id: string; className?: string }) {
  const d =
    side === "left"
      ? "M600 0C600 120 420 150 300 260S120 470 220 620"
      : "M600 0C600 120 780 150 900 260S1080 470 980 620";
  const maskId = `trail-mask-${id}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1200 620"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-x-0 top-0 h-[44vw] w-full", className)}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path data-trail-draw d={d} pathLength={1} fill="none" stroke="#fff" strokeWidth="8" strokeDasharray="1" />
        </mask>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeDasharray="7 7"
        vectorEffect="non-scaling-stroke"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
