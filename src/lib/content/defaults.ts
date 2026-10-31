/**
 * The site's built-in content: everything in src/data, gathered into the one
 * shape the CMS also produces.
 *
 * It has two jobs. The seed script writes it into the CMS on first run, and
 * getContent() serves it whenever the CMS is unconfigured or unreachable, so
 * the public site never goes blank because of the admin.
 */
import { site, type Site } from "@/data/site";
import { primaryNav, footerNav, type NavItem } from "@/data/navigation";
import {
  homeIntro,
  founder,
  pillars,
  about,
  kalarippayattu,
  marma,
  admissions,
  contact,
  notFound,
  type StoryParagraph,
} from "@/data/pages";
import { kalarippayattuFaq, admissionsFaq, marmaFaq, type FaqItem } from "@/data/faq";
import { timeline, type TimelineEntry } from "@/data/timeline";
import { disciplines, type Discipline } from "@/data/disciplines";
import {
  intro,
  storyRange,
  chapters,
  mura,
  laterChapters,
  values,
  affiliations,
  programmes,
  type CaptionLine,
  type Programme,
  type StoryChapter,
} from "@/data/story";
import { events, type AcademyEvent } from "@/data/events";
import { posts, type BlogPost } from "@/data/blog";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { gallery, galleryTeaser, type GalleryItem } from "@/data/gallery";
import type { ImageSlot } from "@/data/assets";

type Header = { eyebrow: string; heading: string[]; standfirst: string };
type Titled<T> = { title: string } & T;

export type Story = {
  intro: { year: string; counter: string; bg: string; heading: string };
  range: { start: string; end: string };
  chapters: StoryChapter[];
  mura: {
    bg: string;
    counter: string;
    rows: { words: [string, string]; direction: 1 | -1 }[];
    caption: CaptionLine[];
  };
  laterChapters: StoryChapter[];
  /** The closing interlude of the academy's values; built-in copy only. */
  values: Story["mura"];
  affiliations: string[];
  programmes: { bg: string; counter: string; title: string[]; note: string; items: Programme[] };
};

export type Content = {
  site: Site;
  navigation: { primary: NavItem[]; footer: NavItem[] };
  notFound: { heading: string[]; sub: string; body: string };
  homeIntro: {
    eyebrow: string;
    heading: string[];
    body: string[];
    pending: string;
    image: ImageSlot;
    secondaryImage: ImageSlot;
  };
  founder: {
    eyebrow: string;
    name: string;
    heading: string[];
    intro: string;
    highlights: string[];
    pending: string;
    image: ImageSlot;
    facts: { label: string; value: string }[];
  };
  pillars: { eyebrow: string; heading: string[]; items: { index: string; title: string; body: string }[] };
  about: Header & {
    sections: { title: string; body: string; pending: string }[];
    highlights: string[];
    portrait: ImageSlot;
    archival: ImageSlot;
    wide: ImageSlot;
    team: ImageSlot;
    history: StoryParagraph[];
    recognition: { title: string; items: string[]; pending: string };
  };
  kalarippayattu: Header & {
    what: Titled<{ body: string[] }>;
    style: Titled<{ body: string; pending: string }>;
    anghanghal: Story["mura"];
    stages: { index: string; name: string; translation: string; body: string }[];
    philosophy: Titled<{ intro: string; items: { title: string; body: string }[]; image: ImageSlot }>;
    learn: Titled<{ items: string[] }>;
    who: Titled<{ body: string; pending: string }>;
    schedule: Titled<{ items: string[]; pending: string }>;
    fees: Titled<{ pending: string }>;
    images: { hero: ImageSlot; stage: ImageSlot; wide: ImageSlot; detail: ImageSlot };
  };
  marma: Header & {
    what: Titled<{ body: string[] }>;
    tradition: Titled<{ body: string[] }>;
    points: Titled<{
      body: string;
      note: string;
      regions: { id: string; label: string; blurb: string }[];
    }>;
    healing: Titled<{ body: string[] }>;
    consultation: Titled<{ body: string; pending: string }>;
    disclaimer: string;
    image: ImageSlot;
    campus: ImageSlot;
  };
  admissions: Header & {
    steps: { index: string; title: string; body: string }[];
    who: Titled<{ body: string; pending: string }>;
    bring: Titled<{ items: string[] }>;
    journey: Titled<{ intro: string; items: { name: string; detail: string }[]; note: string; image: ImageSlot }>;
    recovery: Titled<{ body: string[] }>;
    scheduleTitle: string;
    scheduleItems: string[];
    schedulePending: string;
    feesTitle: string;
    feesPending: string;
  };
  contact: Header & { landmark: Titled<{ body: string; image: ImageSlot }> };
  faq: { kalarippayattu: FaqItem[]; admissions: FaqItem[]; marma: FaqItem[] };
  timeline: TimelineEntry[];
  disciplines: Discipline[];
  story: Story;
  events: AcademyEvent[];
  posts: BlogPost[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  galleryTeaser: GalleryItem[];
};

export const defaultContent: Content = {
  site,
  navigation: { primary: primaryNav, footer: footerNav },
  notFound,
  homeIntro,
  founder,
  pillars,
  about,
  kalarippayattu,
  marma,
  admissions,
  contact,
  faq: { kalarippayattu: kalarippayattuFaq, admissions: admissionsFaq, marma: marmaFaq },
  timeline,
  disciplines,
  story: {
    intro,
    range: storyRange,
    chapters,
    mura: {
      ...mura,
      rows: mura.rows.map((r) => ({ words: [r.words[0]!, r.words[1]!], direction: r.direction === -1 ? -1 : 1 })),
    },
    laterChapters,
    values: {
      ...values,
      rows: values.rows.map((r) => ({ words: [r.words[0]!, r.words[1]!], direction: r.direction === -1 ? -1 : 1 })),
    },
    affiliations,
    programmes,
  },
  events,
  posts,
  testimonials,
  gallery,
  galleryTeaser,
};
