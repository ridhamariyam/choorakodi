# Choorakkodi Martial Arts Academy

Editorial website for Choorakkodi Martial Arts Academy, Kozhikode, Kerala.

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS 4 · GSAP 3 + ScrollTrigger + SplitText · Lenis · Lucide.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint       # eslint (flat config)
npm run typecheck  # tsc --noEmit
```

Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) before deploying — it drives canonical URLs, Open Graph and the sitemap.

---

## The homepage

`src/components/story/StoryExperience.tsx` composes the chronicle: the pinned sky hero
(`hero/SkyHero.tsx`), the dated and undated chapters, then the values, recognition, FAQ and programme sections.

See `docs/HANDOVER.md` for deployment, the CMS and what is still outstanding.

---

## Content is data, not markup

No page copy lives inside a component. Everything is typed and sits in `src/data/`:

| File | Holds |
| --- | --- |
| `site.ts` | Brand, NAP, WhatsApp number, social links, helpers (`whatsAppHref`, `telHref`) |
| `navigation.ts` | Menu and footer links |
| `pages.ts` | Page-level editorial copy for every route |
| `disciplines.ts` · `timeline.ts` · `testimonials.ts` · `gallery.ts` · `events.ts` · `blog.ts` · `faq.ts` | Collections |
| `assets.ts` | The `ImageSlot` type and the `slot()` helper |

This is the CMS boundary: swap these modules for fetches and nothing above them changes.

### Replacing placeholders

**Images.** Every image is an `ImageSlot` with `src: null`. Drop the real file into the matching
`public/images/<folder>/` and set `src`:

```diff
- image: slot("FOUNDER IMAGE", "Portrait of Usthad C.M.M. Gurukkal"),
+ image: { ...slot("FOUNDER IMAGE", "Portrait of Usthad C.M.M. Gurukkal"), src: "/images/founder/gurukkal.jpg" },
```

`<Figure />` switches from the composed placeholder to an optimised `next/image` automatically —
no component edits, no layout change. Alt text is already written for every slot.

**Contact details.** Fill in `site.contact` in `src/data/site.ts`. One edit updates the contact
page, the footer, the menu, every WhatsApp CTA and the `LocalBusiness` structured data at once.
While `whatsapp` is `null`, WhatsApp buttons stay fully styled and route to `/contact` rather than
dialling an invented number.

**Copy.** Text rendered through `<PendingCopy />` marks something only the academy can supply.
See `CONTENT_TODO.md` for the full inventory.

### Nothing is invented

The brief forbids fabricating history, credentials, reviews, dates or claims, so the code enforces
it rather than relying on discipline:

- `schema.ts` builders return `null` for placeholder events and draft articles, and omit every
  field with no real value — so no fake `Event`, `Article`, `Review` or address is ever published.
- Placeholder events and draft articles are served `noindex`, and are excluded from `sitemap.xml`.
- Placeholder records render a visible marker rather than passing as real content.

Flip `isPlaceholder` / `isDraft` to `false` and indexing, schema and sitemap entries switch on by
themselves.

---

## Architecture

```
src/
  app/                    routes, sitemap.ts, robots.ts, opengraph-image.tsx
  components/
    animation/            TextReveal, SplitHeading, ImageReveal, ParallaxImage, ScaleImage,
                          MaskedReveal, LineReveal, SectionReveal, HorizontalScroll,
                          MagneticButton, PageTransition
    blog/ contact/ content/ disciplines/ events/ gallery/ home/ layout/
    marma/ navigation/ testimonials/ ui/ brand/
  hooks/                  useGsap, useLenis, useScrollReveal, useReducedMotion
  lib/                    gsap (single registration point), seo, schema, utils
  data/                   typed content
```

**Animation.** No component registers GSAP plugins or writes its own cleanup. `useGsap` runs every
callback inside a scoped `gsap.context` and reverts it on unmount or dependency change, which is
what stops ScrollTriggers leaking across route transitions. Async work (after fonts load) goes
through `context.add()` so it is reverted too.

**Scrolling.** `SmoothScroll` owns one Lenis instance and drives it from GSAP's ticker, so Lenis
and ScrollTrigger share a single rAF loop. `lagSmoothing` is off so scrub animations stay 1:1.

**Reduced motion.** `prefers-reduced-motion: reduce` disables Lenis entirely, skips every
scrub/parallax/pin, and reduces reveals to their resting state. Content is never left hidden:
reveal targets render visible in the HTML and are hidden by GSAP inside a layout effect, before
first paint — so a JS failure degrades to a fully readable page.

**Navigation tone.** Sections carry `data-nav-theme`. The navbar watches a 1px band at its own
height with an IntersectionObserver and inverts as sections pass beneath it — no scroll listener,
no per-frame layout reads.

**Page transitions.** `TransitionLink` renders a real crawlable `<a>` and honours modified clicks;
a plain left click plays the green cover, pushes the route, resets scroll, refreshes ScrollTrigger
and uncovers. A safety timeout uncovers if a route ever stalls.

---

## Accessibility

Skip link · visible focus rings that invert on dark grounds · fullscreen menu and gallery lightbox
as focus-trapped dialogs with Escape, arrow keys and focus restoration · `inert` on hidden overlays
so their links leave the tab order · FAQ as a real `aria-expanded` / `aria-controls` disclosure ·
alt text on every image slot · `aria-live` announcements on route change and lightbox paging ·
one `<h1>` per page.

## Performance

`next/image` with explicit `sizes` on every slot · lazy loading except the hero ·
`optimizePackageImports` for Lucide · the map iframe is lazy · public routes prerender statically ·
the Lenis/GSAP loop is shared rather than doubled.
