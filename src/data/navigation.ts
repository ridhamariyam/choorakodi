export type NavItem = {
  label: string;
  href: string;
  /** Short line shown beside the label inside the fullscreen menu. */
  meta?: string;
};

/** The fullscreen menu, in narrative order: roof → kalari → lineage → join. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", meta: "Enter" },
  { label: "Kalarippayattu", href: "/kalarippayattu", meta: "The art" },
  { label: "Disciplines", href: "/disciplines", meta: "What we teach" },
  { label: "Marma", href: "/kalari-marma-healing", meta: "Healing" },
  { label: "Admissions", href: "/admissions", meta: "Begin" },
  { label: "Heritage", href: "/heritage", meta: "Archive" },
  { label: "Gallery", href: "/gallery", meta: "Images" },
  { label: "Testimonials", href: "/testimonials", meta: "Voices" },
  { label: "Events", href: "/events", meta: "Calendar" },
  { label: "Journal", href: "/blog", meta: "Writing" },
  { label: "Contact", href: "/contact", meta: "Visit" },
];

/**
 * The site read as one story: every page is a chapter, in the menu's
 * narrative order, and each ends by turning to the next (see NextChapter).
 * The last chapter turns back to the first.
 */
export type StoryStop = {
  href: string;
  /** Title of the chapter, as the page-turn sets it. */
  title: string;
  /** One line on what the chapter holds. Only facts the site already states. */
  teaser: string;
  image: { src: string; alt: string; width: number; height: number };
};

export const storyPath: StoryStop[] = [
  {
    href: "/",
    title: "Where it began",
    teaser: "1960: a home in Chelavoor, and the kalari Usthad C.M.M. Gurukkal built from it.",
    image: { src: "/images/heritage/founder-portrait-framed.webp", alt: "Framed portrait of Usthad C.M.M. Gurukkal above the kalari weapons", width: 1170, height: 1695 },
  },
  {
    href: "/kalarippayattu",
    title: "The art",
    teaser: "Four sections in one order — Meythari, Kolthari, Angathari, Verumkai — barefoot, on earth.",
    image: { src: "/images/training/crossed-lunge.webp", alt: "Two students cross sword and shield overhead in a deep lunge on the kalari floor", width: 1600, height: 1263 },
  },
  {
    href: "/disciplines",
    title: "What we teach",
    teaser: "Kalarippayattu, martial arts, self-defence and marma: four ways into one body of knowledge.",
    image: { src: "/images/training/trainers-lineup.webp", alt: "Six Choorakkodi trainers stand with arms folded on the kalari floor", width: 1170, height: 772 },
  },
  {
    href: "/kalari-marma-healing",
    title: "The second room",
    teaser: "Kalari treatment came first. Marma chikitsa is still offered on the same campus.",
    image: { src: "/images/training/kalari-uzhichil.webp", alt: "Kalari uzhichil: two practitioners massage a patient by foot on the kalari floor", width: 1600, height: 1067 },
  },
  {
    href: "/admissions",
    title: "Ready to begin?",
    teaser: "Sub-juniors aged 6–14 start with stretching, Poothara Vanakkam and Meythari. Everyone starts there.",
    image: { src: "/images/academy/sub-juniors.webp", alt: "Choorakkodi sub-juniors line up barefoot in the kalari", width: 1170, height: 986 },
  },
  {
    href: "/heritage",
    title: "The archive",
    teaser: "Prints from the kalari's albums, captioned only with what is known.",
    image: { src: "/images/heritage/archive-elders.webp", alt: "Three men seated in conversation, a black-and-white print from the academy archive", width: 1093, height: 792 },
  },
  {
    href: "/gallery",
    title: "Six decades on one floor",
    teaser: "The old album prints beside the kalari as it trains today.",
    image: { src: "/images/archive/kalari-archive-10.webp", alt: "From the academy album: a practitioner leaps with a shield raised against a partner's guard", width: 1512, height: 959 },
  },
  {
    href: "/testimonials",
    title: "Voices from the kalari",
    teaser: "Accounts from the people who train here, collected on the record.",
    image: { src: "/images/training/rings-split.webp", alt: "A sub-junior holds a split between two trainers on the kalari rings", width: 1170, height: 871 },
  },
  {
    href: "/events",
    title: "Events",
    teaser: "Demonstrations, gatherings and consultation days, announced here first.",
    image: { src: "/images/training/cks-demonstration.webp", alt: "CKS Chelavoor students in a sword-and-shield demonstration before an audience", width: 1536, height: 1024 },
  },
  {
    href: "/blog",
    title: "The Journal",
    teaser: "Notes on the art, the archive and the practice.",
    image: { src: "/images/training/weapons-rack.webp", alt: "Spears, staffs and maces racked against the kalari wall", width: 1448, height: 1086 },
  },
  {
    href: "/contact",
    title: "Come train with us",
    teaser: "State Highway 29, Chelavoor. Look for the Shafi Dawa Khana sign.",
    image: { src: "/images/academy/campus-signboard.webp", alt: "The Shafi Dawa Khana and Choorakkodi signboards above the campus roof", width: 1170, height: 1596 },
  },
];

/** Where a page sits in the story, and the chapter it turns to. */
export function storyChapter(href: string) {
  const index = Math.max(0, storyPath.findIndex((stop) => stop.href === href));
  return {
    number: index + 1,
    total: storyPath.length,
    current: storyPath[index]!,
    next: storyPath[(index + 1) % storyPath.length]!,
    nextNumber: ((index + 1) % storyPath.length) + 1,
  };
}

/** "Chapter 03 of 12", as the page header prints it. */
export function chapterLabel(href: string): string {
  const { number, total } = storyChapter(href);
  return `Chapter ${String(number).padStart(2, "0")} of ${total}`;
}

/** Footer "Explore" column — same destinations, compact order. */
export const footerNav: NavItem[] = [
  { label: "Kalarippayattu", href: "/kalarippayattu" },
  { label: "Disciplines", href: "/disciplines" },
  { label: "Marma", href: "/kalari-marma-healing" },
  { label: "Admissions", href: "/admissions" },
  { label: "Heritage", href: "/heritage" },
  { label: "Gallery", href: "/gallery" },
  { label: "Journal", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];
