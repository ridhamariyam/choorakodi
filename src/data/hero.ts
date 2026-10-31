const dir = "/images/hero/cinematic";

const heroImages = {
  sky: `${dir}/01-sky.webp`,
  roof: `${dir}/03-roof.webp`,
  kalari: `${dir}/07-kalari.webp`,
  below: `${dir}/14-below.webp`,
  floor: `${dir}/15-floor.webp`,
} as const;

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
