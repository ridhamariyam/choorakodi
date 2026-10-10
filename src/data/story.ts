/**
 * The homepage chronicle.
 *
 * Every fact below is taken from the academy's own onboarding answers
 * (docs/Choorakkodi Academy - Onboarding Questions) and the supplied proposal.
 * Where the academy has not yet confirmed a year, the chapter's marker reads
 * "Year to verify" and it is set beside its photograph instead of under a
 * giant year (see hasYear) — no year is invented. The archive photographs are
 * undated, and are captioned as such.
 */

export type CaptionSegment = { text: string; bold?: boolean };
/** One visual line of a caption. Lines are revealed individually. */
export type CaptionLine = CaptionSegment[];

export type SilhouetteKind = "lamp" | "staff" | "shield" | "sword" | "fish";

export type StoryPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Horizontal position, in vw, of the frame's left edge (desktop). */
  x: number;
  /** Vertical offset, in vw, from the top of the chapter's media band. */
  y: number;
  /** Frame width in vw (desktop). Mobile widths are derived. */
  w: number;
  rotate: number;
  /** Parallax factor: 0 = scrolls with the page, 1 = strongly lagging. */
  speed: number;
};

export type StorySilhouette = {
  kind: SilhouetteKind;
  x: number;
  y: number;
  w: number;
  rotate: number;
  /** Extra rotation added over the chapter's scroll. */
  spin?: number;
};

export type StoryChapter = {
  id: string;
  /**
   * The giant marker: a year, or a word. Empty or "Year to
   * verify" when the year is not confirmed — see hasYear.
   */
  marker: string;
  /** Font token for the marker — each era gets its own face. */
  face: "bodoni" | "anton" | "shrikhand" | "archivo" | "unbounded" | "syne";
  /** Short label printed under the small mark, above the marker. */
  kicker: string;
  /** Year shown by the fixed counter while this chapter is active. */
  counter: string;
  bg: string;
  /** Colour of the disc behind the marker. */
  disc: string;
  tone: "light" | "dark";
  caption: CaptionLine[];
  photos: StoryPhoto[];
  silhouette?: StorySilhouette;
  /** Which way the dashed trail bends out of this chapter. */
  trail: "left" | "right";
};

const archive = (n: number) => `/images/archive/kalari-archive-${String(n).padStart(2, "0")}.webp`;

/** Pixel sizes of the processed archive prints (album sleeve cropped off), for next/image. */
const size: Record<number, [number, number]> = {
  1: [1457, 934], 2: [1475, 1027], 3: [1056, 1467], 4: [1457, 909],
  5: [1484, 949], 6: [1358, 1046], 7: [1482, 1046], 8: [1474, 1044],
  9: [1506, 1048], 10: [1512, 959], 11: [1471, 1024], 12: [1165, 927],
  13: [1454, 1014], 14: [1496, 1007], 15: [1500, 1013], 16: [1408, 1009],
};

function photo(
  n: number,
  alt: string,
  layout: Pick<StoryPhoto, "x" | "y" | "w" | "rotate" | "speed">,
): StoryPhoto {
  const [width, height] = size[n] ?? [1600, 1200];
  return { src: archive(n), alt, width, height, ...layout };
}

/**
 * Whether a chapter has a confirmed year (or word) to set as its giant
 * marker. Without one the chapter is laid out beside its photograph.
 */
export function hasYear(marker: string): boolean {
  const value = marker.trim();
  return value !== "" && !/to verify/i.test(value);
}

/**
 * Portrait of the founder, shown first under the 1960 chapter's text. Drop
 * the photograph into public/images/founder under this name (any of .jpg,
 * .jpeg, .png or .webp); until a file is there, nothing is rendered.
 */
export const founderPortrait = {
  basename: "usthad-cmm-gurukkal-portrait",
  alt: "Usthad C.M.M. Gurukkal, founder of Choorakkodi Kalari",
  name: "Usthad C.M.M. Gurukkal",
};

export const storyRange = { start: "1960", end: "2026" } as const;

export const intro = {
  year: "1960",
  counter: "1960",
  /** The hero ends on this ground; see heroGround in data/hero.ts. */
  bg: "#ffffff",
  /** The page's one heading — read by assistive tech; the hero shows only film. */
  heading: "CMM Gurukkal's Choorakkodi Martial Arts Academy — Kalarippayattu in Kozhikode since 1960",
};

export const chapters: StoryChapter[] = [
  {
    id: "home",
    marker: "1960",
    face: "bodoni",
    kicker: "Where it began",
    counter: "1960",
    bg: "#ffffff",
    disc: "#c4a487",
    tone: "light",
    caption: [
      [{ text: "Usthad C.M.M. Gurukkal", bold: true }, { text: " began teaching Kalaripayattu" }],
      [{ text: "from his home in " }, { text: "Chelavoor", bold: true }, { text: " —" }],
      [{ text: "the start of " }, { text: "Choorakkodi Kalari", bold: true }, { text: "." }],
    ],
    photos: [
      photo(1, "Two practitioners in a sword-and-shield exchange on the kalari floor", { x: 46, y: 0, w: 48, rotate: 4, speed: 0.35 }),
      photo(4, "A practitioner raises a round shield against an opponent's strike", { x: 4, y: 22, w: 48, rotate: -5, speed: 0.6 }),
    ],
    trail: "left",
  },
  {
    id: "journey",
    marker: "Year to verify",
    face: "anton",
    kicker: "A journey of learning",
    counter: "1960",
    bg: "#ffffff",
    disc: "#c4a487",
    tone: "light",
    caption: [
      [{ text: "Gurukkal travelled across " }, { text: "Kerala", bold: true }, { text: ", learning from its " }, { text: "Gurus", bold: true }],
      [{ text: "and four traditions: " }, { text: "Thekkan, Vadakkan, Thulunadan and Kadathanadan Mura", bold: true }, { text: "." }],
    ],
    photos: [photo(9, "Two practitioners cross long staffs in a paired drill", { x: 0, y: 0, w: 0, rotate: -3, speed: 0.3 })],
    trail: "right",
  },
];

/** The four styles, sliding past each other in the kinetic interlude. */
export const mura = {
  bg: "#ffffff",
  counter: "1960",
  rows: [
    { words: ["THEKKAN", "MURA"], direction: 1 },
    { words: ["VADAKKAN", "MURA"], direction: -1 },
    { words: ["THULUNADAN", "MURA"], direction: 1 },
    { words: ["KADATHANADAN", "MURA"], direction: -1 },
  ],
  caption: [
    [{ text: "Four styles of kalari —" }],
    [{ text: "the " }, { text: "Northern style", bold: true }, { text: " at its heart." }],
  ] satisfies CaptionLine[],
};

export const laterChapters: StoryChapter[] = [
  {
    id: "sangham",
    marker: "Year to verify",
    face: "archivo",
    kicker: "The kalari takes shape",
    counter: "1960",
    bg: "#ffffff",
    disc: "#c4a487",
    tone: "light",
    caption: [
      [{ text: "As his work developed, " }, { text: "Choorakkodi Kalari Sangham", bold: true }],
      [{ text: "was established as a dedicated centre for martial arts training," }],
      [{ text: "creating a place where students could learn and practise" }],
      [{ text: "the traditions passed down by their Gurus." }],
    ],
    photos: [photo(11, "A sword strike met with a raised shield", { x: 0, y: 0, w: 0, rotate: 3, speed: 0.3 })],
    trail: "left",
  },
  {
    id: "passed-on",
    marker: "Year to verify",
    face: "shrikhand",
    kicker: "A tradition passed on",
    counter: "1960",
    bg: "#ffffff",
    disc: "#c4a487",
    tone: "light",
    caption: [
      [{ text: "Students carried their training beyond the Kalari," }],
      [{ text: "sharing their knowledge and helping the tradition reach new generations." }],
      [{ text: "The academy's history records that " }, { text: "nearly fifty students", bold: true }],
      [{ text: "went on to establish their own academies." }],
    ],
    photos: [photo(14, "A senior watches as two students work a sword sequence", { x: 0, y: 0, w: 0, rotate: -3, speed: 0.3 })],
    trail: "right",
  },
  {
    id: "today",
    marker: "2026",
    face: "unbounded",
    kicker: "The legacy continues",
    counter: "2026",
    bg: "#ffffff",
    disc: "#c4a487",
    tone: "light",
    caption: [
      [{ text: "Today, " }, { text: "Choorakkodi Kalari", bold: true }, { text: " continues" }],
      [{ text: "the tradition of Kalaripayattu" }],
      [{ text: "through training and the passing" }],
      [{ text: "of knowledge from one generation" }],
      [{ text: "to the next, keeping " }, { text: "Usthad", bold: true }],
      [{ text: "C.M.M. Gurukkal's", bold: true }, { text: " legacy alive." }],
    ],
    photos: [],
    trail: "right",
  },
];

/** Affiliations, as listed by the academy. */
export const affiliations = [
  "District Sports Council",
  "Kerala Kalarippayattu Association",
  "Taekwondo Association of Kerala",
  "Yoga Association of Kerala",
];

export type Programme = {
  kicker: string;
  title: string;
  detail: string;
  href: string;
  image: StoryPhoto;
};

export const programmes = {
  bg: "#ffffff",
  counter: "2026",
  title: ["JOIN", "US"],
  note: "Train where it began · from age 7 · all genders",
  items: [
    {
      kicker: "Weekly",
      title: "Kalari classes",
      detail: "Mon – Sat · sub-juniors 4.30 – 6 pm · juniors & seniors 6.30 – 8.30 pm",
      href: "/kalarippayattu",
      image: photo(1, "Sword and shield on the kalari floor", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
    },
    {
      kicker: "One month",
      title: "Summer camp",
      detail: "A special one-month class through the summer",
      href: "/admissions",
      image: photo(5, "A student mid-leap", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
    },
    {
      kicker: "Advanced",
      title: "Intensive course",
      detail: "Beginner, intermediate and advanced levels, with certification",
      href: "/disciplines",
      image: photo(15, "Two students in a close sword-and-stick exchange", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
    },
    {
      kicker: "Treatment",
      title: "Kalari marma chikitsa",
      detail: "Traditional kalari treatment, as part of care",
      href: "/kalari-marma-healing",
      image: photo(7, "Close grappling", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
    },
  ] satisfies Programme[],
};
