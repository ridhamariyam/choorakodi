import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";

import type { ImageSlot } from "@/data/assets";
import type { StoryChapter, StoryPhoto, SilhouetteKind } from "@/data/story";
import type { AcademyEvent } from "@/data/events";
import type { ArticleBlock, BlogCategory, BlogPost } from "@/data/blog";
import type { Testimonial } from "@/data/testimonials";
import type { GalleryItem } from "@/data/gallery";
import type { FaqItem } from "@/data/faq";
import { siteLanguage, siteLocale, siteUrl } from "@/data/site";
import type {
  Homepage,
  Media,
  SiteSetting,
  Event,
  Post,
  Testimonial as TestimonialDoc,
  Gallery as GalleryDoc,
} from "@/payload-types";

import { defaultContent, type Content } from "./defaults";
import { str, toCaption, toLines, toParagraphs } from "./text";

export type { Content } from "./defaults";

/**
 * The one way the site reads its content.
 *
 * Returns the live copy from the CMS, converted into exactly the shapes the
 * components were written against. Wrapped in React's cache(), so a page and
 * its layout share one read per request.
 *
 * Falls back to the built-in defaults (src/data) when the CMS is switched off
 * (no PAYLOAD_SECRET), has not been seeded yet, or cannot be reached — the
 * public site keeps working whatever state the admin is in.
 */
export const getContent = cache(async (): Promise<Content> => {
  if (!process.env.PAYLOAD_SECRET) return defaultContent;

  try {
    const payload = await getPayload({ config });
    const global = <S extends Parameters<typeof payload.findGlobal>[0]["slug"]>(slug: S) =>
      payload.findGlobal({ slug, depth: 1 });
    const all = <S extends Parameters<typeof payload.find>[0]["collection"]>(collection: S, sort?: string) =>
      payload.find({ collection, depth: 1, pagination: false, sort }).then((r) => r.docs);

    const [settings, home, shared, aboutPage, kalariPage, marmaPage, admissionsPage, heritagePage, contactPage, disciplinesPage, events, posts, testimonials, gallery] =
      await Promise.all([
        global("site-settings"),
        global("homepage"),
        global("shared-sections"),
        global("about-page"),
        global("kalarippayattu-page"),
        global("marma-page"),
        global("admissions-page"),
        global("heritage-page"),
        global("contact-page"),
        global("disciplines-page"),
        all("events", "date"),
        all("posts", "-publishedAt"),
        all("testimonials", "order"),
        all("gallery", "order"),
      ]);

    // An unseeded database has empty globals; serve the defaults until
    // `npm run seed` has filled it.
    if (!settings.name) return defaultContent;

    const d = defaultContent;
    const galleryItems = gallery.map(toGalleryItem);

    return {
      site: toSite(settings),
      navigation: {
        primary: (settings.primaryNav ?? []).map((n) => ({ label: n.label, href: n.href, meta: n.meta ?? undefined })),
        footer: (settings.footerNav ?? []).map((n) => ({ label: n.label, href: n.href })),
      },
      notFound: {
        heading: toLines(settings.notFound?.heading),
        sub: str(settings.notFound?.sub),
        body: str(settings.notFound?.body),
      },
      homeIntro: {
        eyebrow: str(shared.homeIntro?.eyebrow),
        heading: toLines(shared.homeIntro?.heading),
        body: toParagraphs(shared.homeIntro?.body),
        pending: str(shared.homeIntro?.pending),
        image: slot(shared.homeIntro?.image, "KALARI IMAGE"),
        secondaryImage: slot(shared.homeIntro?.secondaryImage, "TRAINING IMAGE"),
      },
      founder: {
        eyebrow: str(shared.founder?.eyebrow),
        name: str(shared.founder?.name, settings.founder.name),
        heading: toLines(shared.founder?.heading),
        intro: str(shared.founder?.intro),
        pending: str(shared.founder?.pending),
        image: slot(shared.founder?.image, "FOUNDER IMAGE"),
        facts: (shared.founder?.facts ?? []).map((f) => ({ label: f.label, value: f.value })),
      },
      pillars: {
        eyebrow: str(shared.pillars?.eyebrow),
        heading: toLines(shared.pillars?.heading),
        items: (shared.pillars?.items ?? []).map(indexed),
      },
      about: {
        ...header(aboutPage.about),
        sections: (aboutPage.about?.sections ?? []).map((s) => ({ title: s.title, body: str(s.body), pending: str(s.pending) })),
        portrait: slot(aboutPage.about?.portrait, "FOUNDER IMAGE"),
        archival: slot(aboutPage.about?.archival, "HISTORICAL IMAGE"),
        wide: slot(aboutPage.about?.wide, "KALARI IMAGE"),
        recognition: {
          title: str(aboutPage.about?.recognition?.title),
          items: toLines(aboutPage.about?.recognition?.items),
          pending: str(aboutPage.about?.recognition?.pending),
        },
      },
      kalarippayattu: (() => {
        const p = kalariPage.page;
        return {
          ...header(p),
          what: { title: str(p?.what?.title), body: toParagraphs(p?.what?.body) },
          style: { title: str(p?.style?.title), body: str(p?.style?.body), pending: str(p?.style?.pending) },
          stages: (p?.stages ?? []).map((s) => ({
            index: str(s.index),
            name: str(s.name),
            translation: str(s.translation),
            body: str(s.body),
          })),
          learn: { title: str(p?.learn?.title), items: toLines(p?.learn?.items) },
          who: { title: str(p?.who?.title), body: str(p?.who?.body), pending: str(p?.who?.pending) },
          schedule: {
            title: str(p?.schedule?.title),
            items: toLines(p?.schedule?.items),
            pending: str(p?.schedule?.pending),
          },
          fees: { title: str(p?.fees?.title), pending: str(p?.fees?.pending) },
          images: {
            hero: slot(p?.images?.hero, "TRAINING IMAGE"),
            stage: slot(p?.images?.stage, "TRAINING IMAGE"),
            wide: slot(p?.images?.wide, "TRAINING IMAGE"),
            detail: slot(p?.images?.detail, "WEAPONS IMAGE"),
          },
        };
      })(),
      marma: (() => {
        const p = marmaPage.page;
        return {
          ...header(p),
          what: { title: str(p?.what?.title), body: toParagraphs(p?.what?.body) },
          tradition: { title: str(p?.tradition?.title), body: toParagraphs(p?.tradition?.body) },
          points: {
            title: str(p?.points?.title),
            body: str(p?.points?.body),
            note: str(p?.points?.note),
            regions: (p?.points?.regions ?? []).map((r) => ({ id: r.region, label: r.label, blurb: str(r.blurb) })),
          },
          healing: { title: str(p?.healing?.title), body: toParagraphs(p?.healing?.body) },
          consultation: {
            title: str(p?.consultation?.title),
            body: str(p?.consultation?.body),
            pending: str(p?.consultation?.pending),
          },
          disclaimer: str(p?.disclaimer, d.marma.disclaimer),
          image: slot(p?.image, "MARMA IMAGE"),
        };
      })(),
      admissions: (() => {
        const p = admissionsPage.page;
        return {
          ...header(p),
          steps: (p?.steps ?? []).map(indexed),
          who: { title: str(p?.who?.title), body: str(p?.who?.body), pending: str(p?.who?.pending) },
          bring: { title: str(p?.bring?.title), items: toLines(p?.bring?.items) },
          scheduleTitle: str(p?.scheduleTitle),
          scheduleItems: toLines(p?.scheduleItems),
          schedulePending: str(p?.schedulePending),
          feesTitle: str(p?.feesTitle),
          feesPending: str(p?.feesPending),
        };
      })(),
      heritage: {
        ...header(heritagePage),
        method: str(heritagePage.method),
        entries: (heritagePage.entries ?? []).map((e) => ({
          id: e.key,
          index: str(e.index),
          year: str(e.year),
          title: e.title,
          caption: str(e.caption),
          pending: e.pending || undefined,
          image: slot(e.image, "HISTORICAL IMAGE"),
        })),
      },
      contact: header(contactPage),
      faq: {
        kalarippayattu: faq(kalariPage.faq),
        admissions: faq(admissionsPage.faq),
        marma: faq(marmaPage.faq),
      },
      timeline: (aboutPage.timeline ?? []).map((t) => ({
        year: t.year,
        title: t.title,
        lead: str(t.lead),
        pending: str(t.pending),
        image: slot(t.image, "HISTORICAL IMAGE"),
      })),
      disciplines: (disciplinesPage.disciplines ?? []).map((x) => ({
        slug: x.slug,
        index: str(x.index),
        title: x.title,
        subtitle: str(x.subtitle),
        eyebrow: str(x.eyebrow),
        summary: str(x.summary),
        pending: str(x.pending),
        highlights: toLines(x.highlights),
        image: slot(x.image, "TRAINING IMAGE"),
      })),
      story: toStory(home, d),
      events: events.map(toEvent),
      posts: posts.map(toPost),
      testimonials: testimonials.map(toTestimonial),
      gallery: galleryItems,
      galleryTeaser: galleryItems.filter((_, i) => gallery[i]?.onHome),
    };
  } catch (error) {
    console.error("[content] CMS unavailable — serving built-in content.", error);
    return defaultContent;
  }
});

/* ------------------------------------------------------------ helpers */

type ImageGroup = { image?: (number | null) | Media; alt?: string | null; label?: string | null } | null | undefined;

function media(value: (number | null) | Media | undefined): Media | null {
  return value && typeof value === "object" ? value : null;
}

function slot(group: ImageGroup, fallbackLabel: string): ImageSlot {
  const file = media(group?.image);
  return {
    src: file?.url ?? null,
    alt: group?.alt || file?.alt || "",
    label: group?.label || fallbackLabel,
    width: file?.width ?? undefined,
    height: file?.height ?? undefined,
  };
}

function header(p: { eyebrow?: string | null; heading?: string | null; standfirst?: string | null } | null | undefined) {
  return { eyebrow: str(p?.eyebrow), heading: toLines(p?.heading), standfirst: str(p?.standfirst) };
}

function indexed(item: { index?: string | null; title: string; body?: string | null }) {
  return { index: str(item.index), title: item.title, body: str(item.body) };
}

function faq(items: { question: string; answer: string; pending?: boolean | null }[] | null | undefined): FaqItem[] {
  return (items ?? []).map((q) => ({ question: q.question, answer: q.answer, pending: q.pending || undefined }));
}

/** Payload stores dates as full ISO timestamps; the site works in yyyy-mm-dd. */
function isoDay(value: string | null | undefined): string | undefined {
  return value ? value.slice(0, 10) : undefined;
}

function toSite(s: SiteSetting): Content["site"] {
  const c = s.contact;
  return {
    url: siteUrl,
    locale: siteLocale,
    language: siteLanguage,
    name: s.name,
    shortName: s.shortName,
    wordmark: s.wordmark,
    tagline: str(s.tagline),
    description: str(s.description),
    foundedYear: s.foundedYear,
    founder: { name: s.founder.name, fullName: s.founder.fullName ?? null, role: s.founder.role ?? null },
    contact: {
      phone: c?.phone || null,
      whatsapp: c?.whatsapp || null,
      email: c?.email || null,
      address: {
        street: c?.address?.street || null,
        locality: str(c?.address?.locality),
        region: str(c?.address?.region),
        postalCode: c?.address?.postalCode || null,
        countryCode: "IN",
      },
      openingHours: c?.openingHours?.length ? c.openingHours.map((h) => ({ days: h.days, hours: h.hours })) : null,
      mapEmbedSrc: c?.mapEmbedSrc || null,
      mapDirectionsUrl: c?.mapDirectionsUrl || null,
    },
    social: (s.social ?? []).map((l) => ({ label: l.label, handle: l.handle, href: l.href })),
  };
}

/* -------------------------------------------------------------- story */

type ChapterDoc = NonNullable<Homepage["chapters"]>[number];

function storyPhoto(p: NonNullable<ChapterDoc["photos"]>[number]): StoryPhoto | null {
  const file = media(p.image?.image);
  // A chapter print without an uploaded photo is skipped rather than drawn
  // as an empty frame.
  if (!file?.url) return null;
  return {
    src: file.url,
    alt: p.image?.alt || file.alt,
    width: file.width ?? 1600,
    height: file.height ?? 1200,
    x: p.x,
    y: p.y,
    w: p.w,
    rotate: p.rotate,
    speed: p.speed,
  };
}

function toChapter(c: ChapterDoc): StoryChapter {
  const s = c.silhouette;
  return {
    id: c.key,
    marker: c.marker,
    face: c.face,
    kicker: str(c.kicker),
    counter: c.counter,
    bg: str(c.bg, "#ffffff"),
    disc: str(c.disc, "#a8724b"),
    tone: c.tone,
    trail: c.trail,
    caption: toCaption(c.caption),
    photos: (c.photos ?? []).map(storyPhoto).filter((p): p is StoryPhoto => p !== null),
    silhouette:
      s?.kind && s.kind !== "none"
        ? {
            kind: s.kind as SilhouetteKind,
            x: s.x ?? 0,
            y: s.y ?? 0,
            w: s.w ?? 8,
            rotate: s.rotate ?? 0,
            spin: s.spin ?? undefined,
          }
        : undefined,
  };
}

function toStory(h: Homepage, d: Content): Content["story"] {
  const intro = h.intro;
  const m = h.mura;
  const p = h.programmes;
  return {
    intro: {
      year: intro.year,
      counter: intro.counter,
      bg: str(intro.bg, d.story.intro.bg),
      heading: intro.heading,
    },
    range: { start: intro.year, end: intro.end },
    chapters: (h.chapters ?? []).map(toChapter),
    mura: {
      bg: str(m?.bg, d.story.mura.bg),
      counter: str(m?.counter, intro.year),
      rows: (m?.rows ?? []).map((r) => ({ words: [r.first, r.second], direction: r.direction === "-1" ? -1 : 1 })),
      caption: toCaption(m?.caption),
    },
    laterChapters: (h.laterChapters ?? []).map(toChapter),
    affiliations: toLines(h.affiliations),
    programmes: {
      bg: str(p?.bg, d.story.programmes.bg),
      counter: str(p?.counter, intro.end),
      title: toLines(p?.title),
      note: str(p?.note),
      items: (p?.items ?? []).flatMap((item) => {
        const file = media(item.image?.image);
        if (!file?.url) return [];
        return [
          {
            kicker: str(item.kicker),
            title: item.title,
            detail: str(item.detail),
            href: item.href,
            image: {
              src: file.url,
              alt: item.image?.alt || file.alt,
              width: file.width ?? 1600,
              height: file.height ?? 1200,
              x: 0,
              y: 0,
              w: 0,
              rotate: 0,
              speed: 0,
            },
          },
        ];
      }),
    },
  };
}

/* -------------------------------------------------------- collections */

function toEvent(e: Event): AcademyEvent {
  return {
    slug: e.slug,
    title: e.title,
    date: isoDay(e.date)!,
    endDate: isoDay(e.endDate),
    time: e.time ?? undefined,
    location: e.location,
    summary: e.summary,
    description: toParagraphs(e.description),
    schedule: (e.schedule ?? []).map((s) => ({ time: str(s.time), label: s.label })),
    info: (e.info ?? []).map((i) => ({ label: i.label, value: i.value })),
    image: slot(e.image, "EVENT IMAGE"),
    gallery: (e.gallery ?? []).map((g) => slot(g.photo, "EVENT IMAGE")),
    isPlaceholder: Boolean(e.isPlaceholder),
  };
}

function toBlock(b: Post["body"][number]): ArticleBlock {
  switch (b.blockType) {
    case "p":
    case "h2":
    case "h3":
      return { type: b.blockType, text: b.text };
    case "quote":
      return { type: "quote", text: b.text, attribution: b.attribution ?? undefined };
    case "list":
      return { type: "list", items: toLines(b.items), ordered: Boolean(b.ordered) };
    case "image":
      return { type: "image", image: slot(b.image, "IMAGE"), caption: b.caption ?? undefined };
    case "cta":
      return { type: "cta", heading: b.heading, label: b.label, message: b.message };
  }
}

function toPost(p: Post): BlogPost {
  return {
    slug: p.slug,
    category: p.category as BlogCategory,
    title: p.title,
    excerpt: p.excerpt,
    author: p.author,
    publishedAt: isoDay(p.publishedAt)!,
    updatedAt: isoDay(p.revisedAt),
    readingMinutes: p.readingMinutes ?? 5,
    image: slot(p.image, "IMAGE"),
    featured: Boolean(p.featured),
    isDraft: Boolean(p.isDraft),
    body: p.body.map(toBlock),
  };
}

function toTestimonial(t: TestimonialDoc): Testimonial {
  return {
    id: String(t.id),
    quote: t.quote,
    name: t.name,
    meta: str(t.meta),
    story: t.story ?? undefined,
    image: slot(t.image, "PORTRAIT"),
    isPlaceholder: Boolean(t.isPlaceholder),
  };
}

function toGalleryItem(g: GalleryDoc): GalleryItem {
  return {
    id: String(g.id),
    category: g.category,
    caption: g.caption,
    year: g.year ?? undefined,
    ratio: g.ratio,
    image: slot(g.image, "IMAGE"),
  };
}
