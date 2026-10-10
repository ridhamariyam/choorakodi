/**
 * The cinematic hero: a single camera descending from the sky into the
 * kalari. Every image here was supplied by the academy's design team
 * (public/hero-scroll) and optimised into public/images/hero/cinematic.
 *
 * Focal points are normalised image coordinates of the thing the camera is
 * travelling towards in that frame; `k` is how much of the frame's width the
 * NEXT shot occupies when it is first discovered inside this one.
 */

const dir = "/images/hero/cinematic";

export const heroImages = {
  sky: `${dir}/01-sky.webp`,
  landscape: `${dir}/02-landscape.webp`,
  roof: `${dir}/03-roof.webp`,
  gable: `${dir}/04-gable.webp`,
  opening: `${dir}/L2-opening.webp`,
  rafters: `${dir}/05-rafters.webp`,
  beam: `${dir}/L3-beam.webp`,
  upper: `${dir}/06-upper.webp`,
  kalari: `${dir}/07-kalari.webp`,
  below: `${dir}/14-below.webp`,
  floor: `${dir}/15-floor.webp`,
  cloudA: `${dir}/L1-cloud-a.webp`,
  cloudB: `${dir}/L1-cloud-b.webp`,
  cloudC: `${dir}/L1-cloud-c.webp`,
} as const;

export type HeroImageKey = keyof typeof heroImages;

/** Loaded first, before anything else on the page competes for bandwidth. */
export const heroEager: HeroImageKey[] = ["sky", "cloudA", "cloudB", "cloudC", "landscape", "roof"];

export const heroFocus = {
  /** The kalari roof as a speck through the clouds. */
  skyRoof: { x: 0.515, y: 0.53, k: 0.62 },
  /** The roof among the palms. */
  landscapeRoof: { x: 0.5, y: 0.52, k: 0.26 },
  /** The gable vent at the ridge, seen from directly above. */
  roofVent: { x: 0.49, y: 0.415 },
  /** Into the vent at roof level. */
  gableVent: { x: 0.495, y: 0.5 },
  /** Centre of the hole in the tile frame layer. */
  openingHole: { x: 0.54, y: 0.46 },
  /** Where the practitioners will stand in the establishing frame. */
  kalariFloor: { x: 0.49, y: 0.66 },
} as const;

/**
 * Fight frames (F01–F10), supplied later. When the list is empty the fight
 * slot collapses and the camera goes straight from the empty kalari to the
 * low shot beneath the practitioners.
 */
export const heroFightFrames: string[] = [];

/** Base fill behind the canvas before frames have loaded. */
export const heroEarth = "#1f1612";

/**
 * Sunlit earth sampled (and lifted) from the lit floor of the last frame.
 * The floor dissolves into this, and the first chapter of the chronicle is
 * set on it — so the hero never ends, it just becomes the page.
 */
export const heroGround = "#ffffff";

/**
 * Kalari mud. The floor rises as this earth first, and only lightens to
 * heroGround at the very end of the hero.
 */
export const heroMud = "#8a5a3b";
