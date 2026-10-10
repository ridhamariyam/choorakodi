export type NavItem = {
  label: string;
  href: string;
  /** Short line shown beside the label inside the fullscreen menu. */
  meta?: string;
};

/** The fullscreen menu, in narrative order: roof → kalari → lineage → join. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: "/", meta: "Enter" },
  { label: "Our Legacy", href: "/about", meta: "Since 1960" },
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

/** Footer "Explore" column — same destinations, compact order. */
export const footerNav: NavItem[] = [
  { label: "About", href: "/about" },
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
