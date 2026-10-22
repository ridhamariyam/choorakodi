/**
 * The homepage chronicle.
 *
 * Every fact below is taken from the academy's own onboarding answers
 * (docs/Choorakkodi Academy - Onboarding Questions), docs/CHOORAKKODI.pdf,
 * docs/Choorakodi_Martial_Arts_Academy_Profile.docx and the supplied proposal.
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
 * A print that is not one of the sixteen album scans: the academy's later
 * archive photographs and today's training, under public/images.
 */
function still(
  src: string,
  [width, height]: [number, number],
  alt: string,
  layout: Pick<StoryPhoto, "x" | "y" | "w" | "rotate" | "speed">,
): StoryPhoto {
  return { src, alt, width, height, ...layout };
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
  bg: "#e6d9c6",
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
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "In 1960, " }, { text: "Usthad C.M.M. Gurukkal", bold: true }, { text: " began teaching kalari" }],
      [{ text: "and offering kalari treatment from his home in " }, { text: "Chelavoor", bold: true }, { text: " —" }],
      [{ text: "the start of " }, { text: "Choorakkodi Kalari", bold: true }, { text: "." }],
    ],
    photos: [
      photo(1, "Two practitioners in a sword-and-shield exchange on the kalari floor", { x: 46, y: 0, w: 48, rotate: 4, speed: 0.35 }),
      photo(4, "A practitioner raises a round shield against an opponent's strike", { x: 4, y: 22, w: 48, rotate: -5, speed: 0.6 }),
    ],
    trail: "left",
  },
];

/** The four styles, sliding past each other in the kinetic interlude. */
export const mura = {
  bg: "#e6d9c6",
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
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "Beside the treatment centre, he established " }, { text: "Choorakkodi Kalari Sangam", bold: true }],
      [{ text: "as a dedicated centre for martial arts training," }],
      [{ text: "creating a place where students could learn and practise" }],
      [{ text: "the traditions passed down by their Gurus." }],
      [{ text: "It drew " }, { text: "enthusiasts from all over the world", bold: true }, { text: "." }],
    ],
    photos: [
      still("/images/heritage/archive-visitor.webp", [1112, 737], "A visitor is welcomed with a handshake at Choorakkodi Kalari, from the academy archive", { x: 0, y: 0, w: 0, rotate: 3, speed: 0.3 }),
    ],
    trail: "left",
  },
  {
    id: "healing",
    marker: "Year to verify",
    face: "bodoni",
    kicker: "Training and treatment",
    counter: "1960",
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "The kalari always had a second room." }],
      [{ text: "The treatment began as " }, { text: "Shafi Dawa Khana Ayurveda Chikitsalayam", bold: true }, { text: "," }],
      [{ text: "later " }, { text: "Choorakkodi Kalari Chikitsalayam", bold: true }, { text: " —" }],
      [{ text: "today an Ayurveda hospital at " }, { text: "SDK Health Complex", bold: true }, { text: ", his vision," }],
      [{ text: "run by his son, " }, { text: "Dr. Saheer Ali", bold: true }, { text: "." }],
    ],
    photos: [
      still("/images/academy/shafi-since-1960.webp", [1170, 1583], "The sign on the campus wall: CMM Gurukkal's Shafi, since 1960", { x: 0, y: 0, w: 0, rotate: -2, speed: 0.3 }),
    ],
    trail: "right",
  },
  {
    id: "passed-on",
    marker: "Year to verify",
    face: "shrikhand",
    kicker: "A tradition passed on",
    counter: "1960",
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "Students carried their training beyond the Kalari," }],
      [{ text: "sharing their knowledge and helping the tradition reach new generations." }],
      [{ text: "The academy's history records that " }, { text: "nearly fifty students", bold: true }],
      [{ text: "went on to establish their own academies." }],
    ],
    photos: [photo(14, "A senior watches as two students work a sword sequence", { x: 0, y: 0, w: 0, rotate: -3, speed: 0.3 })],
    trail: "left",
  },
  {
    id: "beyond",
    marker: "Year to verify",
    face: "syne",
    kicker: "Beyond Kerala",
    counter: "2015",
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "Under the mentorship of " }, { text: "Dr. Saheer Ali", bold: true }, { text: ", students won prizes at" }],
      [{ text: "National and State Kalari Championships", bold: true }, { text: " and competed at the " }, { text: "SAF Games", bold: true }, { text: "." }],
      [{ text: "A.M. Shamsuddeen", bold: true }, { text: " was chosen by the Director of " }, { text: "SIGARO", bold: true }, { text: ", France," }],
      [{ text: "one of eight performers from nearly 60 camps, and the troupe" }],
      [{ text: "performed in " }, { text: "Russia", bold: true }, { text: " and the " }, { text: "Gulf", bold: true }, { text: ". In 2015 the academy" }],
      [{ text: "appeared at the " }, { text: "National Games", bold: true }, { text: "." }],
    ],
    photos: [
      still("/images/heritage/archive-rope-leap.webp", [1053, 880], "A practitioner swings from a rope and flies feet-first over a crouching partner, from the academy archive", { x: 0, y: 0, w: 0, rotate: 2, speed: 0.3 }),
    ],
    trail: "right",
  },
  {
    id: "today",
    marker: "2026",
    face: "unbounded",
    kicker: "The legacy continues",
    counter: "2026",
    bg: "#e6d9c6",
    disc: "#000000",
    tone: "light",
    caption: [
      [{ text: "After a pause during " }, { text: "Covid", bold: true }, { text: " in 2020," }],
      [{ text: "the floor is open again. Led by" }],
      [{ text: "President " }, { text: "Dr. Saheer Ali", bold: true }, { text: "," }],
      [{ text: "a new " }, { text: "sub-junior", bold: true }, { text: " batch begins" }],
      [{ text: "with " }, { text: "Meythari", bold: true }, { text: ", keeping " }, { text: "Usthad", bold: true }],
      [{ text: "C.M.M. Gurukkal's", bold: true }, { text: " legacy alive." }],
    ],
    photos: [
      still("/images/academy/team-with-leadership.webp", [1170, 909], "Choorakkodi trainers and students gathered with senior members of the academy in the kalari", { x: 50, y: 0, w: 44, rotate: 3, speed: 0.35 }),
      still("/images/training/trainers-lineup.webp", [1170, 772], "Six Choorakkodi trainers stand with arms folded on the kalari floor", { x: 4, y: 16, w: 46, rotate: -4, speed: 0.6 }),
      still("/images/training/aerial-sword-leap.webp", [922, 785], "Two students leap at each other with sword and shield above the kalari floor", { x: 46, y: 40, w: 40, rotate: 2, speed: 0.45 }),
    ],
    trail: "left",
  },
];

/**
 * What the floor builds, in the academy's own words (the profile's core
 * message), set as a second kinetic interlude after the present day.
 */
export const values = {
  bg: "#e6d9c6",
  counter: "2026",
  rows: [
    { words: ["FLEXIBILITY", "COURAGE"], direction: 1 },
    { words: ["STRENGTH", "DISCIPLINE"], direction: -1 },
    { words: ["FOCUS", "SELF-DEFENCE"], direction: 1 },
  ],
  caption: [
    [{ text: "What the floor builds —" }],
    [{ text: "in the academy's own words." }],
  ] satisfies CaptionLine[],
};

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
  bg: "#e6d9c6",
  counter: "2026",
  title: ["JOIN", "US"],
  note: "Train where it began · sub-juniors aged 6–14 · all genders",
  items: [
    {
      kicker: "Weekly",
      title: "Kalari classes",
      detail: "Mon – Sat · sub-juniors aged 6–14, 4.30 – 6 pm · juniors & seniors 6.30 – 8.30 pm",
      href: "/kalarippayattu",
      image: still("/images/training/rings-split.webp", [1170, 871], "A sub-junior holds a split between two trainers on the kalari rings", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
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
      image: still("/images/training/kalari-uzhichil.webp", [1600, 1067], "Kalari uzhichil: two practitioners massage a patient by foot on the kalari floor", { x: 0, y: 0, w: 0, rotate: 0, speed: 0 }),
    },
  ] satisfies Programme[],
};
