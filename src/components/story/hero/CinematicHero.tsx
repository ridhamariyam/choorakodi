"use client";

import { useRef } from "react";
import { heroEager, heroEarth, heroFightFrames, heroImages } from "@/data/hero";
import type { Story } from "@/lib/content/defaults";
import { useGsap } from "@/hooks/useGsap";
import { drawCam, type Drawable } from "./camera";
import { createTimeline, type Env } from "./timeline";

/** Pinned scroll length, in viewport heights, per unit of timeline weight. */
const VH_PER_WEIGHT = { desktop: 8 / 120, mobile: 5.5 / 120 };
/** How quickly the camera catches up with the scrollbar (per frame at 60fps). */
const CATCH_UP = 0.085;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      // decode() keeps the first draw of a large frame off the scroll path.
      img.decode().then(() => resolve(img), () => resolve(img));
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * The cinematic hero: one continuous camera move from above the clouds, down
 * through the kalari roof, into the room and onto its earthen floor.
 *
 * The section pins while the scrollbar drives the camera. The canvas lags the
 * scroll very slightly so the camera feels heavy, and the pin only releases
 * once the camera has settled on the floor — the chronicle below starts in
 * the same dark earth the last frame falls into.
 */
export function CinematicHero({ intro }: { intro: Story["intro"] }) {
  const scope = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, ScrollTrigger, root, reduced, cleanup }) => {
      const canvas = root.querySelector<HTMLCanvasElement>("canvas");
      const ctx = canvas?.getContext("2d", { alpha: false });
      if (!canvas || !ctx) return;

      const html = document.documentElement;
      const vignette = root.querySelector<HTMLElement>("[data-vignette]");
      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const images = new Map<string, Drawable>();
      const scratchCanvas = document.createElement("canvas");
      const scratch = scratchCanvas.getContext("2d");
      if (!scratch) return;

      const timeline = createTimeline(heroFightFrames.length, mobile ? 36 : 80);
      const env: Env = {
        ctx,
        scratch,
        view: { w: 1, h: 1 },
        dpr: 1,
        time: 0,
        img: (key) => images.get(key) ?? null,
        fight: heroFightFrames,
      };

      let dirty = true;
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        // Source frames are ~1700px wide; rendering far beyond that only costs fill-rate.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.6, 2200 / Math.max(1, rect.width));
        canvas.width = scratchCanvas.width = Math.round(rect.width * dpr);
        canvas.height = scratchCanvas.height = Math.round(rect.height * dpr);
        env.view = { w: canvas.width, h: canvas.height };
        env.dpr = dpr;
        dirty = true;
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      // ---- loading: the opening shots first, then the rest in camera order.
      let cancelled = false;
      const load = async (key: string, src: string) => {
        try {
          const img = await loadImage(src);
          if (cancelled) return;
          images.set(key, img);
          dirty = true;
        } catch {
          /* a missing frame simply isn't drawn; the camera carries on */
        }
      };
      const lazy = (Object.keys(heroImages) as (keyof typeof heroImages)[]).filter((k) => !heroEager.includes(k));
      Promise.all(heroEager.map((k) => load(k, heroImages[k]))).then(async () => {
        // Tell the logo preloader the opening shot is on screen, two frames
        // after it was drawn, so it dissolves into the sky rather than a gap.
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => window.dispatchEvent(new Event("hero:ready"))),
        );
        for (const k of lazy) await load(k, heroImages[k]);
        for (const [i, src] of heroFightFrames.entries()) await load(`fight${i}`, src);
      });

      if (reduced) {
        // A single still of the kalari; no pin, no scroll hijack.
        load("kalari", heroImages.kalari).then(() => {
          const img = images.get("kalari");
          if (img) drawCam(ctx, img, env.view, { x: 0.5, y: 0.5, z: 1 });
        });
        cleanup(() => {
          cancelled = true;
          ro.disconnect();
        });
        return;
      }

      // As the preloader's haze lifts, the camera settles out of a slight
      // push-in — the logo drifts toward the viewer, the sky drifts back.
      const lens = root.querySelectorAll("img, canvas");
      const onLeaving = () => {
        // Continues the preloader's zoom into the logo: the camera keeps
        // travelling in and settles on the first frame.
        gsap.fromTo(lens, { scale: 1.2 }, { scale: 1, duration: 2.4, ease: "power3.out", clearProps: "transform" });
      };
      window.addEventListener("ck-leaving", onLeaving, { once: true });

      // ---- scroll → camera
      let target = 0;
      let current = 0;
      let active = true;
      const length = () =>
        window.innerHeight * timeline.weight * (mobile ? VH_PER_WEIGHT.mobile : VH_PER_WEIGHT.desktop);

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${length()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          target = self.progress;
        },
        onToggle: (self) => {
          html.dataset.heroActive = String(self.isActive);
        },
      });
      target = current = trigger.progress;
      html.dataset.heroActive = String(trigger.isActive || window.scrollY < 10);

      // Only animate while the hero is on screen.
      const io = new IntersectionObserver(([entry]) => {
        active = Boolean(entry?.isIntersecting);
        if (active) start();
      });
      io.observe(root);

      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        raf = 0;
        const dt = Math.min(0.1, (now - last) / 1000);
        last = now;
        env.time += dt;
        const step = 1 - Math.pow(1 - CATCH_UP, dt * 60);
        const delta = target - current;
        current = Math.abs(delta) < 0.00005 ? target : current + delta * step;
        // Dust keeps moving while visible, so the frame always redraws.
        timeline.render(env, current);
        // The lens vignette lifts as the floor becomes the page's ground.
        if (vignette) vignette.style.opacity = String(1 - Math.min(1, Math.max(0, (current - 0.9) / 0.08)));
        dirty = false;
        if (active) raf = window.requestAnimationFrame(tick);
      };
      const start = () => {
        if (!raf) {
          last = performance.now();
          raf = window.requestAnimationFrame(tick);
        }
      };
      start();

      // Draw once immediately so the first paint is the sky, not a blank canvas.
      if (dirty) timeline.render(env, current);

      cleanup(() => {
        cancelled = true;
        window.removeEventListener("ck-leaving", onLeaving);
        window.cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        delete html.dataset.heroActive;
      });
    },
    [],
    { scope },
  );

  return (
    <section
      ref={scope}
      id="intro"
      data-bg={intro.bg}
      data-counter={intro.counter}
      data-nav-theme="dark"
      className="relative h-svh min-h-[34rem] overflow-hidden"
      style={{ backgroundColor: heroEarth }}
    >
      <h1 className="sr-only">{intro.heading}</h1>
      {/* The first frame as a plain image, so there is a picture before JS runs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroImages.sky}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <canvas aria-hidden="true" className="absolute inset-0 h-full w-full" />
      {/* Lens vignette — cheaper as CSS than per frame on the canvas. */}
      <div
        aria-hidden="true"
        data-vignette
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(20_14_11/0.55))]"
      />
    </section>
  );
}

