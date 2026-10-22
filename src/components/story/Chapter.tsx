"use client";

import { Fragment, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { founderPortrait, hasYear, type StoryChapter, type StoryPhoto } from "@/data/story";
import { useGsap } from "@/hooks/useGsap";
import { Caption, ScrollWords } from "./Caption";
import { faceStyle, monoStyle } from "./fonts";
import { PhotoFrame } from "./PhotoFrame";
import { YearMark } from "./YearMark";
import { animateChapterParts } from "./motion";
import { cn } from "@/lib/utils";

/** Height, in vw, the absolutely placed prints need on desktop. */
function bandHeight(chapter: StoryChapter): number {
  const photoBottoms = chapter.photos.map((p) => p.y + p.w * (p.height / p.width) + 4);
  return Math.max(12, ...photoBottoms);
}

/**
 * One era of the chronicle: trail in, marker, caption, then a loose pile of
 * archive prints. A chapter without a confirmed year has no giant marker;
 * its heading and text are set beside its print instead (SideChapter).
 */
export function Chapter({
  chapter,
  overlapHero = false,
  portrait = null,
  countFrom,
}: {
  chapter: StoryChapter;
  overlapHero?: boolean;
  /** The previous chapter's year, which this chapter's marker counts up from. */
  countFrom?: number;
  /** The founder's portrait, shown first under the caption (1960 chapter). */
  portrait?: StoryPhoto | null;
}) {
  const scope = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, root }) => {
      animateChapterParts({ gsap, root });
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  const hasMedia = chapter.photos.length > 0;
  const dated = hasYear(chapter.marker);

  return (
    <section
      ref={scope}
      id={chapter.id}
      data-chapter
      data-bg={chapter.bg}
      // The page-long dotted trail runs down this side through the chapter.
      data-trail-side={chapter.trail}
      data-counter={chapter.counter}
      // The year counter holds this year while the chapter is on screen.
      data-year={dated && /^\d{4}$/.test(chapter.marker.trim()) ? chapter.marker.trim() : undefined}
      data-nav-theme={chapter.tone === "dark" ? "dark" : "light"}
      style={{ "--story-bg": chapter.bg } as CSSProperties}
      className={cn(
        chapter.tone === "dark" ? "story-dark relative text-[#ffffff]" : "relative text-[#1f1d1e]",
        // The first chapter rides up over the last screen of the pinned hero,
        // so its trail and year arrive while the floor is still dissolving.
        overlapHero && "z-[1] motion-safe:-mt-[100svh]",
      )}
    >
      {dated ? (
        <>
          <div data-mark className="relative z-[1] pt-[30vw] md:pt-[24vw]">
            <YearMark
              marker={chapter.marker}
              face={chapter.face}
              kicker={chapter.kicker}
              countFrom={/^\d{4}$/.test(chapter.marker.trim()) ? countFrom : undefined}
            />
          </div>

          {/* The year counter holds through here, then counts on past the prints. */}
          <div data-year-hold className="gutter relative z-[2] mt-[6vw] md:mt-[3vw]">
            <Caption lines={chapter.caption} className="max-w-[88vw] md:max-w-[52vw]" />
          </div>

          {portrait ? (
            <FounderFigure portrait={portrait} className="mx-auto mt-[14vw] mb-[20vw] w-[68vw] md:mt-[7vw] md:mb-[10vw] md:w-[26vw]" />
          ) : null}

          {/* The founder's portrait closes the first chapter on its own. */}
          {hasMedia && !portrait ? (
            <div
              style={{ "--band": `${bandHeight(chapter)}vw` } as CSSProperties}
              className="relative z-[1] mt-[14vw] flex flex-col gap-0 pb-[8vw] md:mt-[8vw] md:block md:h-(--band) md:pb-0"
            >
              {chapter.photos.map((photo) => (
                <PhotoFrame key={photo.src} photo={photo} className="z-[2]" />
              ))}
            </div>
          ) : (
            <div className="h-[16vw]" />
          )}

        </>
      ) : (
        <SideChapter chapter={chapter} />
      )}
    </section>
  );
}

/**
 * The founder's portrait and name. Part of the year's hold, so 1960 stays on
 * the counter while he is on screen.
 */
function FounderFigure({ portrait, className }: { portrait: StoryPhoto; className?: string }) {
  return (
    <figure data-year-hold className={cn("relative z-[2] mb-0", className)}>
      {/* Hung the way it hangs in the kalari: walnut moulding, a cream mat. */}
      <div data-speed={portrait.speed} className="founder-frame">
        <div className="founder-mat">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            sizes="(min-width: 768px) 24vw, 56vw"
            className="founder-print block h-auto w-full"
          />
        </div>
      </div>
      <figcaption
        data-scrub-text
        style={monoStyle}
        className="mt-[5vw] text-center text-[3vw] uppercase tracking-[0.32em] md:mt-[2vw] md:text-[0.85vw]"
      >
        <ScrollWords text={founderPortrait.name} />
      </figcaption>
    </figure>
  );
}

/**
 * Undated chapter: the print on one side, the heading and the story on the
 * other, swapping sides with the trail so consecutive chapters alternate.
 * The text is always set flush left; the five-column text block keeps one
 * empty column between it and the print on either side.
 */
function SideChapter({ chapter }: { chapter: StoryChapter }) {
  const photo = chapter.photos[0];
  const imageRight = chapter.trail === "right";

  return (
    <div className="gutter relative z-[1] grid items-center gap-[10vw] pb-[16vw] pt-[30vw] md:grid-cols-12 md:gap-[4vw] md:pb-[10vw] md:pt-[22vw]">
      {photo ? (
        <div className={cn("md:col-span-6", imageRight ? "md:order-2 md:col-start-7" : "md:col-start-1")}>
          <PhotoFrame photo={photo} positioned={false} sizes="(min-width: 768px) 46vw, 88vw" className="w-full" />
        </div>
      ) : null}

      <div className={cn("md:col-span-5", imageRight ? "md:order-1 md:col-start-1" : "md:col-start-8")}>
        <h2
          data-scrub-text
          className="m-0 text-[11vw] leading-[0.95] uppercase md:mt-[1.6vw] md:text-[4.6vw]"
          style={faceStyle[chapter.face]}
        >
          <ScrollWords text={chapter.kicker} />
        </h2>
        <p
          data-scrub-text
          style={monoStyle}
          className="mt-[6vw] text-[4.4vw] leading-[1.3] font-medium md:mt-[2.4vw] md:text-[1.45vw] md:leading-[1.35]"
        >
          {chapter.caption.map((line, i) => (
            <Fragment key={i}>
              {i > 0 ? " " : null}
              {line.map((segment, j) => (
                <ScrollWords key={j} text={segment.text} bold={segment.bold} />
              ))}
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
