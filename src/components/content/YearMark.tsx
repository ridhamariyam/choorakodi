import { InkSpill } from "./InkSpill";
import { cn } from "@/lib/utils";

const sizeClasses = {
  display: "text-display",
  headline: "text-headline",
  title: "text-title",
} as const;

export type YearMarkProps = {
  year: string;
  /** Ground the mark sits on. Kept for callers; the blot is taupe on every ground. */
  tone?: "light" | "dark";
  size?: keyof typeof sizeClasses;
  className?: string;
};

/**
 * A year set apart from the copy around it, standing on spilled ink.
 *
 * The blot is sized in `em` against the year's own type size, so it hugs
 * "1960" and "2026" identically and rescales with the fluid display clamp
 * instead of needing a breakpoint of its own. A small rotation keeps it from
 * reading as a rounded badge.
 *
 * The spill is the brand taupe with ink numerals, on every ground.
 */
export function YearMark({ year, size = "display", className }: YearMarkProps) {
  return (
    <span
      className={cn(
        // Padding is what keeps the numerals over the wash's solid body: the
        // body spans 13%–91% of the blot, so the text has to sit inside that
        // or its outer glyphs land on the translucent halo and wash out.
        "relative inline-block px-[0.6em] py-[0.3em] font-semibold leading-none tracking-[-0.045em]",
        sizeClasses[size],
        className,
      )}
    >
      <InkSpill
        className={cn(
          "absolute inset-0 h-full w-full -rotate-[2.5deg] scale-[1.06]",
          "text-green",
        )}
      />
      <span className="relative text-[#101312]">{year}</span>
    </span>
  );
}
