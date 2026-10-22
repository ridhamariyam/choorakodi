import type { CSSProperties } from "react";
import type { StoryChapter } from "@/data/story";
import { faceStyle, monoStyle } from "./fonts";
import { ScrollWords } from "./Caption";
import { cn } from "@/lib/utils";

/**
 * Small academy mark, a letterspaced kicker and a giant marker whose
 * characters rise individually. A disc sits behind the marker and grows in as
 * the chapter arrives.
 */
export function YearMark({
  marker,
  face,
  kicker,
  as: Tag = "h2",
  className,
  countFrom,
}: {
  /** The previous dated year: the marker rolls up from it, year by year, as it arrives. */
  countFrom?: number;
  marker: string;
  face: StoryChapter["face"];
  kicker: string;
  as?: "h1" | "h2" | "div";
  className?: string;
}) {
  // Long words ("Sangam") are set smaller than four-digit years.
  const long = marker.length > 4;
  const style: CSSProperties = {
    ...faceStyle[face],
    fontSize: long ? "clamp(4rem, 15vw, 17rem)" : "clamp(5rem, 20vw, 22rem)",
  };

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <div data-kicker className="flex flex-col items-center gap-[0.6vw]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-square.svg" alt="" aria-hidden="true" className="story-knockout h-auto w-[10vw] md:w-[4.2vw]" />
        <span data-scrub-text style={monoStyle} className="text-[2.6vw] uppercase tracking-[0.32em] md:text-[0.8vw]">
          <ScrollWords text={kicker} />
        </span>
      </div>
      {/* The bottom margin, in the marker's own em, keeps the caption clear of the disc. */}
      <Tag className="relative m-0 mb-[0.3em] leading-[0.9] font-normal" style={style}>
        {/* Sized in em so the disc scales with the marker, which stops growing at its clamp. */}
        <span
          aria-hidden="true"
          data-disc
          className="disc-ink pointer-events-none absolute left-1/2 top-[45%] z-10 size-[1.45em] -translate-x-1/2 -translate-y-1/2 rounded-full"
        />
        <span className="sr-only">
          {kicker}: {marker}
        </span>
        <span
          aria-hidden="true"
          data-count-from={countFrom}
          data-count-to={countFrom ? marker : undefined}
          // Digits rise from inside their own line: the clip keeps a digit
          // that is still low from ever dropping onto the caption below.
          className="flex tabular-nums [clip-path:inset(-0.4em_-0.2em_-0.06em_-0.2em)]"
        >
          {Array.from(marker).map((char, i) => (
            <span key={i} data-digit className="inline-block">
              {char}
            </span>
          ))}
        </span>
      </Tag>
    </div>
  );
}
