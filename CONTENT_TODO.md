# Content inventory — what the academy still needs to supply

The onboarding sheet, proposal, page architecture and `CHOORAKKODI.pdf` are in `docs/client/`; the brand book is in `docs/brand/`. Their facts
are now on the site: founding (1960), the founder's full name, teachers and styles, the Shafi Dawa
Khana / Chikitsalayam / Kalari Sangam history, Dr. Saheer Ali, affiliations, championships and
appearances, the Covid pause, sub-junior ages (6–14, all genders), levels, batch timings, programmes,
address, landmark, hours and phone. Nothing beyond those documents has been invented.

`CHOORAKKODI.pdf` supplies President Dr. Saheer Ali, General Secretary A. Moosa Haji,
founder/former president C. M. M. Gurukkal, the four training sections (Maithaari,
Koolthaari, Anghathaari, Verum Kaimura), Four Anghanghal, the children's stretching
and foundational practice routine, annual belt grading, championship coaching, and
Kalari Payattu and yoga participation. The latest document's ages 6–14 replace the
older minimum age of 7. To apply this content to an existing CMS, back up the database
and run `npm run import:choorakkodi`; a fresh `npm run seed` already uses these defaults.

Notes marked "pending" are hidden from visitors. To see them in place on a preview build, set
`NEXT_PUBLIC_SHOW_PENDING=1`.

Everything below is a real gap that the documents do not answer. Each item names the file to edit
(the live copy is edited in the admin at `/admin`; `src/data` holds the defaults).

---

## 1. Blocking — needed before launch

### Site domain · `NEXT_PUBLIC_SITE_URL`

The proposal names the intended domain as **choorakkodi.com** (with
`choorakkodikalari.com` redirected to it). The build falls back to
`https://www.choorakkodi.com`; confirm `www` vs apex and set it in the deployment environment.

### Contact details · Settings → Academy details

| Field | Status | Effect while empty |
| --- | --- | --- |
| `contact.whatsapp` | **missing** | Two numbers were given (96057 30952, 90723 30952) but not which takes WhatsApp. Every WhatsApp button is a call button until set. |
| `contact.email` | **confirm** | `choorakkodima@gmail.com` was found only in the CMS, in none of the supplied documents. It is now on the site. |
| `social` | empty | `sameAs` omitted from Organization schema. |

### Photography · `public/images/`

Still needed: a second marma treatment photograph (the Disciplines row uses a closer crop of the
uzhichil photograph on the Marma page), a larger original of `services/marmura.webp` (only 360 px
wide), current training, events, and clean rescans of the album prints: `kalari-archive-*` carry
heavy glare and a violet cast. Captions and dates for those prints are also needed.

---

## 2. Factual gaps — still shown as "pending"

- **Current trainers** — names. (About → Current leadership)
- **Years** — when Choorakkodi Kalari Sangam was established, the SIGARO France selection
  ("last October" on shafidawakhana.in), and the championship/SAF Games years and results.
- **Notable visitors** — shafidawakhana.in says Dr. Baratt (Emory University) and "former world
  Heavyweight Champion Mohammed Aley" sought performance and treatment at Choorakkodi Kalari.
  Not used yet: confirm the names and spelling before publishing.
- **Dr. Saheer Ali's title at SDK** — onboarding sheet says "Chairman"; shafidawakhana.in says
  "Managing Director and Chief Physician" / "Managing Partner". The site uses the latter.
  His separate role as President of Choorakkodi Kalari is supplied by `CHOORAKKODI.pdf`.
- **Press coverage** — onboarding answer was blank.
- **Fees** — not supplied, or confirm "on enquiry only".
- **Marma consultations** — format and duration (booking and who conducts them now come from shafidawakhana.in).
- **Disciplines** — Kalari Payattu and yoga participation and annual belt grading are confirmed.
  Confirm additional martial arts, whether dedicated yoga classes are offered, and the grading system.
- **Self-defence programme** — length and batches.
- **FAQ topics from the sheet still unanswered** — how many years it takes to learn
  Kalarippayattu; how it compares with karate or kung fu (needs the academy's own answer).

---

## 3. Records that are entirely placeholder

### Testimonials · `src/data/testimonials.ts` — 4 placeholder records

All four are flagged `isPlaceholder: true`, so visitors never see them. `/testimonials` shows a
short holding line and is left out of the menu until a real record exists.

- No `Review` or `AggregateRating` schema is emitted anywhere on the site.
- `/testimonials` is served `noindex` while every record is a placeholder.
- Collect on the record, with written permission to publish the name and photograph.
- Keep any healing testimonial strictly experiential — no diagnosis, cure or outcome claims.

**To go live:** replace the quotes and set `isPlaceholder: false`.

### Events · `src/data/events.ts` — 3 placeholder records

All flagged `isPlaceholder: true`.

- `Event` structured data is **not** emitted for placeholder records.
- Placeholder event pages return 404 and are excluded from `sitemap.xml`.
- Visitors never see them: `/events` shows its empty state and is left out of the menu.

**To go live:** add a real event with `isPlaceholder: false`. Delete the placeholders and
`/events` shows its empty state, which is a designed state.

### Journal · `src/data/blog.ts` — 6 articles, all `isDraft: true`

These are genuine long-form articles (600–1,000+ words) on Kalarippayattu, marma, the Northern
Ballads, monsoon training and archive practice. They are written in general cultural terms and
make **no factual claim about Choorakkodi**, and the byline is "The Choorakkodi Journal" with no
invented author credentials.

They have not been reviewed by the academy, so:

- `Article` schema is **not** emitted.
- Every post and `/blog` is served `noindex` and excluded from `sitemap.xml`.
- `/blog` is left out of the menu until an article is approved; the drafts stay reachable by URL for review.

**To go live:** have the academy read and approve the text, then set `isDraft: false`.

---

## 4. Deliberately conservative — confirm before changing

- **No medical claims.** `/kalari-marma-healing` carries a disclaimer stating that marma therapy
  is a traditional practice, is not diagnosis or treatment, and is not a substitute for medical
  care. Legal or clinical review is advised before altering this wording.
- **"107 vital points"** is presented as the figure cited in the classical enumeration, not as a
  medical fact.
- **No claim of an unbroken lineage.** The journal notes that Kalarippayattu was suppressed in the
  colonial period and revived in the twentieth century. If the academy wishes to make a stronger
  continuity claim, it should supply the evidence for it.
- **`foundingDate: 1960`** in Organization schema matches the onboarding sheet.
- **"Free trial"** — the proposal mentions a free trial offer, but the academy's own answers only
  confirm that trial classes exist. The site says "trial class". Confirm before saying "free".
- **Spelling** — the site and logo use "Choorakkodi"; the profile document uses "Choorakodi". The
  second spelling is listed as an alternate name in structured data so searches for it still match.
