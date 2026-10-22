"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGsap } from "@/hooks/useGsap";
import { ScrollWords } from "@/components/story/Caption";
import { monoStyle } from "@/components/story/fonts";
import { cn } from "@/lib/utils";
import type { StoryParagraph } from "@/data/pages";

/**
 * Prose told down the middle of the page. Each paragraph lights up word by
 * word as it scrolls through (driven by the enclosing SectionReveal), and
 * its photographs pop up on either side as it arrives.
 */
export function StoryParagraphs({ paragraphs, className }: { paragraphs: StoryParagraph[]; className?: string }) {
  const scope = useRef<HTMLDivElement>(null);

  useGsap(
    ({ gsap, root }) => {
      root.querySelectorAll<HTMLElement>("[data-story-row]").forEach((row) => {
        const photos = row.querySelectorAll<HTMLElement>("[data-pop]");
        gsap.fromTo(
          photos,
          { autoAlpha: 0, scale: 0.6, rotate: (i) => (i % 2 === 0 ? -8 : 8) },
          {
            autoAlpha: 1,
            scale: 1,
            rotate: (i) => (i % 2 === 0 ? -3 : 3),
            duration: 0.9,
            ease: "back.out(1.6)",
            stagger: 0.12,
            scrollTrigger: { trigger: row, start: "top 70%", toggleActions: "play none none reverse" },
          },
        );
      });
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <div ref={scope} className={cn("space-y-[16vw] md:space-y-[8vw]", className)}>
      {paragraphs.map((paragraph, index) => {
        const [left, right] = paragraph.images;
        return (
          <div key={index} data-story-row className="grid items-center gap-[6vw] md:grid-cols-12 md:gap-[2vw]">
            <p
              data-scrub-text
              style={monoStyle}
              className="text-lead font-medium text-[#1f1d1e] md:order-2 md:col-span-6 md:col-start-4 md:text-center"
            >
              <ScrollWords text={paragraph.text} />
            </p>
            {left ? <Photo image={left} className="md:order-1 md:col-span-3 md:col-start-1 md:self-start" /> : null}
            {right ? <Photo image={right} className="md:order-3 md:col-span-3 md:col-start-10 md:self-end" /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Photo({ image, className }: { image: StoryParagraph["images"][number]; className?: string }) {
  return (
    <div data-pop className={cn("mx-auto w-[62vw] md:w-full", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 22vw, 62vw"
        className="block h-auto w-full shadow-[0_1.2vw_2vw_-0.6vw_rgb(20_14_10/0.35)]"
      />
    </div>
  );
}
