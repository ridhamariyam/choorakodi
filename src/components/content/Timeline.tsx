"use client";

import { useRef, useState } from "react";
import { HorizontalScroll } from "@/components/animation/HorizontalScroll";
import { Figure } from "@/components/content/Figure";
import { PendingCopy } from "@/components/content/PendingCopy";
import { YearMark } from "@/components/content/YearMark";
import { useGsap } from "@/hooks/useGsap";
import { useLenis } from "@/hooks/useLenis";
import type { TimelineEntry } from "@/data/timeline";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------- horizontal rail */

/**
 * The home-page timeline: a horizontal rail that scrubs sideways while the
 * section is pinned on desktop, and a swipeable snapping rail on touch.
 *
 * A single hairline runs the full width behind the panels so the decades read
 * as one continuous line rather than five separate cards.
 */
export function Timeline({ entries, tone = "dark" }: { entries: TimelineEntry[]; tone?: "light" | "dark" }) {
  return (
    <HorizontalScroll railClassName="items-stretch lg:items-center">
      {entries.map((entry, index) => (
        <article
          key={entry.year}
          className={cn(
            "relative flex w-[82vw] shrink-0 snap-start flex-col justify-center",
            "px-[clamp(1.25rem,5vw,5.5rem)] sm:w-[62vw] lg:w-[46vw] xl:w-[38vw]",
            "py-16 lg:py-0",
          )}
        >
          {/* The through-line. Drawn per panel so it survives the transform. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-0 right-0 top-[3.25rem] hidden h-px lg:block",
              tone === "dark" ? "bg-bone/15" : "bg-ink/12",
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-[clamp(1.25rem,5vw,5.5rem)] top-[3.25rem] hidden h-1.5 w-1.5 -translate-y-1/2 rotate-45 lg:block",
              tone === "dark" ? "bg-soil" : "bg-green",
            )}
          />

          <div className="lg:pt-24">
            {/* The year stands on its own, apart from the copy below it. */}
            <YearMark year={entry.year} tone={tone} size="display" />

            <div className="mt-12 flex items-baseline gap-5">
              <span className="eyebrow text-soil">{String(index + 1).padStart(2, "0")}</span>
              <h3
                className={cn(
                  "text-title font-medium",
                  tone === "dark" ? "text-bone" : "text-ink",
                )}
              >
                {entry.title}
              </h3>
            </div>

            <p
              className={cn(
                "measure mt-6 text-lead",
                tone === "dark" ? "text-bone/65" : "text-ink/72",
              )}
            >
              {entry.lead}
            </p>

            <PendingCopy tone={tone} className="mt-8">
              {entry.pending}
            </PendingCopy>

            <Figure
              slot={entry.image}
              ratio="4 / 3"
              tone={tone === "dark" ? "ink" : "bone"}
              index={entry.year}
              className="mt-12 lg:mt-14"
              sizes="(max-width: 640px) 82vw, (max-width: 1024px) 62vw, 40vw"
            />
          </div>
        </article>
      ))}
    </HorizontalScroll>
  );
}

/* --------------------------------------------------------- pinned column */

/**
 * The /about timeline: the decade list pins to the viewport while its entries
 * scroll past, and the active year tracks the entry in view.
 *
 * Pinning here is a sticky column rather than a GSAP pin — cheaper, no layout
 * shift, and it degrades to a normal stacked list on small screens where a
 * sticky sidebar would eat the viewport.
 */
export function PinnedTimeline({ entries }: { entries: TimelineEntry[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { getLenis } = useLenis();

  useGsap(
    ({ gsap, root }) => {
      const panels = gsap.utils.toArray<HTMLElement>("[data-entry]", root);
      panels.forEach((panel, index) => {
        // Mid-viewport boundary in both directions, so scrolling back up
        // returns the indicator to the previous decade at the same point.
        gsap.to(panel, {
          scrollTrigger: {
            trigger: panel,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) setActive(index);
            },
          },
        });
      });
    },
    [entries.length],
    { scope },
  );

  return (
    <div ref={scope} className="grid gap-16 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-24">
      {/* Decade index — sticky on desktop, a horizontal strip on mobile.
          `min-w-0` is load-bearing: without it this grid item takes its
          min-content width from the scrolling year rail inside it, which
          widens the whole track past the viewport on a phone. */}
      <nav aria-label="Timeline decades" className="min-w-0 lg:sticky lg:top-32 lg:self-start">
        <p className="eyebrow mb-6 text-muted">The chapters</p>
        <ol className="no-scrollbar -mx-1 flex gap-6 overflow-x-auto px-1 lg:m-0 lg:flex-col lg:gap-4 lg:overflow-visible lg:px-0">
          {entries.map((entry, index) => (
            <li key={entry.year} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  const target = document.getElementById(`chapter-${entry.year}`);
                  if (!target) return;
                  const lenis = getLenis();
                  // Native smooth scrolling fights Lenis, so route through it
                  // when it is running and fall back when it is not.
                  if (lenis) lenis.scrollTo(target, { offset: -96 });
                  else target.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                aria-current={active === index ? "true" : undefined}
                className={cn(
                  "group flex items-center gap-3 text-left transition-colors duration-500",
                  active === index ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    active === index ? "w-8 bg-green" : "w-3 bg-ink/25",
                  )}
                />
                <span className="text-meta-lg font-medium uppercase">{entry.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0">
        {entries.map((entry, index) => (
          <article
            key={entry.year}
            id={`chapter-${entry.year}`}
            data-entry
            className={cn(
              "scroll-mt-32 py-14 first:pt-0 md:py-20",
              index > 0 && "border-t border-ink/12",
            )}
          >
            <span className="eyebrow text-soil">{String(index + 1).padStart(2, "0")}</span>

            {/* Year first and separate; the title follows it. */}
            <div className="mt-6">
              <YearMark year={entry.year} tone="light" size="headline" />
            </div>

            <h3 className="mt-9 text-headline font-semibold tracking-[-0.033em]">{entry.title}</h3>
            <p className="measure mt-6 text-lead text-ink/75">{entry.lead}</p>
            <PendingCopy className="mt-8">{entry.pending}</PendingCopy>

            <Figure
              slot={entry.image}
              ratio="16 / 10"
              index={entry.year}
              className="mt-12"
              sizes="(max-width: 1024px) 92vw, 46vw"
            />
          </article>
        ))}
      </div>
    </div>
  );
}
