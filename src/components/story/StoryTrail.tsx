"use client";

import { useEffect, useRef, type RefObject } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/hooks/useReducedMotion";

/** Distance between dots, in px along the path. */
const SPACING = 14;
/** A dot is set down once it rises above this fraction of the viewport. */
const LINE = 0.72;

/**
 * One dotted path through the whole chronicle. It crosses the page at the top
 * of every chapter (in the open ground above the year), then runs down the
 * gutter on that chapter's side, so it never cuts through the writing.
 *
 * Dots are set down one at a time as the page scrolls, and lifted again on the
 * way back up; a larger dot marks where the trail has got to.
 */
export function StoryTrail({ scope }: { scope: RefObject<HTMLElement | null> }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = scope.current;
    const svg = svgRef.current;
    if (!root || !svg) return;

    const reduced = prefersReducedMotion();
    let dots: SVGCircleElement[] = [];
    let thresholds: number[] = [];
    let points: { x: number; y: number }[] = [];
    let shown = 0;
    let raf = 0;
    const head = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    head.setAttribute("r", "4");
    head.setAttribute("class", "story-trail-head");

    const build = () => {
      const width = root.clientWidth;
      const height = root.scrollHeight;
      const vw = width / 100;
      const top = root.getBoundingClientRect().top;
      // The gutter is clamp(1.25rem, 5vw, 5.5rem); the trail runs down its middle.
      const gutter = Math.min(Math.max(20, 5 * vw), 88);
      const lane = { left: gutter / 2, right: width - gutter / 2 };
      const centre = width / 2;

      const stops = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
      if (stops.length === 0) return;

      // Waypoints: centre just inside each chapter's top, then that chapter's
      // gutter, down to just above the next chapter.
      const way: { x: number; y: number }[] = [];
      let side: "left" | "right" = "right";
      stops.forEach((stop, i) => {
        const y = stop.getBoundingClientRect().top - top;
        const next = stops[i + 1];
        const end = next ? next.getBoundingClientRect().top - top - 6 * vw : height - 12 * vw;
        side = stop.dataset.trailSide === "left" || stop.dataset.trailSide === "right"
          ? stop.dataset.trailSide
          : side === "left" ? "right" : "left";
        const x = lane[side];
        way.push({ x: centre, y: y + 10 * vw });
        const into = Math.min(y + 26 * vw, end);
        way.push({ x, y: into });
        if (end > into) way.push({ x, y: end });
      });

      // Vertical tangents at every waypoint: smooth S-bends between lanes,
      // straight runs down them.
      let d = `M${way[0]!.x} ${way[0]!.y}`;
      for (let i = 1; i < way.length; i++) {
        const a = way[i - 1]!;
        const b = way[i]!;
        const mid = (a.y + b.y) / 2;
        d += a.x === b.x ? `L${b.x} ${b.y}` : `C${a.x} ${mid} ${b.x} ${mid} ${b.x} ${b.y}`;
      }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;
      svg.replaceChildren(path);
      const length = path.getTotalLength();
      points = [];
      for (let at = 0; at <= length; at += SPACING) {
        const p = path.getPointAtLength(at);
        points.push({ x: p.x, y: p.y });
      }
      path.remove();

      // Each dot waits for the one before it, so they are set down in order
      // even where the path bends back up.
      let reach = -Infinity;
      thresholds = points.map((p) => (reach = Math.max(reach, p.y)));

      const fragment = document.createDocumentFragment();
      dots = points.map((p) => {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", p.x.toFixed(1));
        dot.setAttribute("cy", p.y.toFixed(1));
        dot.setAttribute("r", "1.7");
        dot.setAttribute("class", reduced ? "story-trail-dot is-on" : "story-trail-dot");
        fragment.appendChild(dot);
        return dot;
      });
      svg.appendChild(fragment);
      shown = reduced ? dots.length : 0;
      if (!reduced) {
        svg.appendChild(head);
        update();
      }
    };

    const update = () => {
      raf = 0;
      const line = window.innerHeight * LINE - root.getBoundingClientRect().top;
      // Binary search: how many dots are above the line.
      let lo = 0;
      let hi = thresholds.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (thresholds[mid]! <= line) lo = mid + 1;
        else hi = mid;
      }
      for (let i = shown; i < lo; i++) dots[i]?.classList.add("is-on");
      for (let i = lo; i < shown; i++) dots[i]?.classList.remove("is-on");
      shown = lo;
      const tip = points[shown - 1];
      if (tip) {
        head.setAttribute("cx", tip.x.toFixed(1));
        head.setAttribute("cy", tip.y.toFixed(1));
      }
      head.style.opacity = tip && shown < points.length ? "1" : "0";
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    build();
    // ScrollTrigger's pins change where every chapter sits; rebuild after it
    // lays the page out, and whenever images settle the height.
    ScrollTrigger.addEventListener("refresh", build);
    let timer = 0;
    const resize = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(build, 200);
    });
    resize.observe(root);
    if (!reduced) window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ScrollTrigger.removeEventListener("refresh", build);
      resize.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(raf);
    };
  }, [scope]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      className="story-trail pointer-events-none absolute inset-x-0 top-0 z-[1] w-full"
    />
  );
}
