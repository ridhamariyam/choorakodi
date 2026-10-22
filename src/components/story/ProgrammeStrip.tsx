"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Story } from "@/lib/content/defaults";
import { whatsAppHref, telHref } from "@/data/site";
import { useSite } from "@/components/content/ContentProvider";
import { useGsap } from "@/hooks/useGsap";
import { TransitionLink } from "@/components/animation/PageTransition";
import { condensedStyle, faceStyle, monoStyle } from "./fonts";
import { ScrollWords } from "./Caption";
import { TrialStamp } from "./TrialStamp";
import { animateChapterParts } from "./motion";

/**
 * The close: mega type slides in from both sides and the programme cards
 * arrive from the right, the way the reference ends on its collection. On
 * small screens the cards become a swipeable rail instead.
 */
export function ProgrammeStrip({ programmes }: { programmes: Story["programmes"] }) {
  const scope = useRef<HTMLElement>(null);
  const site = useSite();

  useGsap(
    ({ gsap, root }) => {
      const pin = root.querySelector<HTMLElement>("[data-cards-pin]");
      const rail = root.querySelector<HTMLElement>("[data-cards]");
      const stamp = root.querySelector<HTMLElement>("[data-stamp]");
      if (!pin || !rail) return;

      // The block holds centred when it fits the screen, otherwise with its
      // foot on the bottom edge so the whole row is in view.
      const start = () => (pin.offsetHeight <= window.innerHeight ? "center center" : "bottom bottom");
      const desktop = () => window.matchMedia("(min-width: 768px)").matches;
      // The row waits half off to the right on desktop (in place below md),
      // and travels until its first card sits on the gutter (its last card on
      // the screen edge below md).
      const from = () => (desktop() ? window.innerWidth * 0.5 : 0);
      const to = () => {
        if (!desktop()) return -(rail.scrollWidth - rail.clientWidth);
        const gutter = Math.min(Math.max(20, window.innerWidth * 0.05), 88);
        return gutter - parseFloat(getComputedStyle(rail).paddingLeft);
      };

      // 1. On the way in, the heading lines slide together from both sides
      //    and settle exactly as the block pins.
      root.querySelectorAll<HTMLElement>("[data-mega]").forEach((line, i) => {
        gsap.fromTo(
          line,
          { xPercent: i % 2 === 0 ? -30 : 30 },
          {
            xPercent: 0,
            ease: "power1.out",
            scrollTrigger: { trigger: pin, start: "top bottom", end: start, scrub: 0.6, invalidateOnRefresh: true },
          },
        );
      });

      // 2. The stamp comes down the moment the block pins: oversized and
      //    lifted, then pressed flat with a small jolt. Lifted again on the
      //    way back up.
      const press = stamp
        ? gsap
            .timeline({ paused: true })
            .fromTo(stamp, { scale: 2.2, rotate: -2, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.32, ease: "power4.in" })
            .fromTo(stamp, { x: -3, y: 2 }, { x: 0, y: 0, duration: 0.18, ease: "elastic.out(1.2, 0.4)" })
        : null;

      // 3. Held in place, the row glides left; only then does the page move
      //    on. Scrub smoothing keeps the travel soft on a wheel or trackpad.
      gsap.fromTo(
        rail,
        { x: from },
        {
          x: to,
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start,
            end: () => `+=${Math.max(window.innerHeight * 0.6, from() - to())}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => press?.play(),
            onLeaveBack: () => press?.reverse(),
          },
        },
      );

      animateChapterParts({ gsap, root });
    },
    [],
    { scope, skipOnReducedMotion: true },
  );

  return (
    <section
      ref={scope}
      id="begin"
      data-chapter
      data-bg={programmes.bg}
      data-counter={programmes.counter}
      data-nav-theme="light"
      aria-labelledby="begin-title"
      className="relative overflow-hidden pt-[30vw] text-[#1f1d1e] md:pt-[22vw]"
    >
      <div data-cards-pin>
        <div className="relative z-[1]">
          {/* One line; the words slide in towards each other from opposite sides. */}
          <h2
            id="begin-title"
            className="relative m-0 flex flex-wrap gap-x-[0.28em] pl-[5vw] font-normal text-[12.5vw] leading-[0.92] uppercase md:text-[9.5vw]"
            style={faceStyle.unbounded}
          >
            {programmes.title.map((line) => (
              <span key={line} data-mega className="block">
                {line}
              </span>
            ))}
          </h2>

          {/* Inked beside the heading like a round commemorative postmark. */}
          <div
            data-stamp
            className="story-stamp absolute right-[5vw] top-1/2 -translate-y-1/2"
            style={condensedStyle}
          >
            <TrialStamp image="/images/heritage/archive-staff-drill.webp" />
          </div>
        </div>

        <p
          data-scrub-text
          style={monoStyle}
          className="gutter relative z-[1] mt-[5vw] text-[3.4vw] uppercase tracking-[0.2em] md:mt-[1.5vw] md:text-[1vw]"
        >
          <ScrollWords text={programmes.note} />
        </p>

        <div className="relative z-[1] mt-[8vw] md:mt-[3vw]">
          <ul
            data-cards
            className="no-scrollbar flex gap-[5vw] overflow-x-auto px-[6vw] pb-[4vw] motion-safe:overflow-visible md:gap-[2vw] md:overflow-visible md:pl-[22vw] md:pr-[4vw]"
          >
            {programmes.items.map((item) => (
              <li key={item.title} className="w-[68vw] shrink-0 md:w-[17vw]">
                <TransitionLink
                  href={item.href}
                  className="story-card group block h-full bg-[#dccdb6] pb-[2vw] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[0.6vw]"
                  style={monoStyle}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      width={item.image.width}
                      height={item.image.height}
                      sizes="(min-width: 768px) 17vw, 68vw"
                      className="story-print h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div data-scrub-text className="px-[4vw] pt-[4vw] md:px-[1.2vw] md:pt-[1.4vw]">
                    <p className="text-[12px] uppercase leading-none tracking-[4px] opacity-70">
                      <ScrollWords text={item.kicker} />
                    </p>
                    <p className="mt-3 text-[20px] leading-tight md:text-[22px]">
                      <ScrollWords text={item.title} />
                    </p>
                    {/* Each programme's details are given once, on the Contact page. */}
                    <span className="mt-4 inline-flex items-center gap-2 text-[12px] uppercase tracking-[3px]">
                      Read more
                      <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        style={monoStyle}
        className="gutter relative z-[1] mt-[10vw] grid gap-[6vw] text-[4vw] leading-snug md:mt-[6vw] md:grid-cols-[17vw_1fr] md:gap-[2vw] md:text-[1.05vw]"
      >
        <div>
          <p className="text-[11px] uppercase tracking-[4px] opacity-60">Call</p>
          <p className="mt-3">
            <a href={telHref(site)} className="link-underline">
              {site.contact.phone}
            </a>
            <br />
            <a href="tel:+919072330952" className="link-underline">
              +91 90723 30952
            </a>
          </p>
        </div>
        {/* The call to action closes the row on the right. */}
        <div className="md:justify-self-end md:text-right">
          <p className="text-[11px] uppercase tracking-[4px] opacity-60">Start</p>
          <TransitionLink
            href={whatsAppHref(site, "Hello Choorakkodi — I would like to book a trial class.")}
            className="mt-3 inline-flex items-center gap-3 border border-[#c4a487] bg-[#c4a487] px-5 py-3 uppercase tracking-[3px] text-[#1f1d1e] transition-colors hover:border-[#1f1d1e] hover:bg-[#1f1d1e] hover:text-[#ffffff]"
          >
            Book a trial class
            <ArrowRight aria-hidden="true" className="size-4" />
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
