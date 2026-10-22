/**
 * Import the academy's docs/CHOORAKKODI.pdf and
 * docs/Choorakodi_Martial_Arts_Academy_Profile.docx into an already seeded CMS.
 *
 *   npm run import:choorakkodi
 *
 * Updates only the content covered by those documents. Existing record IDs,
 * contact details, layout settings and other content are preserved; photos
 * are only added to empty frames and new records. Re-running updates the
 * same records rather than duplicating them.
 */
import path from "node:path";
import fs from "node:fs";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";

import { defaultContent as d } from "@/lib/content/defaults";
import { fromCaption, fromLines, fromParagraphs } from "@/lib/content/text";
import type { FaqItem } from "@/data/faq";
import type { ImageSlot } from "@/data/assets";
import type { StoryChapter } from "@/data/story";
import type { Homepage } from "@/payload-types";

type ChapterRecord = NonNullable<Homepage["chapters"]>[number];

type FaqRecord = {
  id?: string | null;
  question: string;
  answer: string;
  pending?: boolean | null;
};

function updateFaq(current: FaqRecord[] | null | undefined, changes: FaqItem[]): FaqRecord[] {
  const result = [...(current ?? [])];
  for (const change of changes) {
    const index = result.findIndex((item) => item.question === change.question);
    const updated = { ...change, pending: Boolean(change.pending) };
    if (index === -1) result.push(updated);
    else result[index] = { ...result[index], ...updated };
  }
  return result;
}

async function importContent() {
  const payload = await getPayload({ config });
  const settings = await payload.findGlobal({ slug: "site-settings", depth: 0 });
  if (!settings.name) {
    throw new Error("The CMS is empty. Run npm run seed to import all content first.");
  }

  const shared = await payload.findGlobal({ slug: "shared-sections", depth: 0 });
  const about = await payload.findGlobal({ slug: "about-page", depth: 0 });
  const kalari = await payload.findGlobal({ slug: "kalarippayattu-page", depth: 0 });
  const admissions = await payload.findGlobal({ slug: "admissions-page", depth: 0 });
  const disciplines = await payload.findGlobal({ slug: "disciplines-page", depth: 0 });
  const home = await payload.findGlobal({ slug: "homepage", depth: 0 });

  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      description: d.site.description,
      founder: { ...settings.founder, role: d.site.founder.role },
      // Our Legacy is told on the homepage for now (see next.config.ts).
      primaryNav: (settings.primaryNav ?? []).filter((item) => item.href !== "/about"),
      footerNav: (settings.footerNav ?? []).filter((item) => item.href !== "/about"),
    },
  });

  const introduction = fromParagraphs(d.homeIntro.body.slice(-1));
  const currentIntroduction = shared.homeIntro?.body ?? "";
  await payload.updateGlobal({
    slug: "shared-sections",
    data: {
      homeIntro: {
        body: currentIntroduction.includes(introduction)
          ? currentIntroduction
          : [currentIntroduction, introduction].filter(Boolean).join("\n\n"),
      },
      founder: {
        facts: (shared.founder?.facts ?? []).map((fact) =>
          fact.label === "Role" ? { ...fact, value: d.site.founder.role! } : fact,
        ),
      },
    },
  });

  // The About page's intro and sections, rewritten so no fact repeats
  // across the page; sections added in the admin are kept.
  const sections = [...(about.about?.sections ?? [])];
  for (const section of d.about.sections) {
    const index = sections.findIndex((current) => current.title === section.title);
    if (index === -1) sections.push(section);
    else sections[index] = { ...sections[index], ...section };
  }
  await payload.updateGlobal({ slug: "about-page", data: { about: { standfirst: d.about.standfirst, sections } } });

  const kalariQuestions = new Set([
    "Can children train?",
    "What happens in a children's training session?",
    "What are the Four Anghanghal?",
    "How does training support self-defence and personal development?",
    "Do you offer certification?",
  ]);
  await payload.updateGlobal({
    slug: "kalarippayattu-page",
    data: {
      page: {
        what: { body: fromParagraphs(d.kalarippayattu.what.body) },
        stages: d.kalarippayattu.stages.map((stage) => ({
          ...kalari.page?.stages?.find((current) => current.index === stage.index),
          ...stage,
        })),
        learn: { title: d.kalarippayattu.learn.title, items: fromLines(d.kalarippayattu.learn.items) },
        who: d.kalarippayattu.who,
        schedule: { items: fromLines(d.kalarippayattu.schedule.items) },
      },
      faq: updateFaq(kalari.faq, d.faq.kalarippayattu.filter((item) => kalariQuestions.has(item.question))),
    },
  });

  await payload.updateGlobal({
    slug: "admissions-page",
    data: {
      page: {
        who: d.admissions.who,
        scheduleItems: fromLines(d.admissions.scheduleItems),
      },
      faq: updateFaq(admissions.faq, d.faq.admissions.filter((item) => item.question === "What age can students join?")),
    },
  });

  await payload.updateGlobal({
    slug: "disciplines-page",
    data: {
      disciplines: (disciplines.disciplines ?? []).map((current) => {
        const updated = d.disciplines.find((item) => item.slug === current.slug);
        if (!updated || !["kalarippayattu", "martial-arts", "self-defence"].includes(current.slug)) return current;
        return {
          ...current,
          summary: updated.summary,
          pending: updated.pending,
          highlights: fromLines(updated.highlights),
        };
      }),
    },
  });

  await payload.updateGlobal({
    slug: "homepage",
    data: {
      programmes: {
        note: d.story.programmes.note,
        items: (home.programmes?.items ?? []).map((item) =>
          item.title === "Kalari classes"
            ? { ...item, detail: d.story.programmes.items.find((programme) => programme.title === item.title)!.detail }
            : item,
        ),
      },
    },
  });

  /* ------------------------------------------------ the academy profile */
  // From public/extra-images: the founder's photograph on the About page, the
  // new album prints in the gallery, and photographs for the Journal's empty
  // frames.

  const upload = mediaFor(payload);
  const image = async (s: ImageSlot) => ({ image: s.src ? await upload(s.src, s.alt) : null, alt: s.alt, label: s.label });

  // The marma page's history, cut back to what the homepage does not tell.
  const marmaGlobal = await payload.findGlobal({ slug: "marma-page", depth: 0 });
  await payload.updateGlobal({
    slug: "marma-page",
    data: { page: { ...marmaGlobal.page, tradition: { ...marmaGlobal.page?.tradition, body: fromParagraphs(d.marma.tradition.body) } } },
  });

  // The homepage chronicle tells the About page's story: every chapter's
  // caption comes from the defaults, and chapters the CMS lacks are added
  // with their photos, in the defaults' order. Photos chosen in the admin stay.
  const chapter = async (c: StoryChapter, current?: ChapterRecord) =>
    current
      ? { ...current, caption: fromCaption(c.caption) }
      : {
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
          photos: await Promise.all(
            c.photos.map(async (p) => ({
              image: { image: await upload(p.src, p.alt), alt: p.alt, label: "IMAGE" },
              x: p.x,
              y: p.y,
              w: p.w,
              rotate: p.rotate,
              speed: p.speed,
            })),
          ),
          silhouette: c.silhouette ? { ...c.silhouette } : { kind: "none" as const },
        };
  const chapters = (defaults: StoryChapter[], current: ChapterRecord[] | null | undefined) =>
    Promise.all(defaults.map((c) => chapter(c, current?.find((item) => item.key === c.id))));
  await payload.updateGlobal({
    slug: "homepage",
    data: {
      chapters: await chapters(d.story.chapters, home.chapters),
      laterChapters: await chapters(d.story.laterChapters, home.laterChapters),
    },
  });

  // The founder's photograph (public/extra-images/88.jpg) for the About page.
  await payload.updateGlobal({ slug: "about-page", data: { about: { portrait: await image(d.about.portrait) } } });

  const gallery = await payload.find({ collection: "gallery", pagination: false, depth: 0 });
  const captions = new Set(gallery.docs.map((g) => g.caption));
  let order = Math.max(0, ...gallery.docs.map((g) => g.order ?? 0));
  for (const g of d.gallery) {
    if (captions.has(g.caption)) continue;
    await payload.create({
      collection: "gallery",
      data: { image: await image(g.image), caption: g.caption, category: g.category, ratio: g.ratio, year: g.year, onHome: false, order: ++order },
    });
  }

  // Only frames that are still empty are filled; photos chosen in the admin stay.
  const posts = await payload.find({ collection: "posts", pagination: false, depth: 0 });
  for (const post of posts.docs) {
    const source = d.posts.find((p) => p.slug === post.slug);
    if (!source) continue;
    const body = await Promise.all(
      post.body.map(async (block, i) => {
        const original = source.body[i];
        if (block.blockType !== "image" || block.image?.image || original?.type !== "image") return block;
        return { ...block, image: await image(original.image), caption: original.caption };
      }),
    );
    await payload.update({
      collection: "posts",
      id: post.id,
      data: { body, ...(post.image?.image ? {} : { image: await image(source.image) }) },
    });
  }

  payload.logger.info("Imported CHOORAKKODI.pdf: leadership, training sections, Four Anghanghal, ages 6–14, activities and FAQs.");
  payload.logger.info("Imported the founder's photograph, new gallery prints and Journal photographs.");
  await payload.destroy();
}

/**
 * Returns the media id for a file under /public, reusing the library's copy
 * when one was already uploaded (by the seed or an earlier import).
 */
function mediaFor(payload: Payload) {
  const cache = new Map<string, Promise<number>>();
  // SQLite takes one writer at a time: uploads queue rather than race.
  let queue: Promise<unknown> = Promise.resolve();
  return (src: string, alt: string): Promise<number> => {
    let pending = cache.get(src);
    if (!pending) {
      const filePath = path.resolve(process.cwd(), "public", `.${src}`);
      if (!fs.existsSync(filePath)) throw new Error(`Image missing: public${src}`);
      const stem = path.basename(src, path.extname(src));
      pending = queue.then(async () => {
        const found = await payload.find({ collection: "media", where: { filename: { like: stem } }, limit: 1, depth: 0 });
        if (found.docs[0]) return found.docs[0].id;
        const doc = await payload.create({ collection: "media", data: { alt }, filePath });
        return doc.id;
      });
      queue = pending;
      cache.set(src, pending);
    }
    return pending;
  };
}

await importContent();
