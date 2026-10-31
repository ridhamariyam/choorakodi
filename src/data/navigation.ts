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
  { label: "Gallery", href: "/gallery", meta: "Images" },
  { label: "Testimonials", href: "/testimonials", meta: "Voices" },
  { label: "Events", href: "/events", meta: "Calendar" },
  { label: "Journal", href: "/blog", meta: "Writing" },
  { label: "Contact", href: "/contact", meta: "Visit" },
];

/**
 * The site read as one story: every page is a chapter, in the menu's
 * narrative order, and each ends by turning to the next (see NextChapter).
 * The last chapter turns back to the first. Each stop's picture appears
 * nowhere else in the path, so the turn is never a repeat of the page.
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
    image: { src: "/images/hero/cinematic/02-landscape.webp", alt: "Palms and morning mist over Chelavoor, the kalari's roof among them", width: 1672, height: 941 },
  },
  {
    href: "/kalarippayattu",
    title: "The art",
    teaser: "Four sections in one order — Meythari, Kolthari, Angathari, Verumkai — barefoot, on earth.",
    image: { src: "/images/training/kalari-face-off.webp", alt: "Two practitioners square up with sword and shield in a shaft of sunlight", width: 1536, height: 1024 },
  },
  {
    href: "/disciplines",
    title: "What we teach",
    teaser: "Kalarippayattu, martial arts, self-defence and marma: four ways into one body of knowledge.",
    image: { src: "/images/training/kalari-leap-strike.webp", alt: "A practitioner leaps with sword and shield at a partner braced to meet the strike", width: 1536, height: 1024 },
  },
  {
    href: "/kalari-marma-healing",
    title: "The second room",
    teaser: "Kalari treatment came first. Marma chikitsa is still offered on the same campus.",
    image: { src: "/images/hero/cinematic/04-gable.webp", alt: "Sunlight on the tiled gable of the kalari roof", width: 1672, height: 941 },
  },
  {
    href: "/admissions",
    title: "Ready to begin?",
    teaser: "Sub-juniors aged 6–14 start with stretching, Poothara Vanakkam and Meythari. Everyone starts there.",
    image: { src: "/images/hero/cinematic/05-rafters.webp", alt: "Morning light under the wooden rafters of the empty kalari", width: 1536, height: 1024 },
  },
  {
    href: "/gallery",
    title: "Six decades on one floor",
    teaser: "The old album prints beside the kalari as it trains today.",
    image: { src: "/images/archive/kalari-archive-15.webp", alt: "From the academy album: two practitioners close with sword and stick", width: 1500, height: 1013 },
  },
  {
    href: "/contact",
    title: "Come train with us",
    teaser: "State Highway 29, Chelavoor. Look for the Shafi Dawa Khana sign.",
    image: { src: "/images/archive/kalari-archive-12.webp", alt: "From the academy album: a practitioner in the kalari's red vest works a short weapon", width: 1165, height: 927 },
  },
];

const ending = storyPath.length - 1;

/**
 * Where a page sits in the story, and the chapter it turns to. Pages that join
 * once they have real content (testimonials, events, the journal) stand outside
 * the numbered path and turn to the last chapter, Contact.
 */
export function storyChapter(href: string) {
  const index = storyPath.findIndex((stop) => stop.href === href);
  const nextIndex = index < 0 ? ending : (index + 1) % storyPath.length;
  return {
    number: index + 1,
    total: storyPath.length,
    next: storyPath[nextIndex]!,
    nextNumber: nextIndex + 1,
  };
}

/** "Chapter 03 of 12", as the page header prints it. */
export function chapterLabel(href: string): string | undefined {
  const { number, total } = storyChapter(href);
  return number > 0 ? `Chapter ${String(number).padStart(2, "0")} of ${total}` : undefined;
}

/** Footer "Explore" column — same destinations, compact order. */
export const footerNav: NavItem[] = [
  { label: "Kalarippayattu", href: "/kalarippayattu" },
  { label: "Disciplines", href: "/disciplines" },
  { label: "Marma", href: "/kalari-marma-healing" },
  { label: "Admissions", href: "/admissions" },
  { label: "Gallery", href: "/gallery" },
  { label: "Journal", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
];
