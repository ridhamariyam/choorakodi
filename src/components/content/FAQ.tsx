"use client";

import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Plus } from "lucide-react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/hooks/useGsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";
import { LineReveal } from "@/components/animation/LineReveal";
import { PendingCopy } from "./PendingCopy";
import type { FaqItem } from "@/data/faq";
import { cn } from "@/lib/utils";

export type FaqProps = {
  items: FaqItem[];
  tone?: "light" | "dark";
  className?: string;
  /** Index of the row open on first render. -1 for all closed. */
  defaultOpen?: number;
  /** Rows shown until the visitor asks for the rest. Omit to show them all. */
  limit?: number;
};

/**
 * Disclosure accordion.
 *
 * Real buttons with `aria-expanded` / `aria-controls`, so keyboard and screen
 * reader users get the standard pattern.
 *
 * Panel visibility is driven imperatively rather than from render state. If
 * `hidden` were bound to state, React would apply `display: none` on the same
 * commit as the click and the collapse animation would never be seen. Instead
 * every answer is present and open in the server HTML — good for crawlers and
 * for a JS failure — and the closed ones are hidden in a layout effect before
 * the first paint. Rows past `limit` stay in the HTML for the same reason.
 */
export function FAQ({ items, tone = "light", className, defaultOpen = -1, limit }: FaqProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const collapsed = limit !== undefined && !showAll && items.length > limit;
  const baseId = useId();
  const scope = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGsap(
    () => {
      panelRefs.current.forEach((panel, index) => {
        if (!panel) return;
        panel.hidden = index !== defaultOpen;
      });
    },
    [defaultOpen, items.length],
    { scope },
  );

  const animate = (index: number, expand: boolean) => {
    const panel = panelRefs.current[index];
    if (!panel) return;

    gsap.killTweensOf(panel);

    if (prefersReducedMotion()) {
      panel.hidden = !expand;
      gsap.set(panel, { height: "auto", opacity: 1 });
      return;
    }

    if (expand) {
      panel.hidden = false;
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        {
          height: "auto",
          opacity: 1,
          duration: 0.62,
          ease: "power3.out",
          // Leave it at auto so the panel reflows if the text wraps later.
          onComplete: () => gsap.set(panel, { height: "auto" }),
        },
      );
      return;
    }

    gsap.to(panel, {
      height: 0,
      opacity: 0,
      duration: 0.45,
      ease: "power3.inOut",
      // Hidden only once it has finished collapsing, so the closed answer
      // leaves the accessibility tree without cutting the motion short.
      onComplete: () => {
        panel.hidden = true;
      },
    });
  };

  const toggle = (index: number) => {
    const next = open === index ? -1 : index;
    if (open !== -1) animate(open, false);
    if (next !== -1) animate(next, true);
    setOpen(next);
  };

  const revealAll = () => {
    flushSync(() => setShowAll(true));
    // The button is gone; carry focus to the first row it revealed.
    document.getElementById(`${baseId}-q-${limit}`)?.focus({ preventScroll: true });
    // Everything below the list has moved, pinned sections included.
    ScrollTrigger.refresh();
  };

  return (
    <div ref={scope} className={cn("w-full", className)}>
      <LineReveal tone={tone} />
      <dl className="m-0">
        {items.map((item, index) => {
          const isOpen = open === index;
          const buttonId = `${baseId}-q-${index}`;
          const panelId = `${baseId}-a-${index}`;

          return (
            <div
              key={item.question}
              hidden={collapsed && index >= (limit ?? 0)}
              className={cn("border-b", tone === "light" ? "border-ink/12" : "border-bone/15")}
            >
              <dt>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                  className={cn(
                    "group flex w-full items-start justify-between gap-6 py-7 text-left transition-colors duration-500 sm:py-8",
                    tone === "light" ? "hover:text-green" : "hover:text-soil-ink",
                  )}
                >
                  <span className="text-lg font-medium tracking-[-0.018em] sm:text-xl">
                    {item.question}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 shrink-0 transition-transform duration-[0.55s] ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen && "rotate-45",
                    )}
                  >
                    <Plus className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                </button>
              </dt>

              <dd className="m-0">
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  ref={(node) => {
                    panelRefs.current[index] = node;
                  }}
                  className="overflow-hidden"
                >
                  <div className="pb-8 pr-10">
                    <p
                      className={cn(
                        "measure text-lead",
                        tone === "light" ? "text-ink/72" : "text-bone/68",
                      )}
                    >
                      {item.answer}
                    </p>
                    {item.pending ? (
                      <PendingCopy tone={tone} className="mt-6" label="Confirm with academy">
                        This answer is provisional until the academy supplies the detail.
                      </PendingCopy>
                    ) : null}
                  </div>
                </div>
              </dd>
            </div>
          );
        })}
      </dl>
      {collapsed ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={revealAll}
            className={cn(
              "flex items-center gap-3 py-2 text-[12px] font-semibold uppercase tracking-[4px] transition-colors duration-500",
              tone === "light" ? "hover:text-green" : "hover:text-soil-ink",
            )}
          >
            More questions
            <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : null}
    </div>
  );
}
