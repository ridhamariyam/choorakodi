# Homepage topology — Choorakkodi chronicle (Kalso layout language)

Fixed layers (z-order, top → bottom): Navbar (existing) · CursorDot · YearCounter · grain overlay.
Flow content lives in `<StoryExperience>` whose background colour is scrubbed between chapters.

| # | Chapter (component) | Marker | Ground | Interaction | Source (docs) |
| --- | --- | --- | --- | --- | --- |
| 0 | `IntroChapter` | 1960 (per-digit) | bone `#f3ede0` | circles scale on scroll, digits rise | Onboarding: founded 1960, founder |
| 1 | Chapter "home" | 1960 | taupe | parallax photos, trail, lamp silhouette | Started teaching + treatments at home as Shafi Dawa Khana Ayurveda Chikitsalayam |
| 2 | Chapter "gurus" | 50 | rose-taupe | parallax, staff silhouette | ~50 gurus, named teachers |
| 3 | `KineticMura` | THEKKAN / VADAKKAN / THULUNADAN / KADATHANADAN | kalari red | horizontal scrub rows around framed photo | four Mura learned |
| 4 | Chapter "chikitsa" | 107 | soil | parallax | Kalari Chikitsa + Ayurveda teachers; Choorakkodi Kalari Chikitsalayam |
| 5 | Chapter "sangam" | Sangam | deep earth | photo cluster, shield silhouette rotates | Choorakkodi Kalari Sangam founded as martial arts centre |
| 6 | Chapter "championships" | SAF | ochre | parallax, sword silhouette | National/State prizes, SAF Games, Dr. Saheer Ali |
| 7 | Chapter "2015" | 2015 | burnt ochre | parallax | National Games 2015, Russian tour, national seminars |
| 8 | Chapter "2020" | 2020 | wenge-rose | quiet, single photo | Temporary closure during Covid |
| 9 | Chapter "2026" | 2026 | genoa green (dark) | parallax, fish mark | Academy today, affiliations, ~50 alumni academies |
| 10 | `ProgrammeStrip` | "Begin training" | bone | mega title slides, cards enter from right | Programmes, timings, ages 7+, trial |

All chapters are server-rendered markup; motion is layered on in `useGsap` and is skipped
under `prefers-reduced-motion`.
