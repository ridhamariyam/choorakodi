# Content inventory — what the academy still needs to supply

The onboarding sheet, proposal, page architecture and brand book are in `docs/`. Their facts
are now on the site: founding (1960), the founder's full name, teachers and styles, the Shafi Dawa
Khana / Chikitsalayam / Kalari Sangam history, Dr. Saheer Ali, affiliations, championships and
appearances, the Covid pause, age bands (7+, all genders), levels, batch timings, programmes,
address, landmark, hours and phone. Nothing beyond those documents has been invented.

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
| `contact.whatsapp` | **missing** | Two numbers were given (96057 30952, 90723 30952) but not which takes WhatsApp. Every WhatsApp CTA routes to `/contact` until set. |
| `contact.email` | missing | Email row hidden. |
| `social` | empty | `sameAs` omitted from Organization schema. |

### Photography · `public/images/`

`media/kalari-archive-01…16` (from `docs/Kalari Old Photos.pdf`) are used in the homepage story.
Six training photos (`public/images/training/*.webp`, from `reference-image-addon/`) now fill the
Kalarippayattu page, About wide shot, Heritage "today" entry, Disciplines card and six gallery slots.
Still needed: founder portrait, current training, marma treatment, gallery, events, and the
captions/dates for the archive prints so they can be used on `/heritage` and `/about`.

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
- **Press coverage** — onboarding answer was blank.
- **Fees** — not supplied, or confirm "on enquiry only".
- **Marma consultations** — format and duration (booking and who conducts them now come from shafidawakhana.in).
- **Disciplines** — the academy is affiliated to the Taekwondo and Yoga associations of Kerala.
  Confirm whether Taekwondo and Yoga are taught, so the "Martial Arts" card can name them.
- **Self-defence programme** — length and batches.
- **FAQ topics from the sheet still unanswered** — how many years it takes to learn
  Kalarippayattu; how it compares with karate or kung fu (needs the academy's own answer).
- **Heritage archive captions** — date range and photographer for each print.

---

## 3. Records that are entirely placeholder

### Testimonials · `src/data/testimonials.ts` — 4 placeholder records

All four are flagged `isPlaceholder: true` and labelled in the UI.

- No `Review` or `AggregateRating` schema is emitted anywhere on the site.
- `/testimonials` is served `noindex` while every record is a placeholder.
- Collect on the record, with written permission to publish the name and photograph.
- Keep any healing testimonial strictly experiential — no diagnosis, cure or outcome claims.

**To go live:** replace the quotes and set `isPlaceholder: false`.

### Events · `src/data/events.ts` — 3 placeholder records

All flagged `isPlaceholder: true`.

- `Event` structured data is **not** emitted for placeholder records.
- Placeholder event pages are `noindex` and excluded from `sitemap.xml`.
- Cards and detail pages carry a "not a scheduled event" marker.

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
- Each article renders a visible "unreviewed draft" note.

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
