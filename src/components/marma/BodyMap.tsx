"use client";

import { useState } from "react";
import type { Content } from "@/lib/content/defaults";
import { cn } from "@/lib/utils";

type Region = Content["marma"]["points"]["regions"][number];

/** Marker positions as percentages of the plate, roughly anatomical. */
const positions: Record<string, { x: number; y: number }> = {
  head: { x: 50, y: 11 },
  torso: { x: 50, y: 33 },
  back: { x: 74, y: 37 },
  arms: { x: 24, y: 45 },
  legs: { x: 50, y: 74 },
};

/**
 * Interactive placeholder for the marma plate.
 *
 * No anatomy is drawn: an invented body diagram would be both a fabricated
 * asset and a poor one. What exists is the annotation layer — an axis, region
 * bands and five interactive markers — designed to sit over commissioned
 * artwork the moment it arrives. Dropping an illustration in behind this is a
 * single `backgroundImage` (or <Figure />) away.
 *
 * Every marker is a real button: hover, focus and keyboard all select, and the
 * detail panel is an aria-live region so screen-reader users get the change.
 */
export function BodyMap({ regions }: { regions: readonly Region[] }) {
  const [activeId, setActiveId] = useState<string>(regions[0]?.id ?? "");
  const active = regions.find((region) => region.id === activeId) ?? regions[0];

  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
      {/* Plate */}
      <div className="lg:col-span-6">
        <div className="relative mx-auto aspect-[3/5] w-full max-w-sm overflow-hidden bg-green-deep grain lg:max-w-none">
          {/* Frame + technical rules */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-4 border border-bone/15" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-4 left-1/2 w-px bg-bone/10" />
          {[22, 41, 58, 84].map((top) => (
            <span
              key={top}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 h-px bg-bone/8"
              style={{ top: `${top}%` }}
            />
          ))}

          <span className="eyebrow pointer-events-none absolute left-7 top-7 text-bone/35">
            Plate 01
          </span>
          <span className="eyebrow pointer-events-none absolute bottom-7 right-7 text-bone/35">
            Artwork pending
          </span>

          {regions.map((region) => {
            const position = positions[region.id] ?? { x: 50, y: 50 };
            const isActive = region.id === activeId;

            return (
              <button
                key={region.id}
                type="button"
                onMouseEnter={() => setActiveId(region.id)}
                onFocus={() => setActiveId(region.id)}
                onClick={() => setActiveId(region.id)}
                aria-pressed={isActive}
                className="group absolute -translate-x-1/2 -translate-y-1/2 p-3"
                style={{ left: `${position.x}%`, top: `${position.y}%` }}
              >
                <span className="sr-only">{region.label}</span>
                {/* Crosshair */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative block h-3.5 w-3.5 rotate-45 border transition-[transform,background-color,border-color] duration-[0.6s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isActive
                      ? "scale-125 border-soil bg-soil"
                      : "border-bone/45 bg-transparent group-hover:border-soil",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "eyebrow absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap transition-opacity duration-500",
                    isActive ? "text-soil opacity-100" : "text-bone/40 opacity-0 group-hover:opacity-100",
                  )}
                >
                  {region.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail */}
      <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
        <p className="eyebrow text-soil">The classical grouping</p>

        <div aria-live="polite" className="mt-7 min-h-[9rem]">
          <h3 className="text-headline font-semibold tracking-[-0.033em] text-bone">
            {active?.label}
          </h3>
          <p className="measure mt-5 text-lead text-bone/65">{active?.blurb}</p>
        </div>

        {/* A plain list under the plate, so the same content is reachable
            without interacting with the markers at all. */}
        <ul className="m-0 mt-10 list-none p-0">
          {regions.map((region) => (
            <li key={region.id}>
              <button
                type="button"
                onClick={() => setActiveId(region.id)}
                className={cn(
                  "flex w-full items-center gap-4 border-t border-bone/14 py-4 text-left transition-colors duration-500",
                  region.id === activeId ? "text-bone" : "text-bone/50 hover:text-bone/80",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px transition-all duration-[0.7s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    region.id === activeId ? "w-8 bg-soil" : "w-3 bg-bone/30",
                  )}
                />
                <span className="text-meta-lg font-medium uppercase">{region.label}</span>
              </button>
            </li>
          ))}
          <li aria-hidden="true" className="border-t border-bone/14" />
        </ul>
      </div>
    </div>
  );
}
