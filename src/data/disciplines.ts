import { slot, type ImageSlot } from "./assets";

/**
 * The four disciplines named in the supplied site architecture. Nothing beyond
 * those four is listed — we do not invent offerings the academy has not stated.
 *
 * `summary` describes each art in general, culturally accurate terms.
 * `pending`  marks the specifics only the academy can confirm (syllabus detail,
 *            which arts sit under "Martial Arts", schedules, instructors).
 */
export type Discipline = {
  slug: string;
  index: string;
  title: string;
  /** Second line used in the oversized editorial rows. */
  subtitle: string;
  eyebrow: string;
  summary: string;
  /** Rendered through <PendingCopy /> with a discreet marker. */
  pending: string;
  highlights: string[];
  image: ImageSlot;
};

export const disciplines: Discipline[] = [
  {
    slug: "kalarippayattu",
    index: "01",
    title: "Kalarippayattu",
    subtitle: "The mother art",
    eyebrow: "Kerala · Traditional",
    summary:
      "Kerala's classical martial art, trained inside the kalari — the pit-floored hall that gives the practice its name. It moves through body conditioning, wooden weapons, edged weapons and finally the bare hand, in that order, because the body must be built before it is armed.",
    pending: "",
    highlights: [
      "Meythari · body conditioning",
      "Kolthari · wooden weapons",
      "Angathari · metal weapons",
      "Verumkai · the empty hand",
    ],
    image: slot("TRAINING IMAGE", "Two Choorakkodi students leap with sword and shield inside the kalari", {
      src: "/images/training/shield-leap.webp",
      brief: "public/images/training — wide, low-angle, inside the kalari pit",
    }),
  },
  {
    slug: "martial-arts",
    index: "02",
    title: "Martial Arts",
    subtitle: "Beyond the kalari",
    eyebrow: "Contemporary · Structured",
    summary:
      "Structured training with certified and experienced trainers develops physical fitness, flexibility, discipline and confidence. Academy activities include annual belt grading, district and state championship coaching, and participation in Kalarippayattu and yoga.",
    pending:
      "Confirm which additional martial arts are taught and the belt or grading system used.",
    highlights: ["Annual belt grading", "District and state championship coaching", "Kalarippayattu and yoga participation"],
    image: slot("TRAINING IMAGE", "Six Choorakkodi trainers stand with arms folded on the kalari floor", {
      src: "/images/training/trainers-lineup.webp",
      width: 1170,
      height: 772,
    }),
  },
  {
    slug: "self-defence",
    index: "03",
    title: "Self Defence",
    subtitle: "Practical, unarmed",
    eyebrow: "Applied · All ages",
    summary:
      "Self-defence training develops body control, awareness, defensive responses and confidence. Unarmed techniques form part of Verumkai, while structured practice encourages concentration, discipline and mental resilience.",
    pending:
      "Confirm dedicated self-defence programme length and batches.",
    highlights: ["Body control and awareness", "Unarmed defensive responses", "Confidence and mental resilience"],
    image: slot("TRAINING IMAGE", "One practitioner throws another across his shoulders, from the academy archive", {
      src: "/images/heritage/archive-throw.webp",
      width: 1081,
      height: 815,
    }),
  },
  {
    slug: "marma",
    index: "04",
    title: "Marma",
    subtitle: "Kalari healing",
    eyebrow: "Tradition · Wellness",
    summary:
      "The healing half of the tradition. In the classical texts the body is mapped by marma — vital points — and the same knowledge that informs the martial syllabus informs the hands-on therapeutic work carried out in the kalari.",
    pending:
      "Confirm which consultations and therapies are offered, by whom, and how sessions are booked.",
    highlights: [],
    image: slot("MARMA IMAGE", "Feet working oil into a patient's shoulders during kalari uzhichil", {
      src: "/images/training/uzhichil-detail.webp",
      width: 1000,
      height: 750,
    }),
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}
