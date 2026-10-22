"use client";

import { useMemo, useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Figure } from "@/components/content/Figure";
import { GalleryLightbox } from "./GalleryLightbox";
import { galleryCategories, type GalleryCategory, type GalleryItem } from "@/data/gallery";
import { cn } from "@/lib/utils";

type Filter = GalleryCategory | "All";

/**
 * A repeating six-slot rhythm across a 12-column grid.
 *
 * Each pair of rows sums to 12, so the layout never leaves an accidental hole,
 * while the differing spans, aspect ratios and top offsets keep it from
 * reading as a grid. Asymmetry by composition, not by chance.
 */
const layout = [
  { span: "md:col-span-6", offset: "" },
  { span: "md:col-span-3", offset: "md:mt-24" },
  { span: "md:col-span-3", offset: "md:mt-10" },
  { span: "md:col-span-4", offset: "md:mt-20" },
  { span: "md:col-span-5", offset: "" },
  { span: "md:col-span-3", offset: "md:mt-32" },
] as const;

const ratioMap = {
  portrait: "3 / 4",
  landscape: "4 / 3",
  square: "1 / 1",
  tall: "2 / 3",
  wide: "16 / 9",
} as const;

export function GalleryGrid({ gallery }: { gallery: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const scope = useRef<HTMLDivElement>(null);

  const items = useMemo(
    () => (filter === "All" ? gallery : gallery.filter((item) => item.category === filter)),
    [filter, gallery],
  );

  // `revision` re-runs the reveal when the filter swaps the tile set.
  useScrollReveal(scope, {
    selector: "[data-tile]",
    y: 32,
    stagger: 0.06,
    revision: filter,
  });

  return (
    <>
      {/* Filters */}
      <div
        role="group"
        aria-label="Filter gallery by category"
        className="flex flex-wrap items-center gap-x-1 gap-y-2 border-y border-ink/12 py-4"
      >
        {(["All", ...galleryCategories.filter((c) => gallery.some((item) => item.category === c))] as Filter[]).map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={isActive}
              className={cn(
                "px-4 py-2 text-meta font-medium uppercase tracking-[0.18em] transition-colors duration-500",
                isActive ? "bg-ink text-bone" : "text-muted hover:text-ink",
              )}
            >
              {category}
            </button>
          );
        })}
        <span className="ml-auto pl-4 text-meta uppercase tracking-[0.18em] text-muted">
          {items.length} {items.length === 1 ? "image" : "images"}
        </span>
      </div>

      {/* Composition */}
      <div ref={scope} className="mt-14 grid grid-cols-12 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-20">
        {items.map((item, index) => {
          const slotStyle = layout[index % layout.length]!;

          return (
            <figure
              key={item.id}
              data-tile
              className={cn("col-span-6 m-0", slotStyle.span, slotStyle.offset)}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group/fig block w-full text-left"
                aria-label={`Open image: ${item.caption}`}
              >
                <div className="relative">
                  <Figure
                    slot={item.image}
                    ratio={ratioMap[item.ratio]}
                    index={String(index + 1).padStart(2, "0")}
                    interactive
                    sizes="(max-width: 768px) 46vw, (max-width: 1280px) 40vw, 30vw"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-ink/80 text-bone opacity-0 transition-opacity duration-500 group-hover/fig:opacity-100"
                  >
                    <Maximize2 className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                </div>

                <figcaption className="mt-4 flex items-baseline gap-4">
                  <span className="eyebrow shrink-0 text-soil">{item.category}</span>
                  <span className="text-[0.8125rem] leading-relaxed text-muted">
                    {item.caption}
                  </span>
                </figcaption>
              </button>
            </figure>
          );
        })}
      </div>

      <GalleryLightbox
        items={items}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
