"use client";

import { useRef } from "react";
import type { Story } from "@/lib/content/defaults";
import { useGsap } from "@/hooks/useGsap";
import { Caption } from "./Caption";
import { faceStyle } from "./fonts";
import { animateChapterParts } from "./motion";

/**
 * Interlude: the four styles the founder learned, set as mega type in rows
 * that slide against each other as you scroll. Also closes the present day
 * with the academy's values, under its own id and label.
 */
export function KineticMura({
  mura,
  id = "mura",
  label = "Four styles of kalari",
}: {
  mura: Story["mura"];
  id?: string;
  label?: string;
}) {
  const scope = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, root }) => {
      root.querySelectorAll<HTMLElement>("[data-row]").forEach((row) => {
        const dir = Number(row.dataset.row) || 1;
        gsap.fromTo(
          row,
          { xPercent: -14 * dir },
          {
            xPercent: 14 * dir,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      animateChapterParts({ gsap, root });
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <section
      ref={scope}
      id={id}
      data-chapter
      data-bg={mura.bg}
      data-counter={mura.counter}
      data-nav-theme="light"
      aria-label={label}
      className="relative overflow-hidden py-[14vw] text-[#1f1d1e] md:py-[7vw]"
    >
      {/* The caption introduces the four styles before they slide past. */}
      <div className="gutter relative z-[2] mb-[7vw] text-[#1f1d1e] md:mb-[3vw]">
        <Caption lines={mura.caption} className="max-w-[88vw] md:max-w-[44vw]" />
      </div>

      <div className="relative">
        <div aria-hidden="true" className="flex flex-col items-center" style={faceStyle.anton}>
          {mura.rows.map((row) => (
            <div
              key={row.words[0]}
              data-row={row.direction}
              className="flex whitespace-nowrap text-[6.8vw] leading-[1.05] uppercase md:text-[7.5vw] md:leading-[0.92]"
            >
              <span>{row.words[0]}</span>
              <span className="ml-[3vw] text-[#9a5a36]">{row.words[1]}</span>
            </div>
          ))}
        </div>
        <ul className="sr-only">
          {mura.rows.map((row) => (
            <li key={row.words[0]}>{row.words.join(" ")}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
