/**
 * Brand + NAP (name / address / phone) data.
 *
 * These values are the DEFAULTS: the live copy is edited in the admin
 * (Settings → Academy details) and read through getContent(). This file seeds
 * the CMS on first run and is served as-is if the CMS is unavailable. The
 * helpers below take the site record as an argument so they work with either.
 *
 * CONTENT STATUS
 * --------------
 * Supplied by the academy      : brand name, address (onboarding sheet),
 *                                phone, hours, map link, founder's name.
 * NOT supplied (null below)    : WhatsApp number (not confirmed which line
 *                                takes WhatsApp), email, social handles.
 *                                A second line, +91 90723 30952, was also given.
 *
 * Nothing in the UI invents these. Every consumer degrades gracefully while a
 * value is `null`, and every structured-data builder omits the field entirely
 * so we never publish a fabricated LocalBusiness record. Fill a value in here
 * and it lights up across the whole site.
 */

export type PostalAddress = {
  street: string | null;
  locality: string;
  region: string;
  postalCode: string | null;
  countryCode: string;
};

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export type Site = {
  url: string;
  name: string;
  shortName: string;
  wordmark: string;
  tagline: string;
  description: string;
  locale: string;
  language: string;
  contact: {
    phone: string | null;
    whatsapp: string | null;
    email: string | null;
    address: PostalAddress;
    openingHours: { days: string; hours: string }[] | null;
    mapEmbedSrc: string | null;
    mapDirectionsUrl: string | null;
  };
  social: SocialLink[];
  founder: { name: string; fullName: string | null; role: string | null };
  foundedYear: number;
};

/** Deployment facts, not content: set by environment, never by the admin. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.choorakkodi.com"
).replace(/\/$/, "");
export const siteLocale = "en_IN";
export const siteLanguage = "en-IN";

export const site: Site = {
  url: siteUrl,
  name: "Choorakkodi Martial Arts Academy",
  shortName: "Choorakkodi",
  /** Used as the <title> suffix and in the footer mark. */
  wordmark: "Choorakkodi",
  tagline: "Kalarippayattu · Kozhikode, Kerala",
  description:
    "CMM Gurukkal's Choorakkodi Martial Arts Academy, Chelavoor, Kozhikode — Kalarippayattu and kalari marma chikitsa since 1960. Weekly classes, summer camp and intensive courses for ages 7 and above.",
  locale: siteLocale,
  language: siteLanguage,

  contact: {
    /** Display form, e.g. "+91 98470 00000". */
    phone: "+91 96057 30952",
    /** Digits only with country code, e.g. "919847000000". Powers wa.me links. */
    whatsapp: null,
    email: null,
    address: {
      street: "State Highway 29, Chelavoor",
      locality: "Kozhikode",
      region: "Kerala",
      postalCode: "673571",
      countryCode: "IN",
    },
    /** e.g. [{ days: "Mon – Sat", hours: "05:30 – 08:00, 17:00 – 20:00" }] */
    openingHours: [
      { days: "Office", hours: "8 am – 6 pm" },
      { days: "Classes · Mon – Sat", hours: "4.30 – 6 pm (sub-juniors) · 6.30 – 8.30 pm (juniors & seniors)" },
    ],
    /** Keyless Google Maps embed of the Shafi Dawa Khana Health Complex pin. */
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.5022412329895!2d75.84770987317818!3d11.297954249361357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba65c5efa491039%3A0xbb74150c7ed6770!2sShafi%20Dawa%20Khana%20Health%20Complex!5e0!3m2!1sen!2sin!4v1712987520019!5m2!1sen!2sin",
    mapDirectionsUrl:
      "https://maps.app.goo.gl/g4YMiFsSkgRbS4UT6",
  },

  /** Empty until real handles are supplied — the footer hides the block. */
  social: [],

  founder: {
    name: "Usthad C.M.M. Gurukkal",
    /** Full name, as supplied by the academy. */
    fullName: "Chottanikkara Mamu Moulavi Gurukkal",
    role: "Founder · Gurukkal",
  },

  /** Year the academy's story begins, per the supplied timeline. */
  foundedYear: 1960,
};

/** True once a WhatsApp number exists, so CTAs can switch from fallback links. */
export function hasWhatsApp(site: Site): boolean {
  return Boolean(site.contact.whatsapp);
}

/**
 * Builds a wa.me deep link. Falls back to the contact page while no number is
 * configured — we never point a call-to-action at an arbitrary number.
 */
export function whatsAppHref(site: Site, message?: string): string {
  const number = site.contact.whatsapp;
  if (!number) return "/contact";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${number}${text}`;
}

export function telHref(site: Site): string {
  const phone = site.contact.phone;
  if (!phone) return "/contact";
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

/** "Kozhikode, Kerala" — safe to print anywhere, built only from real values. */
export function formatLocality(site: Site): string {
  const { locality, region } = site.contact.address;
  return [locality, region].filter(Boolean).join(", ");
}

/** Full address lines, or null when the street address has not been supplied. */
export function addressLines(site: Site): string[] | null {
  const { street, locality, region, postalCode } = site.contact.address;
  if (!street) return null;
  return [street, [locality, region].join(", "), postalCode ?? ""].filter(
    (line) => line.length > 0,
  );
}
