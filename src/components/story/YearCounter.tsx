"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import type { Story } from "@/lib/content/defaults";
import { condensedStyle } from "./fonts";

type Stop = { from: number; to: number; year: number };

/**
 * Where each dated chapter holds its year, in scroll pixels: from the moment
 * its top reaches the middle of the viewport until the last of its
 * `data-year-hold` parts (marker and caption, the founder's portrait) has
 * passed it. The prints below then count on towards
 * the next year. Only chapters with a confirmed year carry `data-year`.
 */
function measure(): Stop[] {
  const middle = window.innerHeight / 2;
  return Array.from(document.querySelectorAll<HTMLElement>("[data-year]"))
    .map((section) => {
      const rect = section.getBoundingClientRect();
      const holds = section.querySelectorAll("[data-year-hold]");
      const hold = holds[holds.length - 1]?.getBoundingClientRect() ?? rect;
      return {
        from: rect.top + window.scrollY - middle,
        to: hold.bottom + window.scrollY - middle,
        year: Number(section.dataset.year),
      };
    })
    .filter((stop) => Number.isFinite(stop.year))
    .sort((a, b) => a.from - b.from);
}

/** The year at a scroll position: held inside a dated chapter, counted between them. */
function yearAt(scroll: number, stops: Stop[], fallback: number): number {
  const first = stops[0];
  if (!first) return fallback;
  if (scroll <= first.to) return first.year;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]!;
    const b = stops[i + 1]!;
    if (scroll <= b.from) {
      const t = Math.min(1, Math.max(0, (scroll - a.to) / Math.max(1, b.from - a.to)));
      return Math.round(a.year + (b.year - a.year) * t);
    }
    if (scroll <= b.to) return b.year;
  }
  return stops[stops.length - 1]!.year;
}

/**
 * Fixed year counter: the founding year, a rule, and an odometer that counts
 * through every year as you scroll — holding on each dated chapter's year and
 * rolling 1961, 1962 … on the way to the next.
 */
export function YearCounter({ range }: { range: Story["range"] }) {
  const start = Number(range.start) || 1960;
  const [year, setYear] = useState(start);
  // Past the last dated chapter the page is no longer the chronicle
  // (recognition, questions, joining), so the counter steps aside.
  const [past, setPast] = useState(false);

  useEffect(() => {
    let stops = measure();
    let raf = 0;
    const update = () => {
      raf = 0;
      setYear(yearAt(window.scrollY, stops, start));
      const last = stops[stops.length - 1];
      setPast(Boolean(last && window.scrollY > last.to + window.innerHeight * 0.5));
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    // Pinning (the hero) moves everything below it, so re-measure whenever
    // ScrollTrigger lays the page out again.
    const onRefresh = () => {
      stops = measure();
      onScroll();
    };

    ScrollTrigger.addEventListener("refresh", onRefresh);
    window.addEventListener("scroll", onScroll, { passive: true });
    onRefresh();
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [start]);

  const digits = String(year).padStart(4, "0").split("");

  return (
    <div
      aria-hidden="true"
      data-past={past || undefined}
      className="story-counter pointer-events-none fixed bottom-4 left-4 z-[125] flex items-center gap-3 mix-blend-difference md:bottom-6 md:left-6"
      style={{ ...condensedStyle, color: "#ffffff" }}
    >
      <span className="text-[1.5rem] leading-none md:text-[2.2vw]">{range.start}</span>
      <span className="h-px w-8 bg-current md:w-[3vw]" />
      <span className="flex text-[1.5rem] leading-none md:text-[2.2vw]">
        {digits.map((digit, i) => (
          // One odometer wheel per digit, each rolling to its own number.
          <span key={i} className="relative block h-[1.5rem] overflow-hidden md:h-[2.2vw]">
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateY(-${Number(digit) * 10}%)` }}
            >
              {Array.from({ length: 10 }, (_, n) => (
                <span key={n} className="block h-[1.5rem] md:h-[2.2vw]">
                  {n}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
}
