import { heroEarth, heroFocus, heroGround, heroMud, type HeroImageKey } from "@/data/hero";
import {
  clamp01,
  drawCam,
  drawMasked,
  drawPlaced,
  ease,
  lerp,
  lerpCam,
  place,
  smoothstep,
  type Cam,
  type Drawable,
  type View,
} from "./camera";

export type Env = {
  ctx: CanvasRenderingContext2D;
  scratch: CanvasRenderingContext2D;
  view: View;
  dpr: number;
  /** Seconds since mount — drives idle motion such as dust. */
  time: number;
  img: (key: string) => Drawable | null;
  fight: string[];
};

type Segment = { name: string; weight: number; draw: (env: Env, u: number) => void };

const C = (x: number, y: number, z: number): Cam => ({ x, y, z });

/** Holds a shot while the camera drifts between two positions. */
function drift(key: HeroImageKey, from: Cam, to: Cam): Segment["draw"] {
  return (env, u) => {
    const img = env.img(key);
    if (img) drawCam(env.ctx, img, env.view, lerpCam(from, to, ease(u)));
  };
}

/** Two shots of the same space; the camera keeps travelling through a focus pull. */
function dissolve(
  a: HeroImageKey | ((env: Env) => Drawable | null),
  aFrom: Cam,
  aTo: Cam,
  b: HeroImageKey,
  bFrom: Cam,
  bTo: Cam,
  window: [number, number] = [0.25, 0.8],
): Segment["draw"] {
  return (env, u) => {
    const e = ease(u);
    const mix = smoothstep(window[0], window[1], u);
    const A = typeof a === "function" ? a(env) : env.img(a);
    const B = env.img(b);
    const focus = 5 * env.dpr;
    if (A && mix < 1) drawCam(env.ctx, A, env.view, lerpCam(aFrom, aTo, e), { blur: mix * focus });
    if (B) drawCam(env.ctx, B, env.view, lerpCam(bFrom, bTo, e), { alpha: A ? mix : 1, blur: (1 - mix) * focus });
  };
}

/**
 * Flies into a point of shot A where shot B is discovered, B growing inside a
 * feathered iris until it fills the frame at exactly its resting camera.
 */
function zoomThrough(
  a: HeroImageKey,
  b: HeroImageKey,
  focus: { x: number; y: number; k: number },
  from: Cam,
  window: [number, number] = [0.35, 0.82],
): Segment["draw"] {
  return (env, u) => {
    const { ctx, view } = env;
    const A = env.img(a);
    const B = env.img(b);
    const mix = smoothstep(window[0], window[1], u);
    if (B && mix >= 1) {
      drawCam(ctx, B, view, C(0.5, 0.5, 1));
      return;
    }
    if (!A) {
      if (B) drawCam(ctx, B, view, C(0.5, 0.5, 1), { alpha: mix });
      return;
    }
    const e = ease(u);
    const zEnd = 1 / focus.k;
    const cam = C(lerp(from.x, focus.x, e), lerp(from.y, focus.y, e), from.z * Math.pow(zEnd / from.z, e));
    const pA = place(A, view, cam);
    drawPlaced(ctx, A, pA, { blur: smoothstep(0.5, 1, u) * 4 * env.dpr });
    if (!B) return;

    const sx = pA.dx + focus.x * A.width * pA.s;
    const sy = pA.dy + focus.y * A.height * pA.s;
    const s = (focus.k * A.width * pA.s) / B.width;
    const pB = { s, dx: sx - (B.width * s) / 2, dy: sy - (B.height * s) / 2 };
    const reach = Math.hypot(view.w, view.h);
    const r = lerp(B.width * s * 0.28, reach * 1.25, mix);
    drawMasked(ctx, env.scratch, B, pB, { cx: sx, cy: sy, r, feather: 0.55 }, Math.min(1, mix * 1.6), (1 - mix) * 2 * env.dpr);
  };
}

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const MUD = rgb(heroMud);
const GROUND = rgb(heroGround);

/**
 * The floor dissolves upward into the ground the chronicle is set on: the
 * earth warms first, then kalari mud rises from the bottom of the frame and,
 * in the last stretch, lightens into the page's ground. By the end the whole
 * frame is ground, which is exactly what the next chapter scrolls in over.
 */
function groundRise(env: Env, amount: number) {
  if (amount <= 0) return;
  const { ctx, view } = env;
  const light = smoothstep(0.72, 1, amount);
  const GROUND_RGB = MUD.map((c, i) => Math.round(lerp(c, GROUND[i]!, light))).join(",");
  ctx.save();
  ctx.globalAlpha = amount * 0.35;
  ctx.fillStyle = `rgb(${GROUND_RGB})`;
  ctx.fillRect(0, 0, view.w, view.h);
  ctx.globalAlpha = 1;
  // By the end the whole frame is ground, so the hero's edge has no seam.
  const edge = lerp(1.05, -0.9, amount);
  const solid = lerp(1.3, -0.1, amount);
  const g = ctx.createLinearGradient(0, 0, 0, view.h);
  // Alpha at any y is a linear ramp from `edge` (clear) to `solid` (opaque).
  const at = (y: number) => clamp01((y - edge) / (solid - edge));
  g.addColorStop(0, `rgba(${GROUND_RGB},${at(0)})`);
  if (edge > 0 && edge < 1) g.addColorStop(edge, `rgba(${GROUND_RGB},0)`);
  if (solid > 0 && solid < 1) g.addColorStop(solid, `rgba(${GROUND_RGB},1)`);
  g.addColorStop(1, `rgba(${GROUND_RGB},${at(1)})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, view.w, view.h);
  ctx.restore();
}

// ---------------------------------------------------------------------------
// Camera stations — each segment ends exactly where the next one begins.
// ---------------------------------------------------------------------------
const REST = C(0.5, 0.5, 1);
const SKY_END = C(0.505, 0.515, 1.12);
const LAND_END = C(0.5, 0.515, 1.25);
const ROOF_END = C(0.49, 0.44, 1.35);
const GABLE_START = C(0.495, 0.46, 1.3);
const GABLE_REST = C(0.495, 0.5, 1.08);
const GABLE_PUSH = C(heroFocus.gableVent.x, heroFocus.gableVent.y, 2.0);
const RAFTERS_IN = C(0.5, 0.5, 1.35);
const RAFTERS_REST = C(0.5, 0.5, 1.12);
const RAFTERS_LOW = C(0.5, 0.56, 1.08);
const UPPER_REST = C(0.5, 0.5, 1.06);
const KALARI_REST = C(0.5, 0.5, 1.04);
const KALARI_PUSH = C(heroFocus.kalariFloor.x, 0.6, 1.14);
const BELOW_REST = C(0.5, 0.5, 1.06);
const BELOW_LOW = C(0.5, 0.58, 1.1);
const FLOOR_REST = C(0.5, 0.55, 1.04);

function buildSegments(fightCount: number): Segment[] {
  const segments: Segment[] = [
    { name: "sky", weight: 8, draw: drift("sky", REST, SKY_END) },
    { name: "sky-to-land", weight: 10, draw: zoomThrough("sky", "landscape", heroFocus.skyRoof, SKY_END) },
    { name: "land", weight: 6, draw: drift("landscape", REST, LAND_END) },
    { name: "land-to-roof", weight: 12, draw: zoomThrough("landscape", "roof", heroFocus.landscapeRoof, LAND_END) },
    { name: "roof", weight: 6, draw: drift("roof", REST, ROOF_END) },
    {
      name: "roof-to-gable",
      weight: 10,
      draw: dissolve("roof", ROOF_END, C(heroFocus.roofVent.x, heroFocus.roofVent.y, 2.6), "gable", GABLE_START, GABLE_REST, [0.3, 0.8]),
    },
    { name: "gable", weight: 8, draw: drift("gable", GABLE_REST, GABLE_PUSH) },
    {
      // Through the tiles: the gable closes in, then the tile frame swings
      // past the lens and the rafters open up beyond it.
      name: "enter",
      weight: 12,
      draw: (env, u) => {
        const { ctx, view, dpr } = env;
        const rafters = env.img("rafters");
        const gable = env.img("gable");
        const frame = env.img("opening");
        if (rafters) drawCam(ctx, rafters, view, lerpCam(RAFTERS_IN, RAFTERS_REST, ease(u)));
        if (frame) {
          const q = smoothstep(0.1, 1, u);
          const hole = heroFocus.openingHole;
          drawCam(ctx, frame, view, C(hole.x, hole.y, 1 * Math.pow(5, q)), {
            alpha: 1 - smoothstep(0.62, 0.92, u),
            blur: q * 7 * dpr,
          });
        }
        if (gable) {
          const g = lerpCam(GABLE_PUSH, C(GABLE_PUSH.x, GABLE_PUSH.y, 2.8), smoothstep(0, 0.3, u));
          drawCam(ctx, gable, view, g, { alpha: 1 - smoothstep(0.05, 0.3, u), blur: smoothstep(0, 0.3, u) * 4 * dpr });
        }
      },
    },
    {
      name: "rafters",
      weight: 8,
      draw: (env, u) => {
        const { ctx, view, dpr } = env;
        drift("rafters", RAFTERS_REST, RAFTERS_LOW)(env, u);
        const beam = env.img("beam");
        if (!beam) return;
        // A rafter slides past close to the lens, far out of focus.
        const q = smoothstep(0.05, 0.85, u);
        const p = place(beam, view, C(0.5, 0.5, 1.5));
        const travelX = lerp(0.55, -0.6, q) * view.w;
        const travelY = lerp(0.45, -0.55, q) * view.h;
        drawPlaced(ctx, beam, { ...p, dx: p.dx + travelX, dy: p.dy + travelY }, {
          alpha: smoothstep(0, 0.15, u) * (1 - smoothstep(0.8, 0.95, u)),
          blur: 3 * dpr,
        });
      },
    },
    { name: "descend", weight: 8, draw: dissolve("rafters", RAFTERS_LOW, C(0.5, 0.66, 1.12), "upper", C(0.5, 0.35, 1.14), UPPER_REST) },
    { name: "arrive", weight: 8, draw: dissolve("upper", UPPER_REST, C(0.53, 0.6, 1.14), "kalari", C(0.5, 0.38, 1.12), KALARI_REST) },
    { name: "kalari", weight: 6, draw: drift("kalari", KALARI_REST, KALARI_PUSH) },
  ];

  if (fightCount > 0) {
    segments.push({
      name: "fight",
      weight: 22,
      draw: (env, u) => {
        const cam = lerpCam(KALARI_PUSH, C(KALARI_PUSH.x, KALARI_PUSH.y, 1.2), u);
        const kalari = env.img("kalari");
        // The first frame is discovered in the empty room, then the frames play.
        const reveal = smoothstep(0, 0.12, u);
        if (kalari && reveal < 1) drawCam(env.ctx, kalari, env.view, cam);
        const pos = smoothstep(0.08, 1, u) * (fightCount - 1);
        const i = Math.floor(pos);
        const f = pos - i;
        const a = env.img(`fight${i}`);
        const b = env.img(`fight${Math.min(fightCount - 1, i + 1)}`);
        if (a) drawCam(env.ctx, a, env.view, cam, { alpha: reveal });
        if (b && f > 0) drawCam(env.ctx, b, env.view, cam, { alpha: reveal * f });
      },
    });
  }

  const lastRoom = (env: Env) => (fightCount > 0 ? env.img(`fight${fightCount - 1}`) : null) ?? env.img("kalari");
  segments.push(
    { name: "pass-below", weight: 8, draw: dissolve(lastRoom, KALARI_PUSH, C(0.49, 0.72, 1.3), "below", C(0.5, 0.3, 1.18), BELOW_REST) },
    { name: "below", weight: 5, draw: drift("below", BELOW_REST, BELOW_LOW) },
    { name: "to-floor", weight: 7, draw: dissolve("below", BELOW_LOW, C(0.5, 0.66, 1.18), "floor", C(0.5, 0.4, 1.12), FLOOR_REST) },
    {
      name: "floor",
      weight: 11,
      draw: (env, u) => {
        drift("floor", FLOOR_REST, C(0.5, 0.64, 1.12))(env, u);
        groundRise(env, smoothstep(0.1, 0.92, u));
      },
    },
  );
  return segments;
}

// ---------------------------------------------------------------------------
// Atmosphere layers
// ---------------------------------------------------------------------------

const CLOUDS = [
  { key: "cloudA", x: 0.22, y: 0.2, dx: -0.9, dy: -0.35, w: 0.95, depth: 1.2 },
  { key: "cloudB", x: 0.8, y: 0.48, dx: 0.95, dy: 0.05, w: 0.9, depth: 1 },
  { key: "cloudC", x: 0.4, y: 0.86, dx: -0.2, dy: 0.9, w: 1.05, depth: 0.85 },
];

/** Wisps sitting close to the lens that part and rush past as the camera drops. */
function drawClouds(env: Env, q: number) {
  if (q >= 1) return;
  const { ctx, view, dpr } = env;
  for (const c of CLOUDS) {
    const img = env.img(c.key);
    if (!img) continue;
    const t = Math.pow(q, 1.35) * c.depth;
    const w = view.w * c.w * (1 + 2.6 * t);
    const h = (img.height / img.width) * w;
    const cx = (c.x + c.dx * t) * view.w;
    const cy = (c.y + c.dy * t) * view.h;
    drawPlaced(ctx, img, { s: w / img.width, dx: cx - w / 2, dy: cy - h / 2 }, {
      alpha: 0.92 * (1 - smoothstep(0.45, 0.9, q)),
      blur: t * 6 * dpr,
    });
  }
}

type Mote = { x: number; y: number; z: number; r: number; speed: number; phase: number };

function makeMotes(count: number): Mote[] {
  // Deterministic so the dust never "jumps" between renders.
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: count }, () => ({
    x: rand(),
    y: rand(),
    z: 0.25 + rand() * 0.75,
    r: 0.6 + rand() * 1.8,
    speed: 0.2 + rand() * 0.6,
    phase: rand() * Math.PI * 2,
  }));
}

function makeSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 32;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0, "rgba(255,226,180,1)");
    grd.addColorStop(0.4, "rgba(255,200,140,0.45)");
    grd.addColorStop(1, "rgba(255,190,120,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 32, 32);
  }
  return c;
}

/** Warm dust hanging in the sunbeams, drifting and parallaxing with the camera. */
function drawDust(env: Env, motes: Mote[], sprite: HTMLCanvasElement, intensity: number, travel: number) {
  if (intensity <= 0) return;
  const { ctx, view, dpr, time } = env;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (const m of motes) {
    const x = ((m.x + Math.sin(time * m.speed * 0.4 + m.phase) * 0.012) % 1) * view.w;
    const yRaw = m.y - time * 0.006 * m.speed - travel * m.z * 0.9;
    const y = (((yRaw % 1) + 1) % 1) * view.h;
    const size = m.r * m.z * 6 * dpr;
    ctx.globalAlpha = intensity * (0.18 + 0.5 * m.z) * (0.6 + 0.4 * Math.sin(time * m.speed + m.phase));
    ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------

export function createTimeline(fightCount: number, moteCount: number) {
  const segments = buildSegments(fightCount);
  const total = segments.reduce((sum, s) => sum + s.weight, 0);
  const ranges = new Map<string, [number, number]>();
  let acc = 0;
  for (const s of segments) {
    ranges.set(s.name, [acc / total, (acc + s.weight) / total]);
    acc += s.weight;
  }
  const range = (name: string) => ranges.get(name) ?? [0, 0];
  const motes = makeMotes(moteCount);
  let sprite: HTMLCanvasElement | null = null;

  const cloudsEnd = range("land")[0] + (range("land")[1] - range("land")[0]) * 0.5;
  const dustStart = range("enter")[0];

  return {
    /** Relative length of the whole shot, used to size the pinned scroll. */
    weight: total,
    render(env: Env, progress: number) {
      const p = clamp01(progress);
      env.ctx.fillStyle = heroEarth;
      env.ctx.fillRect(0, 0, env.view.w, env.view.h);

      let start = 0;
      for (const s of segments) {
        const end = start + s.weight / total;
        if (p <= end || s === segments[segments.length - 1]) {
          s.draw(env, clamp01((p - start) / (end - start)));
          break;
        }
        start = end;
      }

      drawClouds(env, p / cloudsEnd);

      if (p > dustStart) {
        sprite ??= makeSprite();
        const fadeIn = smoothstep(dustStart, dustStart + 0.06, p);
        // Dust keeps hanging in the air as the ground rises; it only thins out.
        const fadeOut = 1 - 0.6 * smoothstep(0.95, 1, p);
        drawDust(env, motes, sprite, fadeIn * fadeOut, (p - dustStart) * 2.2);
      }
    },
  };
}
