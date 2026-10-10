"use client";

import { HorizontalScroll } from "@/components/animation/HorizontalScroll";
import { Figure } from "@/components/content/Figure";
import { Quote } from "@/components/content/Quote";
import type { Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/**
 * Testimonials as full editorial spreads on a horizontal rail — portrait,
 * oversized quote, name, metadata. Explicitly not review cards.
 *
 * Placeholder records are labelled in place. Publishing invented praise would
 * be dishonest, and these are also excluded from Review structured data.
 */
export function TestimonialRail({
  items,
  tone = "light",
}: {
  items: Testimonial[];
  tone?: "light" | "dark";
}) {
  return (
    <HorizontalScroll railClassName="items-stretch lg:items-center">
      {items.map((item, index) => (
        <article
          key={item.id}
          className={cn(
            "flex w-[86vw] shrink-0 snap-start flex-col gap-10 px-[clamp(1.25rem,5vw,5.5rem)] py-12",
            "sm:w-[70vw] lg:w-[58vw] lg:flex-row lg:items-center lg:gap-14 lg:py-0 xl:w-[50vw]",
          )}
        >
          <div className="w-40 shrink-0 sm:w-48 lg:w-56">
            <Figure
              slot={item.image}
              ratio="4 / 5"
              tone={tone === "light" ? "bone" : "ink"}
              index={String(index + 1).padStart(2, "0")}
              sizes="(max-width: 640px) 10rem, 14rem"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Quote
              quote={item.quote}
              attribution={item.name}
              meta={item.meta}
              tone={tone}
              size="md"
            />
            {item.isPlaceholder ? (
              <p
                className={cn(
                  "eyebrow mt-7 border-l border-soil/55 pl-4",
                  tone === "light" ? "text-soil" : "text-soil/85",
                )}
              >
                Placeholder — no real testimonial supplied
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </HorizontalScroll>
  );
}
