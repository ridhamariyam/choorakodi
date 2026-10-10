import { slot, type ImageSlot } from "./assets";

/**
 * No real events have been supplied.
 *
 * Every record below is `isPlaceholder: true`, which means:
 *   - the card renders a visible placeholder marker,
 *   - `Event` structured data is NOT emitted for it,
 *   - the detail page is served `noindex`.
 *
 * Add a real event with `isPlaceholder: false` and schema + indexing turn on
 * automatically. Delete the placeholders and /events shows its empty state.
 */
export type EventScheduleItem = { time: string; label: string };

export type AcademyEvent = {
  slug: string;
  title: string;
  /** ISO 8601 date (yyyy-mm-dd). */
  date: string;
  /** Optional ISO end date for multi-day events. */
  endDate?: string;
  /** Free-text time, e.g. "17:00 – 19:30". */
  time?: string;
  location: string;
  summary: string;
  description: string[];
  schedule: EventScheduleItem[];
  info: { label: string; value: string }[];
  image: ImageSlot;
  gallery: ImageSlot[];
  isPlaceholder: boolean;
};

export const events: AcademyEvent[] = [
  {
    slug: "kalarippayattu-demonstration",
    title: "Kalarippayattu Demonstration",
    date: "2026-10-12",
    time: "Time to be confirmed",
    location: "Kozhikode, Kerala",
    summary:
      "[Placeholder event] A public demonstration slot, held here so the events architecture, filters and detail template can be reviewed before real dates are published.",
    description: [
      "[Placeholder] This paragraph is a layout slot. Replace it with the real description once the academy confirms the event.",
      "Nothing on this page should be treated as a scheduled occasion. No date, venue or programme below has been confirmed by the academy.",
    ],
    schedule: [
      { time: "—", label: "Programme to be confirmed" },
      { time: "—", label: "Demonstration" },
      { time: "—", label: "Open floor and questions" },
    ],
    info: [
      { label: "Entry", value: "To be confirmed" },
      { label: "Audience", value: "To be confirmed" },
      { label: "Booking", value: "Message the academy on WhatsApp" },
    ],
    image: slot("EVENT IMAGE", "Kalarippayattu demonstration in progress"),
    gallery: [
      slot("EVENT IMAGE", "Demonstration — wide view of the floor"),
      slot("EVENT IMAGE", "Demonstration — weapons sequence"),
      slot("EVENT IMAGE", "Demonstration — audience view"),
    ],
    isPlaceholder: true,
  },
  {
    slug: "marma-consultation-day",
    title: "Marma Consultation Day",
    date: "2026-11-08",
    time: "Time to be confirmed",
    location: "Kozhikode, Kerala",
    summary:
      "[Placeholder event] A consultation-day slot, included so the listing shows more than one upcoming record during review.",
    description: [
      "[Placeholder] Replace with the real description. Keep any wording strictly experiential — no diagnostic or curative claims.",
    ],
    schedule: [{ time: "—", label: "Sessions by appointment" }],
    info: [
      { label: "Format", value: "To be confirmed" },
      { label: "Booking", value: "Message the academy on WhatsApp" },
    ],
    image: slot("EVENT IMAGE", "The marma consultation room prepared for the day"),
    gallery: [],
    isPlaceholder: true,
  },
  {
    slug: "annual-kalari-gathering",
    title: "Annual Kalari Gathering",
    date: "2025-12-20",
    time: "Time to be confirmed",
    location: "Kozhikode, Kerala",
    summary:
      "[Placeholder past event] Present here only so the Past filter and the archive state can be reviewed.",
    description: [
      "[Placeholder] Past events should carry a short retrospective and a small gallery once real material exists.",
    ],
    schedule: [],
    info: [{ label: "Status", value: "Placeholder record" }],
    image: slot("EVENT IMAGE", "A past gathering at the academy"),
    gallery: [
      slot("EVENT IMAGE", "Gathering — group photograph"),
      slot("EVENT IMAGE", "Gathering — demonstration"),
    ],
    isPlaceholder: true,
  },
];

/** Date-only comparison so an event stays "upcoming" for the whole of its day. */
function startOfToday(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function eventEnd(event: AcademyEvent): number {
  return Date.parse(`${event.endDate ?? event.date}T00:00:00Z`);
}

/* Helpers take the list as an argument: the live list comes from the CMS. */

export function upcomingEvents(events: AcademyEvent[]): AcademyEvent[] {
  const today = startOfToday();
  return events
    .filter((e) => eventEnd(e) >= today)
    .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
}

export function pastEvents(events: AcademyEvent[]): AcademyEvent[] {
  const today = startOfToday();
  return events
    .filter((e) => eventEnd(e) < today)
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export function getEvent(events: AcademyEvent[], slug: string): AcademyEvent | undefined {
  return events.find((e) => e.slug === slug);
}

export function relatedEvents(events: AcademyEvent[], slug: string, limit = 2): AcademyEvent[] {
  return events.filter((e) => e.slug !== slug).slice(0, limit);
}

export function formatEventDate(iso: string): { day: string; month: string; year: string } {
  const date = new Date(`${iso}T00:00:00Z`);
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: date.toLocaleString("en-GB", { month: "long", timeZone: "UTC" }).toUpperCase(),
    year: String(date.getUTCFullYear()),
  };
}
