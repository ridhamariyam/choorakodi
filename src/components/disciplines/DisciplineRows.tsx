"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useGsap } from "@/hooks/useGsap";
import { TransitionLink } from "@/components/animation/PageTransition";
import { Figure } from "@/components/content/Figure";
import { LineReveal } from "@/components/animation/LineReveal";
import type { Discipline } from "@/data/disciplines";
import { cn } from "@/lib/utils";

/**
 * The disciplines list as oversized editorial rows rather than a card grid.
 *
 * Desktop: hovering a row brings its photograph up under the cursor, lifts the
 * title and reveals the row number. Only one image layer exists — the rows
 * crossfade within it, so hovering the whole list costs one opacity tween
 * rather than mounting and unmounting images.
 *
 * Mobile: the same content as stacked panels, image first. No hover state is
 * invented for a device that has no hover.
 */
export function DisciplineRows({
  items,
  tone = "dark",
}: {
  items: Discipline[];
  tone?: "light" | "dark";
}) {
  const scope = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useGsap(
    ({ gsap, root, cleanup }) => {
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const preview = root.querySelector<HTMLElement>("[data-preview]");
      if (!preview) return;

      const xTo = gsap.quickTo(preview, "x", { duration: 0.85, ease: "power3.out" });
      const yTo = gsap.quickTo(preview, "y", { duration: 0.85, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        // Small travel: the image should drift with the cursor, not chase it.
        xTo(((event.clientX - rect.left) / rect.width - 0.5) * 60);
        yTo(((event.clientY - rect.top) / rect.height - 0.5) * 80);
      };

      root.addEventListener("pointermove", onMove);
      cleanup(() => root.removeEventListener("pointermove", onMove));
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  const dark = tone === "dark";

  return (
    <div ref={scope} className="relative">
      {/* Hover preview — desktop only. */}
      <div
        aria-hidden="true"
        data-preview
        className="pointer-events-none absolute right-[6%] top-1/2 z-0 hidden h-[26rem] w-[19rem] -translate-y-1/2 lg:block xl:h-[30rem] xl:w-[22rem]"
      >
        {items.map((item, index) => (
          <div
            key={item.slug}
            className={cn(
              "absolute inset-0 transition-opacity duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)]",
              active === index ? "opacity-100" : "opacity-0",
            )}
          >
            <Figure
              slot={item.image}
              tone={dark ? "ink" : "bone"}
              className="h-full [&>div]:h-full"
              sizes="22rem"
            />
          </div>
        ))}
      </div>

      <ul className="relative z-10 m-0 list-none p-0">
        {items.map((item, index) => (
          <li key={item.slug}>
            <LineReveal tone={tone} />

            <TransitionLink
              href={`/disciplines#${item.slug}`}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              className="group/row block py-10 md:py-14 lg:py-16"
            >
              {/* Mobile: image leads. Hidden once the hover preview takes over. */}
              <Figure
                slot={item.image}
                ratio="16 / 10"
                tone={dark ? "ink" : "bone"}
                index={item.index}
                className="mb-8 lg:hidden"
                sizes="(max-width: 1024px) 92vw, 30vw"
              />

              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-1 items-baseline gap-5 sm:gap-9">
                  <span
                    className={cn(
                      "eyebrow shrink-0 pt-3 transition-colors duration-700 sm:pt-5",
                      active === index ? "text-soil" : dark ? "text-bone/30" : "text-ink/30",
                    )}
                  >
                    {item.index}
                  </span>

                  <div className="min-w-0">
                    <h3
                      className={cn(
                        "text-[clamp(2rem,5.6vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.038em]",
                        "transition-[transform,color] duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                        "lg:group-hover/row:translate-x-4",
                        dark ? "text-bone" : "text-ink",
                        active !== null && active !== index && "lg:opacity-35",
                      )}
                    >
                      {item.title}
                    </h3>

                    <p
                      className={cn(
                        "eyebrow mt-4 transition-opacity duration-700",
                        dark ? "text-bone/40" : "text-muted",
                        active !== null && active !== index && "lg:opacity-30",
                      )}
                    >
                      {item.eyebrow}
                    </p>

                    <p
                      className={cn(
                        "measure mt-6 text-[0.9375rem] leading-relaxed lg:max-w-md",
                        dark ? "text-bone/55" : "text-ink/65",
                        active !== null && active !== index && "lg:opacity-30",
                      )}
                    >
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-3 shrink-0 transition-[transform,opacity] duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)] sm:mt-5",
                    "group-hover/row:translate-x-1.5 group-hover/row:-translate-y-1.5",
                    dark ? "text-bone/45" : "text-ink/45",
                  )}
                >
                  <ArrowUpRight className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={1.25} />
                </span>
              </div>
            </TransitionLink>
          </li>
        ))}
        <li>
          <LineReveal tone={tone} />
        </li>
      </ul>
    </div>
  );
}
