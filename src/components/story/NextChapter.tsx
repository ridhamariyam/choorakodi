import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/animation/SectionReveal";
import { storyChapter } from "@/data/navigation";
import { ScrollWords } from "./Caption";
import { faceFor, faceStyle, monoStyle } from "./fonts";
import { Trail } from "./Trail";

/**
 * The page-turn at the foot of every page. The site is read as one story,
 * chapter by chapter in the menu's order, so each page ends by naming the
 * chapter that follows and leading the trail on to it; the last turns back
 * to 1960.
 */
export function NextChapter({ from }: { from: string }) {
  const { next, nextNumber, total } = storyChapter(from);
  const returning = nextNumber === 1;
  const number = String(nextNumber).padStart(2, "0");

  return (
    <SectionReveal tone="bone" spacing="none" aria-labelledby="next-chapter" className="overflow-hidden pb-[16vw] text-[#1f1d1e] md:pb-[8vw]">
      <Trail id="next-chapter" side="right" />

      <Link
        href={next.href}
        className="group gutter relative z-[1] grid items-center gap-[10vw] pt-[30vw] md:grid-cols-12 md:gap-[4vw] md:pt-[20vw]"
      >
        <div className="md:col-span-6">
          <p style={monoStyle} className="text-[max(11px,2.6vw)] uppercase tracking-[0.32em] opacity-70 md:text-[max(12px,0.8vw)]">
            {returning ? "Back to the beginning" : "Next chapter"} · {number} / {total}
          </p>
          <h2
            id="next-chapter"
            data-scrub-text
            className="m-0 mt-[4vw] text-[13vw] leading-[0.92] uppercase md:mt-[1.6vw] md:text-[6.4vw]"
            style={faceStyle[faceFor(next.title)]}
          >
            <ScrollWords text={next.title} />
          </h2>
          <p
            data-scrub-text
            style={monoStyle}
            className="mt-[6vw] max-w-[88vw] text-[max(15px,4.4vw)] leading-[1.3] font-medium md:mt-[2.4vw] md:max-w-[34vw] md:text-[max(15px,1.45vw)] md:leading-[1.35]"
          >
            <ScrollWords text={next.teaser} />
          </p>
          <span
            style={monoStyle}
            className="mt-[8vw] inline-flex items-center gap-3 border-b border-current pb-1 text-[max(11px,3vw)] uppercase tracking-[0.24em] md:mt-[3vw] md:text-[max(12px,0.85vw)]"
          >
            {returning ? "Return to 1960" : "Turn the page"}
            <span aria-hidden="true" className="transition-transform duration-500 ease-kalari group-hover:translate-x-2">
              →
            </span>
          </span>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <div className="overflow-hidden">
            <Image
              src={next.image.src}
              alt={next.image.alt}
              width={next.image.width}
              height={next.image.height}
              sizes="(min-width: 768px) 38vw, 88vw"
              className="block h-auto w-full transition-transform duration-700 ease-kalari group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
}
