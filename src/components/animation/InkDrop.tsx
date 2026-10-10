"use client";

import { useId, useRef } from "react";
import { useGsap } from "@/hooks/useGsap";

type Drop = { x: number; y: number; scale: number; texture: number };

/** Small deterministic PRNG, so every image keeps its own drop pattern. */
function random(seed: string) {
  let h = 2166136261;
  for (const char of seed) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const TEXTURE_SIZE = 256;
/** Final blot size as a multiple of the frame. */
const SPREAD = 1.04;
const TEXTURE_VARIANTS = 4;
let textures: string[] | null = null;

/**
 * Ink-blot alpha masks, painted once per page load and shared by every
 * image. Each is an irregular blob — a circle whose radius wobbles through
 * several random harmonics — with soft, feathered edges and a few thrown-off
 * specks, the way a drop lands on absorbent paper.
 */
function inkTextures(): string[] {
  if (textures) return textures;
  textures = Array.from({ length: TEXTURE_VARIANTS }, (_, variant) => {
    const rand = random(`ink-${variant}`);
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = TEXTURE_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    const c = TEXTURE_SIZE / 2;
    // Large enough to fill a frame, small enough that the widest lobe and the
    // specks stay inside the texture (a clipped texture would show a straight edge).
    const base = TEXTURE_SIZE * 0.4;

    const harmonics = Array.from({ length: 7 }, (_, i) => ({
      k: [3, 5, 7, 11, 13, 17, 23][i] ?? 3,
      a: (rand() * 0.08) / (1 + i * 0.35),
      p: rand() * Math.PI * 2,
    }));

    ctx.filter = "blur(3px)";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    for (let i = 0; i <= 240; i++) {
      const t = (i / 240) * Math.PI * 2;
      let r = 1;
      for (const h of harmonics) r += h.a * Math.sin(h.k * t + h.p);
      const x = c + Math.cos(t) * base * r;
      const y = c + Math.sin(t) * base * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();

    // Specks thrown off the edge.
    for (let i = 0; i < 9; i++) {
      const t = rand() * Math.PI * 2;
      const d = base * (1.04 + rand() * 0.08);
      ctx.beginPath();
      ctx.arc(c + Math.cos(t) * d, c + Math.sin(t) * d, 1.5 + rand() * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    return `url(${canvas.toDataURL("image/png")})`;
  });
  return textures;
}

function dropsFor(seed: string): Drop[] {
  const rand = random(seed);
  const texture = () => Math.floor(rand() * TEXTURE_VARIANTS);
  const jitter = () => (rand() - 0.5) * 0.04;
  // One big blot from the middle, then drops that bloom into the corners and
  // along the sides, so the image soaks through almost the whole frame and
  // only a thin ragged ink edge remains — never a straight, cut border.
  const corners = [
    [0.22, 0.22],
    [0.78, 0.22],
    [0.22, 0.78],
    [0.78, 0.78],
  ].map(([x = 0, y = 0]) => ({ x: x + jitter(), y: y + jitter(), scale: 0.4, texture: texture() }));
  const sides = [
    [0.5, 0.15],
    [0.5, 0.85],
    [0.15, 0.5],
    [0.85, 0.5],
  ].map(([x = 0, y = 0]) => ({ x: x + jitter(), y: y + jitter(), scale: 0.27, texture: texture() }));
  return [{ x: 0.5 + jitter(), y: 0.5 + jitter(), scale: 1, texture: texture() }, ...corners, ...sides];
}

/**
 * Ink-drop entrance for an image.
 *
 * Nothing of the picture — not even its rectangle — shows until it enters
 * the viewport. Then the image itself lands on the page as drops of ink:
 * a few small blots appear, bloom outwards with feathered edges and run
 * together until the photograph has soaked through almost the whole frame.
 * It keeps a thin ragged ink edge; it never resolves into a hard rectangle.
 *
 * Renders an empty marker and works on its parent element (the image's
 * frame) through a set of CSS mask layers. Each blot is stretched to the
 * frame's proportions, so it fills the frame without touching its edges.
 * Reduced motion gets the finished spread with no animation; without JS no
 * mask is applied and the image is simply there.
 */
export function InkDrop() {
  const scope = useRef<HTMLSpanElement>(null);
  const uid = useId();

  useGsap(
    ({ gsap, root, reduced, cleanup }) => {
      const host = root.parentElement;
      if (!host) return;
      const drops = dropsFor(uid);
      const layers = inkTextures();
      if (layers.some((layer) => !layer)) return;

      const style = host.style as CSSStyleDeclaration & { webkitMaskImage?: string; webkitMaskSize?: string; webkitMaskPosition?: string; webkitMaskRepeat?: string };
      const progress = drops.map(() => ({ p: 0 }));

      const paint = () => {
        const width = host.offsetWidth;
        const height = host.offsetHeight;
        const sizes: string[] = [];
        const positions: string[] = [];
        drops.forEach((drop, i) => {
          // A blot is ~0.4 of its texture in radius and at most ~0.48 with its
          // wobble, so ~1× the frame fills it while keeping lobes inside.
          const f = SPREAD * drop.scale * (progress[i]?.p ?? 0);
          const w = width * f;
          const h = height * f;
          sizes.push(`${w}px ${h}px`);
          positions.push(`${drop.x * width - w / 2}px ${drop.y * height - h / 2}px`);
        });
        style.maskSize = style.webkitMaskSize = sizes.join(", ");
        style.maskPosition = style.webkitMaskPosition = positions.join(", ");
      };

      const observer = new ResizeObserver(paint);
      observer.observe(host);

      const clear = () => {
        for (const prop of ["mask-image", "mask-size", "mask-position", "mask-repeat", "-webkit-mask-image", "-webkit-mask-size", "-webkit-mask-position", "-webkit-mask-repeat"]) {
          host.style.removeProperty(prop);
        }
      };

      const images = drops.map((drop) => layers[drop.texture]).join(", ");
      style.maskImage = style.webkitMaskImage = images;
      style.maskRepeat = style.webkitMaskRepeat = "no-repeat";
      if (reduced) {
        progress.forEach((drop) => (drop.p = 1));
        paint();
        cleanup(() => {
          observer.disconnect();
          clear();
        });
        return;
      }
      paint();
      host.setAttribute("data-ink", "pending");

      const tl = gsap.timeline({
        paused: true,
        onStart: () => host.setAttribute("data-ink", "spreading"),
        onUpdate: paint,
        onComplete: () => host.setAttribute("data-ink", "done"),
      });
      // The first few drops land one after another as small blots…
      progress.slice(0, 3).forEach((drop, i) => {
        tl.to(drop, { p: 0.06, duration: 0.35, ease: "power2.out" }, i * 0.14);
      });
      // …then the main blot blooms and the rest run out into the corners.
      progress.forEach((drop, i) => {
        tl.to(drop, { p: 1, duration: 2.4, ease: "expo.out" }, i === 0 ? 0.45 : 0.6 + i * 0.07);
      });

      gsap.timeline({
        scrollTrigger: { trigger: host, start: "top 85%", once: true, onEnter: () => tl.play() },
      });

      cleanup(() => {
        observer.disconnect();
        clear();
        host.removeAttribute("data-ink");
      });
    },
    [uid],
    { scope },
  );

  return <span ref={scope} aria-hidden="true" hidden />;
}
