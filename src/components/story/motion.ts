import type { GsapContextArgs } from "@/hooks/useGsap";

/**
 * The scroll language shared by every chapter, all scrubbed to the
 * scrollbar. Text highlighting is page-wide and lives in StoryExperience.
 */
export function animateChapterParts({ gsap, root }: Pick<GsapContextArgs, "gsap" | "root">) {
  const mark = root.querySelector<HTMLElement>("[data-mark]");

  if (mark) {
    const digits = mark.querySelectorAll<HTMLElement>("[data-digit]");
    const row = digits[0]?.parentElement;
    gsap.fromTo(
      digits,
      { yPercent: (i: number) => 45 + i * 22, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        ease: "none",
        stagger: 0.04,
        // Keyed to the digits' own line, not the padded mark, so they are
        // settled by the time the caption under them comes into view.
        scrollTrigger: { trigger: row ?? mark, start: "top 100%", end: "top 55%", scrub: 0.6 },
      },
    );

    // A later year rolls up from the one before it — 1961, 1962 … 2015 — as
    // the marker scrolls in.
    const counter = mark.querySelector<HTMLElement>("[data-count-from]");
    const from = Number(counter?.dataset.countFrom);
    const to = Number(counter?.dataset.countTo);
    if (counter && Number.isFinite(from) && Number.isFinite(to) && from !== to) {
      const width = String(to).length;
      const show = (year: number) => {
        const chars = String(Math.round(year)).padStart(width, "0");
        digits.forEach((digit, i) => {
          digit.textContent = chars[i] ?? "";
        });
      };
      const state = { year: from };
      gsap.to(state, {
        year: to,
        ease: "none",
        onUpdate: () => show(state.year),
        // Keyed to the number itself, not the padded mark above it, so the
        // count runs while the year is on screen and lands as it nears the middle.
        scrollTrigger: { trigger: counter, start: "top 95%", end: "center 40%", scrub: 0.4 },
      });
      show(from);
    }

    const disc = mark.querySelector("[data-disc]");
    if (disc) {
      gsap.fromTo(
        disc,
        { scale: 0 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: mark, start: "top 90%", end: "center 45%", scrub: 0.6 },
        },
      );
    }

    const kicker = mark.querySelector("[data-kicker]");
    if (kicker) {
      gsap.from(kicker, {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        scrollTrigger: { trigger: mark, start: "top 80%", toggleActions: "play none none reverse" },
      });
    }
  }

  root.querySelectorAll<SVGPathElement>("[data-trail-draw]").forEach((path) => {
    gsap.fromTo(
      path,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: path.closest("svg"), start: "top 85%", end: "bottom 35%", scrub: true },
      },
    );
  });

  const mm = gsap.matchMedia();
  mm.add("(min-width: 768px)", () => {
    root.querySelectorAll<HTMLElement>("[data-speed]").forEach((figure) => {
      const speed = Number(figure.dataset.speed) || 0;
      if (!speed) return;
      gsap.fromTo(
        figure,
        { y: () => window.innerWidth * 0.1 * speed },
        {
          y: () => -window.innerWidth * 0.1 * speed,
          ease: "none",
          scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
    });
  });
}

/**
 * Scroll-lit writing: every word starts dim and brightens in reading order as
 * its block travels up the viewport, scrubbed both ways.
 *
 * With `scoped`, only blocks whose nearest `[data-story-scope]` is `root` are
 * taken, so nested section shells don't animate the same words twice.
 */
export function animateScrubText({
  gsap,
  root,
  scoped = false,
}: Pick<GsapContextArgs, "gsap" | "root"> & { scoped?: boolean }) {
  root.querySelectorAll<HTMLElement>("[data-scrub-text]").forEach((block) => {
    if (scoped && block.closest("[data-story-scope]") !== root) return;
    const words = block.querySelectorAll("[data-word]");
    if (!words.length) return;
    // Set explicitly: a staggered fromTo only pre-renders its first word.
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1,
      ease: "none",
      stagger: 0.1,
      scrollTrigger: {
        trigger: block,
        start: "top 88%",
        // Never longer than the scroll left below the start, so text near the
        // foot of a short page still finishes lighting up.
        end: () => {
          const start = block.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.88;
          const room = document.documentElement.scrollHeight - window.innerHeight - start;
          const length = Math.max(block.offsetHeight, window.innerHeight * 0.4);
          return `+=${Math.max(1, Math.min(length, room))}`;
        },
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

/**
 * The chronicle's motion for an ordinary page section: scroll-lit words,
 * trails drawn along, prints drifting, and mega lines sliding in from
 * alternate sides.
 */
export function animateStorySection({ gsap, root }: Pick<GsapContextArgs, "gsap" | "root">) {
  animateScrubText({ gsap, root, scoped: true });
  animateChapterParts({ gsap, root });

  root.querySelectorAll<HTMLElement>("[data-mega]").forEach((line, i) => {
    if (line.closest("[data-story-scope]") !== root) return;
    gsap.fromTo(
      line,
      { xPercent: i % 2 === 0 ? -35 : 35 },
      {
        xPercent: 0,
        ease: "none",
        scrollTrigger: { trigger: line, start: "top bottom", end: "top 35%", scrub: true },
      },
    );
  });
}
