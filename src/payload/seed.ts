/**
 * First-run seed: copies the site's built-in content (src/data) and the
 * photos it uses into the CMS, so the admin opens on exactly what the site
 * shows today.
 *
 *   npm run seed
 *
 * It refuses to run once the CMS holds content, so it can never overwrite the
 * academy's edits. It does not create a login — the first visit to /admin
 * asks for one.
 */
import path from "node:path";
import fs from "node:fs";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

import { defaultContent as d } from "@/lib/content/defaults";
import { fromCaption, fromLines, fromParagraphs } from "@/lib/content/text";
import type { ImageSlot } from "@/data/assets";
import type { StoryChapter, StoryPhoto } from "@/data/story";
import type { ArticleBlock } from "@/data/blog";
import type { Post } from "@/payload-types";

const publicDir = path.resolve(process.cwd(), "public");

async function seed() {
  const payload = await getPayload({ config });

  const existing = await payload.findGlobal({ slug: "site-settings" });
  if (existing.name) {
    payload.logger.warn("The CMS already has content — nothing was changed. (Seeding only runs on an empty database.)");
    process.exit(0);
  }

  const upload = uploader(payload);
  const image = async (s: ImageSlot) => ({ image: s.src ? await upload(s.src, s.alt) : null, alt: s.alt, label: s.label });
  const photo = async (p: StoryPhoto) => ({
    image: { image: await upload(p.src, p.alt), alt: p.alt, label: "IMAGE" },
    x: p.x,
    y: p.y,
    w: p.w,
    rotate: p.rotate,
    speed: p.speed,
  });
  const chapter = async (c: StoryChapter) => ({
    key: c.id,
    marker: c.marker,
    kicker: c.kicker,
    counter: c.counter,
    face: c.face,
    tone: c.tone,
    trail: c.trail,
    bg: c.bg,
    disc: c.disc,
    caption: fromCaption(c.caption),
    photos: await Promise.all(c.photos.map(photo)),
    silhouette: c.silhouette ? { ...c.silhouette } : { kind: "none" as const },
  });
  const faq = (items: typeof d.faq.admissions) => items.map((q) => ({ ...q, pending: Boolean(q.pending) }));
  const header = (h: { eyebrow: string; heading: string[]; standfirst: string }) => ({
    eyebrow: h.eyebrow,
    heading: fromLines(h.heading),
    standfirst: h.standfirst,
  });
  const ctx = { disableRevalidate: true };

  /* ------------------------------------------------------------ globals */

  payload.logger.info("Seeding academy details…");
  const s = d.site;
  await payload.updateGlobal({
    slug: "site-settings",
    context: ctx,
    data: {
      name: s.name,
      shortName: s.shortName,
      wordmark: s.wordmark,
      tagline: s.tagline,
      description: s.description,
      foundedYear: s.foundedYear,
      founder: s.founder,
      contact: {
        ...s.contact,
        address: { ...s.contact.address },
        openingHours: s.contact.openingHours ?? [],
      },
      social: s.social,
      primaryNav: d.navigation.primary,
      footerNav: d.navigation.footer,
      notFound: { heading: fromLines(d.notFound.heading), sub: d.notFound.sub, body: d.notFound.body },
    },
  });

  payload.logger.info("Seeding the home page chronicle and its photos…");
  const st = d.story;
  await payload.updateGlobal({
    slug: "homepage",
    context: ctx,
    data: {
      intro: { heading: st.intro.heading, year: st.intro.year, end: st.range.end, counter: st.intro.counter, bg: st.intro.bg },
      chapters: await Promise.all(st.chapters.map(chapter)),
      mura: {
        bg: st.mura.bg,
        counter: st.mura.counter,
        rows: st.mura.rows.map((r) => ({ first: r.words[0], second: r.words[1], direction: r.direction === -1 ? ("-1" as const) : ("1" as const) })),
        caption: fromCaption(st.mura.caption),
      },
      laterChapters: await Promise.all(st.laterChapters.map(chapter)),
      affiliations: fromLines(st.affiliations),
      programmes: {
        bg: st.programmes.bg,
        counter: st.programmes.counter,
        title: fromLines(st.programmes.title),
        note: st.programmes.note,
        items: await Promise.all(
          st.programmes.items.map(async (p) => ({
            kicker: p.kicker,
            title: p.title,
            detail: p.detail,
            href: p.href,
            image: { image: await upload(p.image.src, p.image.alt), alt: p.image.alt, label: "IMAGE" },
          })),
        ),
      },
    },
  });

  payload.logger.info("Seeding pages…");
  await payload.updateGlobal({
    slug: "shared-sections",
    context: ctx,
    data: {
      homeIntro: {
        eyebrow: d.homeIntro.eyebrow,
        heading: fromLines(d.homeIntro.heading),
        body: fromParagraphs(d.homeIntro.body),
        pending: d.homeIntro.pending,
        image: await image(d.homeIntro.image),
        secondaryImage: await image(d.homeIntro.secondaryImage),
      },
      founder: {
        eyebrow: d.founder.eyebrow,
        name: d.founder.name,
        heading: fromLines(d.founder.heading),
        intro: d.founder.intro,
        pending: d.founder.pending,
        image: await image(d.founder.image),
        facts: d.founder.facts,
      },
      pillars: { eyebrow: d.pillars.eyebrow, heading: fromLines(d.pillars.heading), items: d.pillars.items },
    },
  });

  await payload.updateGlobal({
    slug: "about-page",
    context: ctx,
    data: {
      about: {
        ...header(d.about),
        sections: d.about.sections,
        portrait: await image(d.about.portrait),
        archival: await image(d.about.archival),
        wide: await image(d.about.wide),
        recognition: { ...d.about.recognition, items: fromLines(d.about.recognition.items) },
      },
      timeline: await Promise.all(
        d.timeline.map(async (t) => ({ year: t.year, title: t.title, lead: t.lead, pending: t.pending, image: await image(t.image) })),
      ),
    },
  });

  const k = d.kalarippayattu;
  await payload.updateGlobal({
    slug: "kalarippayattu-page",
    context: ctx,
    data: {
      page: {
        ...header(k),
        what: { title: k.what.title, body: fromParagraphs(k.what.body) },
        style: k.style,
        stages: k.stages,
        learn: { title: k.learn.title, items: fromLines(k.learn.items) },
        who: k.who,
        schedule: { ...k.schedule, items: fromLines(k.schedule.items) },
        fees: k.fees,
        images: {
          hero: await image(k.images.hero),
          stage: await image(k.images.stage),
          wide: await image(k.images.wide),
          detail: await image(k.images.detail),
        },
      },
      faq: faq(d.faq.kalarippayattu),
    },
  });

  const m = d.marma;
  await payload.updateGlobal({
    slug: "marma-page",
    context: ctx,
    data: {
      page: {
        ...header(m),
        what: { title: m.what.title, body: fromParagraphs(m.what.body) },
        tradition: { title: m.tradition.title, body: fromParagraphs(m.tradition.body) },
        points: {
          title: m.points.title,
          body: m.points.body,
          note: m.points.note,
          regions: m.points.regions.map((r) => ({
            region: r.id as "head" | "torso" | "back" | "arms" | "legs",
            label: r.label,
            blurb: r.blurb,
          })),
        },
        healing: { title: m.healing.title, body: fromParagraphs(m.healing.body) },
        consultation: m.consultation,
        disclaimer: m.disclaimer,
        image: await image(m.image),
      },
      faq: faq(d.faq.marma),
    },
  });

  const a = d.admissions;
  await payload.updateGlobal({
    slug: "admissions-page",
    context: ctx,
    data: {
      page: {
        ...header(a),
        steps: a.steps,
        who: a.who,
        bring: { title: a.bring.title, items: fromLines(a.bring.items) },
        scheduleTitle: a.scheduleTitle,
        scheduleItems: fromLines(a.scheduleItems),
        schedulePending: a.schedulePending,
        feesTitle: a.feesTitle,
        feesPending: a.feesPending,
      },
      faq: faq(d.faq.admissions),
    },
  });

  await payload.updateGlobal({
    slug: "heritage-page",
    context: ctx,
    data: {
      ...header(d.heritage),
      method: d.heritage.method,
      entries: await Promise.all(
        d.heritage.entries.map(async (e) => ({
          key: e.id,
          index: e.index,
          year: e.year,
          title: e.title,
          caption: e.caption,
          pending: e.pending ?? "",
          image: await image(e.image),
        })),
      ),
    },
  });

  await payload.updateGlobal({ slug: "contact-page", context: ctx, data: header(d.contact) });

  await payload.updateGlobal({
    slug: "disciplines-page",
    context: ctx,
    data: {
      disciplines: await Promise.all(
        d.disciplines.map(async (x) => ({
          slug: x.slug,
          index: x.index,
          title: x.title,
          subtitle: x.subtitle,
          eyebrow: x.eyebrow,
          summary: x.summary,
          pending: x.pending,
          highlights: fromLines(x.highlights),
          image: await image(x.image),
        })),
      ),
    },
  });

  /* -------------------------------------------------------- collections */

  payload.logger.info("Seeding events, journal, testimonials and gallery…");

  for (const e of d.events) {
    await payload.create({
      collection: "events",
      context: ctx,
      data: {
        title: e.title,
        slug: e.slug,
        isPlaceholder: e.isPlaceholder,
        date: e.date,
        endDate: e.endDate,
        time: e.time,
        location: e.location,
        summary: e.summary,
        description: fromParagraphs(e.description),
        image: await image(e.image),
        schedule: e.schedule,
        info: e.info,
        gallery: await Promise.all(e.gallery.map(async (g) => ({ photo: await image(g) }))),
      },
    });
  }

  const block = async (b: ArticleBlock): Promise<Post["body"][number]> => {
    switch (b.type) {
      case "p":
      case "h2":
      case "h3":
        return { blockType: b.type, text: b.text };
      case "quote":
        return { blockType: "quote", text: b.text, attribution: b.attribution };
      case "list":
        return { blockType: "list", items: fromLines(b.items), ordered: Boolean(b.ordered) };
      case "image":
        return { blockType: "image", image: await image(b.image), caption: b.caption };
      case "cta":
        return { blockType: "cta", heading: b.heading, label: b.label, message: b.message };
    }
  };

  for (const p of d.posts) {
    await payload.create({
      collection: "posts",
      context: ctx,
      data: {
        title: p.title,
        slug: p.slug,
        isDraft: p.isDraft,
        featured: Boolean(p.featured),
        category: p.category,
        excerpt: p.excerpt,
        author: p.author,
        publishedAt: p.publishedAt,
        revisedAt: p.updatedAt,
        readingMinutes: p.readingMinutes,
        image: await image(p.image),
        body: await Promise.all(p.body.map(block)),
      },
    });
  }

  for (const [i, t] of d.testimonials.entries()) {
    await payload.create({
      collection: "testimonials",
      context: ctx,
      data: {
        quote: t.quote,
        name: t.name,
        meta: t.meta,
        story: t.story,
        image: await image(t.image),
        isPlaceholder: t.isPlaceholder,
        order: i + 1,
      },
    });
  }

  const teaser = new Set(d.galleryTeaser.map((g) => g.id));
  for (const [i, g] of d.gallery.entries()) {
    await payload.create({
      collection: "gallery",
      context: ctx,
      data: {
        image: await image(g.image),
        caption: g.caption,
        category: g.category,
        ratio: g.ratio,
        year: g.year,
        onHome: teaser.has(g.id),
        order: i + 1,
      },
    });
  }

  payload.logger.info("Done. Open /admin to create the first login.");
  process.exit(0);
}

/**
 * Uploads a file from /public into the media library once, however many
 * places use it, and returns its id.
 */
function uploader(payload: Payload) {
  const cache = new Map<string, Promise<number>>();
  // SQLite takes one writer at a time: uploads queue rather than race.
  let queue: Promise<unknown> = Promise.resolve();
  return (src: string, alt: string): Promise<number> => {
    let pending = cache.get(src);
    if (!pending) {
      const filePath = path.join(publicDir, src);
      if (!fs.existsSync(filePath)) throw new Error(`Seed image missing: public${src}`);
      pending = queue.then(() =>
        payload
          .create({ collection: "media", data: { alt }, filePath, context: { disableRevalidate: true } })
          .then((doc) => doc.id),
      );
      queue = pending;
      cache.set(src, pending);
    }
    return pending;
  };
}

await seed();
