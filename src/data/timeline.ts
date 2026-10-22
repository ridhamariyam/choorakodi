import { slot, type ImageSlot } from "./assets";

/**
 * Milestones from the academy's onboarding sheet (docs/). Where the sheet gives
 * an event but not its year, the entry is labelled by name and its `pending`
 * slot asks for the date. No dates, names, awards or events are fabricated.
 */
export type TimelineEntry = {
  year: string;
  title: string;
  /** Safe, non-factual framing copy. */
  lead: string;
  /** Facts only the academy can confirm. Rendered with a pending marker. */
  pending: string;
  image: ImageSlot;
};

export const timeline: TimelineEntry[] = [
  {
    year: "1960",
    title: "Foundation",
    lead: "Usthad C.M.M. Gurukkal begins teaching kalari and offering kalari treatment from his home, under the name Shafi Dawa Khana Ayurveda Chikitsalayam.",
    pending: "",
    image: slot("HISTORICAL IMAGE", "Archive print: a senior watches two students work a sword sequence", {
      src: "/images/archive/kalari-archive-14.webp",
      brief: "public/images/heritage — earliest archival print, grain intact",
    }),
  },
  {
    year: "Sangam",
    title: "Choorakkodi Kalari Sangam",
    lead: "The home clinic becomes Choorakkodi Kalari Chikitsalayam, and Usthad Gurukkal establishes Choorakkodi Kalari Sangam as a martial arts centre alongside it. It draws enthusiasts from all over the world.",
    pending: "Confirm the year Choorakkodi Kalari Sangam was established.",
    image: slot("HISTORICAL IMAGE", "Archive print: two practitioners cross long staffs in a paired drill", {
      src: "/images/archive/kalari-archive-09.webp",
      brief: "public/images/heritage — portrait or group photograph",
    }),
  },
  {
    year: "SAF",
    title: "Championships",
    lead: "Under the mentorship of Dr. Saheer Ali, Managing Director of SDK, students win prizes at National and State Kalari Championships and compete at the SAF Games.",
    pending: "Confirm the years and results to list here.",
    image: slot("HISTORICAL IMAGE", "CKS Chelavoor students in a sword-and-shield demonstration before an audience", {
      src: "/images/training/cks-demonstration.webp",
      brief: "public/images/heritage — competition or prize-giving",
    }),
  },
  {
    year: "France",
    title: "SIGARO",
    lead: "A.M. Shamsuddeen, a student of Usthad C.M.M. Gurukkal, is selected by the Director of SIGARO in France as one of eight performers chosen from nearly 60 camps. The troupe also performs in Russia and the Gulf countries.",
    pending: "Confirm the year of the SIGARO selection.",
    image: slot("HISTORICAL IMAGE", "A practitioner swings from a rope and flies feet-first over a crouching partner, from the academy archive", {
      src: "/images/heritage/archive-rope-leap.webp",
      width: 1053,
      height: 880,
      brief: "public/images/heritage — performance photograph",
    }),
  },
  {
    year: "2015",
    title: "National Games",
    lead: "The academy appears at the National Games 2015. A Russian tour and national seminars and programmes across Kerala follow the same years.",
    pending: "",
    image: slot("HISTORICAL IMAGE", "A CKS Chelavoor student leaps with sword and shield over a lunging partner", {
      src: "/images/training/kalari-academy-leap.webp",
      brief: "public/images/heritage — National Games or touring photograph",
    }),
  },
  {
    year: "2020",
    title: "A pause",
    lead: "Fewer students during Covid lead to a temporary closure of the academy.",
    pending: "",
    image: slot("HISTORICAL IMAGE", "Spears, staffs and maces resting against the kalari wall", {
      src: "/images/training/weapons-rack.webp",
      brief: "public/images/heritage — the empty floor",
    }),
  },
  {
    year: "2026",
    title: "The Next Chapter",
    lead: "66 years on, as CMM Gurukkal's Choorakkodi Martial Arts Academy in Chelavoor. Six generations of students; nearly 50 now run academies of their own. A new sub-junior batch begins with Meythari, and morning classes are planned next.",
    pending: "",
    image: slot("KALARI IMAGE", "Choorakkodi sub-juniors line up barefoot in the kalari", {
      src: "/images/academy/sub-juniors.webp",
      width: 1170,
      height: 986,
      brief: "public/images/heritage — contemporary interior, empty floor",
    }),
  },
];

/** Long-form variant used by the pinned timeline on /about. */
export const aboutTimeline: TimelineEntry[] = timeline;
