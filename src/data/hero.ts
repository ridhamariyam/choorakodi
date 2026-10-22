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
export const heroGround = "#e6d9c6";

/**
 * Kalari mud. The floor rises as this earth first, and only lightens to
 * heroGround at the very end of the hero.
 */
export const heroMud = "#8a5a3b";

/* ------------------------------------------------------------- sky hero */

/**
 * The sky hero (SkyHero): scenes on old map paper, each a photograph that
 * surfaces out of the clouds beside a few engraved words, the clouds closing
 * between one scene and the next as the page scrolls.
 *
 * To change a scene's picture, replace `image` (any file under /public).
 * The current pictures stand in until the academy's own are supplied.
 */
export type SkyScene = {
  id: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Small line over the title, like a date in the margin. */
  kicker: string;
  title: string;
  line?: string;
  /** Which side the words sit on; the photograph takes the other. */
  side: "left" | "right" | "center";
};

/** Textures generated for the hero (public/images/hero/sky). */
export const skyTextures = {
  paper: "/images/hero/sky/paper.webp",
  mask: "/images/hero/sky/mask.webp",
  cloudBank: "/images/hero/sky/cloud-bank.webp",
  cloudBank2: "/images/hero/sky/cloud-bank-2.webp",
  cloudPuff: "/images/hero/sky/cloud-puff.webp",
} as const;

export const skyScenes: SkyScene[] = [
  {
    id: "clouds",
    image: { src: heroImages.sky, alt: "Morning cloud over the palms of Kozhikode", width: 1672, height: 941 },
    kicker: "Chelavoor · Kozhikode",
    title: "Since 1960",
    line: "Kalarippayattu, taught in one kalari",
    side: "center",
  },
  {
    id: "house",
    image: { src: heroImages.roof, alt: "The kalari's tiled roof among coconut palms, seen from above", width: 1672, height: 941 },
    kicker: "1960",
    title: "A home in Chelavoor",
    line: "Where Usthad C.M.M. Gurukkal began to teach",
    side: "right",
  },
  {
    id: "floor",
    image: { src: heroImages.kalari, alt: "The empty kalari, its earthen floor lit by low sun", width: 1672, height: 941 },
    kicker: "The kalari",
    title: "Earth underfoot",
    line: "Trained barefoot, in an order that has not changed",
    side: "left",
  },
  {
    id: "practitioners",
    image: { src: heroImages.below, alt: "Two practitioners face each other with sword and shield on the kalari floor", width: 1672, height: 941 },
    kicker: "Four traditions",
    title: "Face to face",
    line: "The Northern style at heart",
    side: "right",
  },
  {
    id: "practice",
    image: { src: heroImages.floor, alt: "Two practitioners mid-exchange, sword against shield, low over the cracked earth floor", width: 1672, height: 941 },
    kicker: "Today",
    title: "The practice goes on",
    line: "Sub-juniors to seniors, six days a week",
    side: "left",
  },
];
