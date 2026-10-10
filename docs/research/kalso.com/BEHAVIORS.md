# Reference behaviours — kalso.com (Wayback 2021-10-26)

Reference: https://web.archive.org/web/20211026110104/https://www.kalso.com/
Captured with Playwright (Chrome extension unavailable). Screenshots: `docs/design-references/kalso.com/`.
Raw computed values: `computed-styles.json`.

Only the **layout language and interaction model** are reused. No Kalso copy, photographs,
fonts, Lottie files or SVG artwork are copied — all content comes from the Choorakkodi docs.

## Global

| Behaviour | Reference mechanism | Choorakkodi implementation |
| --- | --- | --- |
| Smooth scroll | luxy.js wrapper (`.smooth-wrapper` translated) | Existing Lenis instance (`SmoothScroll`) |
| Scroll-linked page colour | `body` background interpolates between era colours (e.g. `rgb(243,237,222)` → `rgb(203,187,182)` → `rgb(187,125,107)` → `rgb(133,57,38)` → `rgb(194,144,57)` …) | Each chapter declares `bg`; a scrubbed ScrollTrigger tweens the story wrapper colour between neighbours |
| Paper grain | `.overlay` cardboard PNG, `position:absolute`, full height, `opacity:.5`, `z-index:100` | Fixed SVG-noise layer, `mix-blend-mode:multiply`, pointer-events none |
| Fluid type | Every size is a vw fraction: 1vw = 14.4px @1440 (year 20vw, caption 2.5vw/3vw line, card title 22px) | Same vw ratios, clamped for mobile |
| Year counter | Fixed bottom-right `.timeline-holder`: start year (Neueworld 3vw) + odometer column of years; current year slides into a 1vw mask | `YearCounter`: fixed, start year + masked odometer driven by the active chapter |
| Custom cursor | 3 × `.cursor` 1vw dots, fixed, trailing the pointer | `CursorDot`, fine-pointer devices only |
| Fixed top-left CTA | logo + "Shop the collection" | Existing Navbar (wordmark + menu) retained for the 14 other routes |

## Per-section motifs (all scroll-scrubbed, Webflow IX2)

1. **Intro circles** — three concentric SVG discs (1584px, top −342px), scale 0.15 / 0.47 / 0.93 → grow on scroll.
2. **Per-digit year reveal** — `.year` holds one `h2` per digit; each digit translates from `~12vw` → `0` with a stagger as the section scrolls in. Each era uses a different display face (20vw, line-height 1).
3. **Small logo over year** — 8vw wide mark sits directly above the numeral.
4. **Line-mask captions** — Inconsolata 2.5vw / 3vw line-height, centred; each line in an `overflow:hidden` mask, `p` translates `3vw → 0`. Key phrases in bold (700).
5. **Framed archival photos** — cream paper frames baked into PNGs, rotated a few degrees, parallax at different speeds (`image-parallax-N`).
6. **Silhouettes** — large flat near-black (`#2a2627`-ish) shapes (maps, hammer, tree) with paper texture, some rotating on scroll (hammer `rotateZ(29deg)`).
7. **Dashed trail** — thin dashed curved line connecting sections, fades in (`opacity 0 → 1`).
8. **Kinetic type** — rows of mega type (`316.8px`, line-height 259px, −7.2px tracking) sliding horizontally ±20vw in opposite directions around a framed image.
9. **Closing product strip** — mega title slides in, white cards (`box-shadow: 1px 1px 43.2px rgba(0,0,0,.23)`, padding-bottom 28.8px) translate from `100vw` into view; card meta in mono 12px / 4px tracking; title mono 22px.

## Responsive
- Desktop 1440: compositions are absolute/vw — everything scales with width.
- Mobile 390: same vw system, photos enlarge (≈70–80vw), captions reflow to ≈5vw, circles remain.
