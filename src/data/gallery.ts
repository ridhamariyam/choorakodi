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
 * The academy's own photographs, in the grid's six-slot rhythm (wide, two
 * narrow, then medium, wide, narrow). Captions describe what is visible;
 * none asserts a date or a name that has not been supplied.
 */
const img = (src: string, width: number, height: number) => ({ src, width, height });

export const gallery: GalleryItem[] = [
  { id: "g-01", category: "Kalari", ratio: "wide", caption: "The kalari, under the founder's portrait", image: slot("KALARI IMAGE", "Two students cross swords in a deep lunge beneath the founder's portrait in the kalari", { src: "/images/training/crossed-swords.webp" }) },
  { id: "g-02", category: "Heritage", ratio: "tall", caption: "Kolthari, from the archive — a staff locked overhead", image: slot("HISTORICAL IMAGE", "Two practitioners lock a long staff overhead, a black-and-white print", img("/images/heritage/archive-staff-lock.webp", 1170, 1947)) },
  { id: "g-03", category: "People", ratio: "portrait", caption: "The founder's portrait, framed in the kalari", image: slot("FOUNDER IMAGE", "Framed portrait of Usthad C.M.M. Gurukkal above the kalari weapons", img("/images/heritage/founder-portrait-framed.webp", 1170, 1695)) },
  { id: "g-04", category: "Training", ratio: "landscape", caption: "Flexibility on the rings", image: slot("TRAINING IMAGE", "A sub-junior holds a split between two trainers on the kalari rings", img("/images/training/rings-split.webp", 1170, 871)) },
  { id: "g-05", category: "Training", ratio: "wide", caption: "Sword and shield, both feet off the floor", image: slot("TRAINING IMAGE", "Two students leap at each other with sword and shield above the kalari floor", img("/images/training/aerial-sword-leap.webp", 922, 785)) },
  { id: "g-06", category: "Weapons", ratio: "square", caption: "Spear against sword and shield", image: slot("WEAPONS IMAGE", "A spear thrust met by a leaping sword-and-shield strike inside the kalari", { src: "/images/training/spear-and-sword.webp" }) },

  { id: "g-07", category: "People", ratio: "wide", caption: "The academy today — trainers, students and seniors", image: slot("ACADEMY IMAGE", "Choorakkodi trainers and students gathered with senior members of the academy in the kalari", img("/images/academy/team-with-leadership.webp", 1170, 909)) },
  { id: "g-08", category: "Heritage", ratio: "portrait", caption: "Verumkai, from the archive — the knife hand controlled", image: slot("HISTORICAL IMAGE", "A practitioner bends an attacker backwards and controls the knife hand, from the academy archive", img("/images/heritage/archive-knife-defence.webp", 1170, 1971)) },
  { id: "g-09", category: "Marma", ratio: "tall", caption: "The Vaidyasala at Shafi Dawa Khana", image: slot("MARMA IMAGE", "The Vaidyasala doors at Shafi Dawa Khana, garlanded with flowers, marked GMP certified", img("/images/academy/vaidyasala.webp", 1170, 2059)) },
  { id: "g-10", category: "Heritage", ratio: "landscape", caption: "From the archive — a throw across the shoulders", image: slot("HISTORICAL IMAGE", "One practitioner throws another across his shoulders, from the academy archive", img("/images/heritage/archive-throw.webp", 1081, 815)) },
  { id: "g-11", category: "Training", ratio: "landscape", caption: "A demonstration by CKS Chelavoor students", image: slot("TRAINING IMAGE", "CKS Chelavoor students in a sword-and-shield demonstration before an audience", { src: "/images/training/cks-demonstration.webp" }) },
  { id: "g-12", category: "Kalari", ratio: "square", caption: "A sword on the earth floor", image: slot("KALARI IMAGE", "A sword lying on the earth floor of the kalari", { src: "/images/training/sword-on-floor.webp" }) },

  { id: "g-13", category: "People", ratio: "wide", caption: "Sub-juniors, aged 6–14", image: slot("ACADEMY IMAGE", "Choorakkodi sub-juniors line up barefoot in the kalari", img("/images/academy/sub-juniors.webp", 1170, 986)) },
  { id: "g-14", category: "Heritage", ratio: "portrait", caption: "From the archive — a leap from the rope", image: slot("HISTORICAL IMAGE", "A practitioner swings from a rope, feet first, inside the old kalari", img("/images/heritage/archive-rope-leap-close.webp", 1170, 1659)) },
  { id: "g-15", category: "Weapons", ratio: "square", caption: "From the archive — short weapons, close in", image: slot("HISTORICAL IMAGE", "Two practitioners face each other with short weapons, from the academy archive", img("/images/heritage/archive-short-weapons.webp", 1170, 825)) },
  { id: "g-16", category: "Training", ratio: "landscape", caption: "Swords clash mid-leap", image: slot("TRAINING IMAGE", "Swords clash mid-leap as dust rises from the kalari floor", { src: "/images/training/kalari-sword-clash.webp" }) },
  { id: "g-17", category: "Marma", ratio: "wide", caption: "Kalari uzhichil — massage by foot", image: slot("MARMA IMAGE", "Kalari uzhichil: two practitioners massage a patient by foot on the kalari floor", { src: "/images/training/kalari-uzhichil.webp" }) },
  { id: "g-18", category: "Weapons", ratio: "landscape", caption: "From the archive — the long staff", image: slot("HISTORICAL IMAGE", "Two practitioners cross a long staff in a paired drill, from the academy archive", img("/images/heritage/archive-staff-drill.webp", 1170, 830)) },

  { id: "g-19", category: "People", ratio: "wide", caption: "Choorakkodi's trainers", image: slot("TRAINING IMAGE", "Six Choorakkodi trainers stand with arms folded on the kalari floor", img("/images/training/trainers-lineup.webp", 1170, 772)) },
  { id: "g-20", category: "Heritage", ratio: "landscape", caption: "A visitor at the kalari", image: slot("HISTORICAL IMAGE", "A visitor is welcomed with a handshake at Choorakkodi Kalari, from the academy archive", img("/images/heritage/archive-visitor.webp", 1112, 737)) },
  { id: "g-21", category: "Training", ratio: "portrait", caption: "Sword and shield, in the air and on the ground", image: slot("TRAINING IMAGE", "A student leaps over a partner holding a low sword-and-shield guard", { src: "/images/training/leap-over-guard.webp" }) },
  { id: "g-22", category: "Kalari", ratio: "portrait", caption: "CMM Gurukkal's Shafi, since 1960", image: slot("ACADEMY IMAGE", "The sign on the campus wall: CMM Gurukkal's Shafi, since 1960", img("/images/academy/shafi-since-1960.webp", 1170, 1583)) },
  { id: "g-23", category: "Weapons", ratio: "wide", caption: "The weapons wall", image: slot("WEAPONS IMAGE", "Spears, staffs and maces racked against the kalari wall", { src: "/images/training/weapons-rack.webp" }) },
  { id: "g-24", category: "Heritage", ratio: "square", caption: "Recognition — the Sports Kalaripayattu Association", image: slot("HISTORICAL IMAGE", "The Sports Kalaripayattu Association crest, framed at the academy", img("/images/heritage/association-certificate.webp", 1170, 1659)) },

  { id: "g-25", category: "Training", ratio: "wide", caption: "Sword and shield crossed overhead, in a deep lunge", image: slot("TRAINING IMAGE", "Two students cross sword and shield overhead in a deep lunge on the kalari floor", img("/images/training/crossed-lunge.webp", 1600, 1263)) },
  { id: "g-26", category: "Heritage", ratio: "tall", caption: "From the album — lifted across the back, blade in hand", image: slot("HISTORICAL IMAGE", "From the academy album: one practitioner lifts another across his back, a blade in hand", img("/images/archive/kalari-archive-03.webp", 1056, 1467)) },
  { id: "g-27", category: "People", ratio: "portrait", caption: "A ribbon cut on the Chelavoor campus", image: slot("ACADEMY IMAGE", "Guests cut a ribbon at a garlanded doorway on the Chelavoor campus", img("/images/academy/inauguration.webp", 1170, 1978)) },
  { id: "g-28", category: "Heritage", ratio: "landscape", caption: "From the album — a flying kick caught and turned", image: slot("HISTORICAL IMAGE", "From the academy album: a practitioner catches a partner in mid-air and turns him", img("/images/archive/kalari-archive-02.webp", 1475, 1027)) },
  { id: "g-29", category: "Weapons", ratio: "wide", caption: "From the album — a blade raised against a guard", image: slot("HISTORICAL IMAGE", "From the academy album: a practitioner swings a blade high as his partner raises a guard", img("/images/archive/kalari-archive-06.webp", 1358, 1046)) },
  { id: "g-30", category: "Heritage", ratio: "square", caption: "From the album — a close grapple", image: slot("HISTORICAL IMAGE", "From the academy album: one practitioner bends another forward in a close hold", img("/images/archive/kalari-archive-07.webp", 1482, 1046)) },

  { id: "g-31", category: "Weapons", ratio: "wide", caption: "From the album — a leap behind the shield", image: slot("HISTORICAL IMAGE", "From the academy album: a practitioner leaps with a shield raised against a partner's guard", img("/images/archive/kalari-archive-10.webp", 1512, 959)) },
  { id: "g-32", category: "Weapons", ratio: "square", caption: "From the album — short weapons, low and close", image: slot("HISTORICAL IMAGE", "From the academy album: two practitioners cross short weapons low to the floor", img("/images/archive/kalari-archive-08.webp", 1474, 1044)) },
  { id: "g-33", category: "Weapons", ratio: "portrait", caption: "From the album — a blade over the shoulder", image: slot("HISTORICAL IMAGE", "From the academy album: a practitioner brings a blade over his shoulder towards a partner", img("/images/archive/kalari-archive-11.webp", 1471, 1024)) },
  { id: "g-34", category: "Weapons", ratio: "landscape", caption: "From the album — two blades, crossed low", image: slot("HISTORICAL IMAGE", "From the academy album: two practitioners cross short blades low between them", img("/images/archive/kalari-archive-12.webp", 1165, 927)) },
  { id: "g-35", category: "Weapons", ratio: "wide", caption: "From the album — shield against sword", image: slot("HISTORICAL IMAGE", "From the academy album: a practitioner meets a sword cut with a raised shield", img("/images/archive/kalari-archive-13.webp", 1454, 1014)) },
  { id: "g-36", category: "Weapons", ratio: "square", caption: "From the album — a strike above the shield", image: slot("HISTORICAL IMAGE", "From the academy album: two practitioners close in with sword and shield, one striking from above", img("/images/archive/kalari-archive-16.webp", 1408, 1009)) },
];

/** Six-image editorial teaser used on the home page. */
export const galleryTeaser: GalleryItem[] = [
  gallery[0]!,
  gallery[1]!,
  gallery[6]!,
  gallery[9]!,
  gallery[12]!,
  gallery[22]!,
];
