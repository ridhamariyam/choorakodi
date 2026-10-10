import { slot, type ImageSlot } from "./assets";

export const galleryCategories = [
  "Training",
  "Weapons",
  "Kalari",
  "Marma",
  "Heritage",
  "People",
] as const;

export type GalleryCategory = (typeof galleryCategories)[number];

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  caption: string;
  /** Optional year, printed as archival metadata. Only set when known. */
  year?: string;
  /** Drives the asymmetric composition — not a crop, just a layout hint. */
  ratio: "portrait" | "landscape" | "square" | "tall" | "wide";
  image: ImageSlot;
};

/**
 * Eighteen composed slots across the six supplied categories. Captions describe
 * the photograph that belongs in each slot; none of them assert a date or a
 * name that has not been supplied.
 */
export const gallery: GalleryItem[] = [
  { id: "g-01", category: "Kalari", ratio: "wide", caption: "The kalari, under the founder's portrait", image: slot("KALARI IMAGE", "Two students cross swords in a deep lunge beneath the founder's portrait in the kalari", { src: "/images/training/crossed-swords.webp" }) },
  { id: "g-02", category: "Training", ratio: "portrait", caption: "Meythari — the body conditioning sequences that open every syllabus", image: slot("TRAINING IMAGE", "A student holding a low conditioning stance") },
  { id: "g-03", category: "Weapons", ratio: "tall", caption: "Kolthari — the wooden weapons stage", image: slot("WEAPONS IMAGE", "Wooden practice weapons resting against the kalari wall") },
  { id: "g-04", category: "People", ratio: "portrait", caption: "Portrait of a practitioner", image: slot("PORTRAIT", "Portrait of a Choorakkodi practitioner") },
  { id: "g-05", category: "Heritage", ratio: "landscape", caption: "From the academy archive", image: slot("HISTORICAL IMAGE", "An archival photograph from the academy collection") },
  { id: "g-06", category: "Marma", ratio: "square", caption: "Hands-on work in the treatment room", image: slot("MARMA IMAGE", "A marma treatment in progress") },
  { id: "g-07", category: "Training", ratio: "wide", caption: "A demonstration by CKS Chelavoor students", image: slot("TRAINING IMAGE", "CKS Chelavoor students in a sword-and-shield demonstration before an audience", { src: "/images/training/cks-demonstration.webp" }) },
  { id: "g-08", category: "Weapons", ratio: "landscape", caption: "Ankathari — spear against sword and shield", image: slot("WEAPONS IMAGE", "A spear thrust met by a leaping sword-and-shield strike inside the kalari", { src: "/images/training/spear-and-sword.webp" }) },
  { id: "g-09", category: "Kalari", ratio: "square", caption: "The sunken floor and the lamp at its corner", image: slot("KALARI IMAGE", "The corner lamp of the kalari") },
  { id: "g-10", category: "People", ratio: "tall", caption: "The gurukkal watching the floor", image: slot("FOUNDER IMAGE", "The gurukkal observing a training session") },
  { id: "g-11", category: "Heritage", ratio: "portrait", caption: "From the academy archive", image: slot("HISTORICAL IMAGE", "An early portrait from the academy archive") },
  { id: "g-12", category: "Training", ratio: "landscape", caption: "Sword and shield, in the air and on the ground", image: slot("TRAINING IMAGE", "A student leaps over a partner holding a low sword-and-shield guard", { src: "/images/training/leap-over-guard.webp" }) },
  { id: "g-13", category: "Marma", ratio: "landscape", caption: "Preparation before a consultation", image: slot("MARMA IMAGE", "Oils and materials prepared for treatment") },
  { id: "g-14", category: "Kalari", ratio: "portrait", caption: "Entering the kalari", image: slot("KALARI IMAGE", "A student stepping down into the kalari") },
  { id: "g-15", category: "Weapons", ratio: "wide", caption: "The weapons wall", image: slot("WEAPONS IMAGE", "Spears, staffs and maces racked against the kalari wall", { src: "/images/training/weapons-rack.webp" }) },
  { id: "g-16", category: "People", ratio: "square", caption: "Between rounds", image: slot("PORTRAIT", "A student resting between training rounds") },
  { id: "g-17", category: "Heritage", ratio: "wide", caption: "From the academy archive", image: slot("HISTORICAL IMAGE", "A wide archival photograph of a past demonstration") },
  { id: "g-18", category: "Training", ratio: "landscape", caption: "Paired sword-and-shield work", image: slot("TRAINING IMAGE", "Two Choorakkodi students leap with sword and shield inside the kalari", { src: "/images/training/shield-leap.webp" }) },
];

/** Six-image editorial teaser used on the home page. */
export const galleryTeaser: GalleryItem[] = [
  gallery[0]!,
  gallery[2]!,
  gallery[6]!,
  gallery[9]!,
  gallery[13]!,
  gallery[14]!,
];
