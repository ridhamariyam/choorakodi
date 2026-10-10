import { cn } from "@/lib/utils";

type SlopeTone = "ink" | "green" | "wenge" | "bone";

const toneClass: Record<SlopeTone, string> = {
  ink: "bg-ink",
  green: "bg-green",
  wenge: "bg-wenge",
  bone: "bg-bone",
};

export type SectionSlopeProps = {
  /** Colour of the section above — the wedge carries it down past the join. */
  tone?: SlopeTone;
  /**
   * Which way the cut falls. "down-right" descends left→right, following the
   * blade in the hero's closing frame.
   */
  direction?: "down-right" | "down-left";
  /** Depth of the wedge at its deepest edge. */
  depth?: string;
  grain?: boolean;
  className?: string;
};

/**
 * A diagonal join between two sections.
 *
 * Rather than clipping the section itself — which would cut its content and
 * create a containing block that breaks sticky descendants — this paints a
 * wedge in the *previous* section's colour across the top of the new one. The
 * two solid colours meet on the diagonal, so the boundary reads as one cut.
 *
 * It belongs to the lower section, not the upper one, so the hero above can be
 * swapped out without taking the join with it.
 */
export function SectionSlope({
  tone = "ink",
  direction = "down-right",
  depth = "clamp(1.5rem, 4.5vw, 5.5rem)",
  grain = false,
  className,
}: SectionSlopeProps) {
  const clipPath =
    direction === "down-right"
      ? "polygon(0 0, 100% 0, 100% 100%)"
      : "polygon(0 0, 100% 0, 0 100%)";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-0",
        toneClass[tone],
        grain && "grain",
        className,
      )}
      style={{ height: depth, clipPath }}
    />
  );
}
