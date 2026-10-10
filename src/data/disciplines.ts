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
    pending:
      "Confirm the Choorakkodi syllabus: which stage a beginner enters, how progression is assessed, and the weapons taught in-house.",
    highlights: [
      "Meythari · body conditioning",
      "Kolthari · wooden weapons",
      "Ankathari · edged weapons",
      "Verumkai · bare hand",
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
      "Structured martial training that sits alongside the traditional syllabus — conditioning, striking mechanics, controlled sparring and the habits of attention that carry from the floor into the rest of a life.",
    pending:
      "Name the specific arts and belt or grading systems offered here. This section lists nothing until the academy confirms them.",
    highlights: [],
    image: slot("TRAINING IMAGE", "Students training in formation at the academy", {
      brief: "public/images/training — group session, natural light",
    }),
  },
  {
    slug: "self-defence",
    index: "03",
    title: "Self Defence",
    subtitle: "Practical, unarmed",
    eyebrow: "Applied · All ages",
    summary:
      "Practical unarmed work drawn from the same principles — distance, timing, balance and the calm to read a situation early. Taught as a self-contained programme as well as inside the wider syllabus.",
    pending:
      "Confirm programme length, age bands and whether dedicated women's or children's batches run.",
    highlights: [],
    image: slot("TRAINING IMAGE", "A self-defence drill being practised in pairs", {
      brief: "public/images/training — paired drill, mid-movement",
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
    image: slot("MARMA IMAGE", "Hands-on marma therapy in the kalari treatment room", {
      brief: "public/images/training — close, warm, respectful framing",
    }),
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}
