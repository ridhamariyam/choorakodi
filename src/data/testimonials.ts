import { slot, type ImageSlot } from "./assets";

/**
 * No real testimonials have been supplied. Fabricating reviews would be both
 * dishonest and a structured-data violation, so every record below is flagged
 * `isPlaceholder` and:
 *   - renders with a visible placeholder marker,
 *   - is excluded from Review / AggregateRating schema entirely.
 *
 * Replace the quotes with real, attributable student words and flip the flag.
 */
export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  /** e.g. "Student · 4 years" */
  meta: string;
  image: ImageSlot;
  isPlaceholder: boolean;
  /** Longer story used on /testimonials. */
  story?: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t-01",
    quote:
      "[Placeholder quote] Reserve this space for a student's own words about what the kalari asked of them, and what it gave back.",
    name: "Student name pending",
    meta: "Placeholder · awaiting consent",
    image: slot("PORTRAIT", "Portrait of a Choorakkodi student"),
    isPlaceholder: true,
    story:
      "[Placeholder] A longer account belongs here — how they found the academy, what the first month felt like, and what changed. Collect this on record, with permission to publish the name and photograph.",
  },
  {
    id: "t-02",
    quote:
      "[Placeholder quote] A second voice, ideally from a longer-standing practitioner, to show progression over years rather than weeks.",
    name: "Student name pending",
    meta: "Placeholder · awaiting consent",
    image: slot("PORTRAIT", "Portrait of a long-standing practitioner"),
    isPlaceholder: true,
    story:
      "[Placeholder] Use this slot for a practitioner who has trained for several years, so the page shows depth of commitment rather than first impressions.",
  },
  {
    id: "t-03",
    quote:
      "[Placeholder quote] A third voice from the healing side of the practice, if a marma client is willing to be quoted.",
    name: "Name pending",
    meta: "Placeholder · awaiting consent",
    image: slot("PORTRAIT", "Portrait of a marma consultation client"),
    isPlaceholder: true,
    story:
      "[Placeholder] Keep any healing testimonial strictly experiential. Do not publish claims of diagnosis, cure or medical outcome.",
  },
  {
    id: "t-04",
    quote:
      "[Placeholder quote] A parent's perspective on a child's training would round out the set.",
    name: "Name pending",
    meta: "Placeholder · awaiting consent",
    image: slot("PORTRAIT", "Portrait of a parent of a young student"),
    isPlaceholder: true,
    story:
      "[Placeholder] Parents speak to discipline, focus and confidence. Record one on video if possible.",
  },
];

/** Only non-placeholder testimonials may ever reach structured data. */
export function publishableTestimonials(testimonials: Testimonial[]): Testimonial[] {
  return testimonials.filter((t) => !t.isPlaceholder);
}
