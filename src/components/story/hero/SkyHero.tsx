"use client";

import { useRef, type CSSProperties } from "react";
import { skyScenes, skyTextures, type SkyScene } from "@/data/hero";
import type { Story } from "@/lib/content/defaults";
import { useGsap } from "@/hooks/useGsap";
import { serifStyle } from "../fonts";
import { cn } from "@/lib/utils";

/** The cream of the sky the preloader leaves on. */
const CREAM = "#fbf8ef";
/** Ink of the engraved words. */
const INK = "#2b2440";
/** Pinned scroll per scene, in viewport heights. */
const VH_PER_SCENE = { desktop: 1.6, mobile: 1.2 };

/**
 * The sky hero: scenes on old map paper. Each photograph surfaces out of the
 * clouds beside a few engraved words that resolve letter by letter; then the
 * words smear away, the clouds close over everything and open again on the
 * next scene. The section pins and the scrollbar drives the whole film. The
 * last scene closes into the page's own ground, where the chronicle begins.
 *
 * Under reduced motion the scenes are simply stacked, without the pin.
 */
export function SkyHero({ intro }: { intro: Story["intro"] }) {
  const scope = useRef<HTMLElement>(null);

  useGsap(
    ({ gsap, ScrollTrigger, root, reduced, cleanup }) => {
      // Tell the preloader the first scene is ready to be seen, two frames
      // after its photograph has decoded, so it opens onto a picture.
      const first = root.querySelector<HTMLImageElement>("[data-scene] img");
      let told = false;
      const ready = () => {
        if (told) return;
        told = true;
        requestAnimationFrame(() => requestAnimationFrame(() => window.dispatchEvent(new Event("hero:ready"))));
      };
      if (!first || first.complete) ready();
      else {
        first.decode().then(ready, ready);
        first.addEventListener("error", ready, { once: true });
      }

      if (reduced) return;
      root.dataset.pinned = "";
      cleanup(() => delete root.dataset.pinned);

      const mobile = window.matchMedia("(max-width: 767px)").matches;
      const vhPerScene = mobile ? VH_PER_SCENE.mobile : VH_PER_SCENE.desktop;
      const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
      const veil = root.querySelector<HTMLElement>("[data-veil]");
      const paper = root.querySelector<HTMLElement>("[data-paper]");
      const covers = root.querySelectorAll<HTMLElement>("[data-cover]");
      const drifts = root.querySelectorAll<HTMLElement>("[data-drift]");
      const html = document.documentElement;

      // The clouds along the foot of the sky never stop drifting.
      drifts.forEach((cloud, i) => {
        gsap.to(cloud, { xPercent: i % 2 ? -4 : 4, duration: 14 + i * 4, ease: "sine.inOut", repeat: -1, yoyo: true });
      });

      // Every scene but the first starts hidden in cloud.
      scenes.forEach((scene, i) => gsap.set(scene, { autoAlpha: i === 0 ? 1 : 0 }));

      /*
       * One timeline, three units a scene: in (1), hold (1), out (1). The
       * last scene's "out" is the landing: the clouds close one more time,
       * over the page's own ground instead of the sky, then sink away. A
       * final viewport of pinned scroll follows, during which the first
       * chapter rises over the settled hero (see Chapter's overlapHero), so
       * the film does not end and then the page begin — one becomes the other.
       */
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      const last = scenes.length - 1;
      scenes.forEach((scene, i) => {
        const photo = scene.querySelector("[data-photo]");
        const chars = scene.querySelectorAll("[data-char]");
        const line = scene.querySelector("[data-line]");
        const at = i * 3;

        // In: the clouds part, the photograph surfaces, the words resolve.
        if (i > 0) {
          tl.set(scene, { autoAlpha: 1 }, at);
          // immediateRender off: these must not paint their start state
          // until the scroll reaches them.
          tl.fromTo(covers, { autoAlpha: 1, scale: 1.6, yPercent: -14 }, { autoAlpha: 0, scale: 1, yPercent: 0, duration: 1, ease: "power2.out", immediateRender: false }, at);
          tl.fromTo(veil, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.7, ease: "power1.out", immediateRender: false }, at);
          tl.fromTo(photo, { scale: 1.14, filter: "blur(14px)", autoAlpha: 0 }, { scale: 1, filter: "blur(0px)", autoAlpha: 1, duration: 1.1, ease: "power2.out" }, at);
          tl.fromTo(chars, { autoAlpha: 0, filter: "blur(10px)", x: "-0.3em" }, { autoAlpha: 1, filter: "blur(0px)", x: 0, duration: 0.5, stagger: 0.035, ease: "power2.out" }, at + 0.35);
          if (line) tl.fromTo(line, { autoAlpha: 0, filter: "blur(6px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 0.5 }, at + 0.8);
        }
        tl.to(paper, { xPercent: i % 2 ? 2 : -2, yPercent: i % 2 ? -1.5 : 1.5, scale: 1.04 + (i % 3) * 0.02, duration: 3 }, at);

        // Out: the words smear sideways, the clouds rise over the frame.
        const out = at + 2;
        tl.to(chars, { autoAlpha: 0, filter: "blur(8px)", x: "0.5em", scaleX: 1.4, duration: 0.45, stagger: 0.015, ease: "power2.in" }, out);
        if (line) tl.to(line, { autoAlpha: 0, filter: "blur(6px)", x: "1em", duration: 0.4, ease: "power2.in" }, out);
        tl.to(photo, { scale: 1.08, filter: "blur(10px)", duration: 1, ease: "power2.in" }, out);
        tl.fromTo(covers, { autoAlpha: 0, scale: 1, yPercent: 0 }, { autoAlpha: 1, scale: 1.6, yPercent: -14, duration: 1, ease: "power2.in", immediateRender: false }, out);
        // The last close is into the page's ground.
        if (i === last) tl.set(veil, { backgroundColor: intro.bg }, out);
        tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: "power1.in", immediateRender: false }, out + 0.4);
        tl.set(scene, { autoAlpha: 0 }, out + 1);
      });

      // Landing: the clouds sink below the ground and thin out to nothing,
      // the map paper goes with them.
      const land = scenes.length * 3;
      tl.to(paper, { autoAlpha: 0, duration: 0.6 }, land - 0.6);
      tl.to(drifts, { autoAlpha: 0, duration: 0.6 }, land - 0.6);
      tl.to(covers, { yPercent: 38, scale: 1.25, autoAlpha: 0, duration: 1.2, ease: "power2.inOut" }, land);
      // One more viewport of pin, measured in timeline units.
      const tail = 3 / vhPerScene;
      tl.to({}, { duration: tail }, land);

      const trigger = ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: () => `+=${window.innerHeight * (scenes.length * vhPerScene + 1)}`,
        pin: true,
        anticipatePin: 1,
        scrub: 0.8,
        invalidateOnRefresh: true,
        animation: tl,
        onToggle: (self) => {
          html.dataset.heroActive = String(self.isActive);
        },
      });
      html.dataset.heroActive = String(trigger.isActive || window.scrollY < 10);

      // Arriving from the preloader: its sky is this sky, so as it fades the
      // first photograph surfaces and the words resolve, as every later
      // scene does on scroll. Without a preloader (a client-side visit) the
      // scene is simply there.
      const opening = scenes[0];
      const openingPhoto = opening?.querySelector("[data-photo]");
      if (document.querySelector("ck-preloader") && opening && openingPhoto) {
        const photo = openingPhoto;
        const chars = opening.querySelectorAll("[data-char]");
        const line = opening.querySelector("[data-line]");
        gsap.set([photo, ...chars, line].filter(Boolean), { autoAlpha: 0 });
        let entered = false;
        const enter = () => {
          if (entered) return;
          entered = true;
          const entrance = gsap.timeline({ delay: 0.2 });
          entrance.fromTo(photo, { autoAlpha: 0, scale: 1.14, filter: "blur(14px)" }, { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 1.4, ease: "power2.out", clearProps: "filter,transform" }, 0);
          entrance.fromTo(chars, { autoAlpha: 0, filter: "blur(10px)", x: "-0.3em" }, { autoAlpha: 1, filter: "blur(0px)", x: 0, duration: 0.7, stagger: 0.045, ease: "power2.out", clearProps: "filter,transform" }, 0.45);
          if (line) entrance.fromTo(line, { autoAlpha: 0, filter: "blur(6px)" }, { autoAlpha: 1, filter: "blur(0px)", duration: 0.7, clearProps: "filter" }, 0.9);
        };
        // ck-leaving on a normal exit; ck-finished alone when it is skipped.
        window.addEventListener("ck-leaving", enter, { once: true });
        window.addEventListener("ck-finished", enter, { once: true });
        cleanup(() => {
          window.removeEventListener("ck-leaving", enter);
          window.removeEventListener("ck-finished", enter);
        });
      }

      cleanup(() => delete html.dataset.heroActive);
    },
    [],
    { scope },
  );

  return (
    <section
      ref={scope}
      id="intro"
      data-bg={intro.bg}
      data-counter={intro.counter}
      data-nav-theme="light"
      // isolate: the hero's own layers never stack over the chapter that
      // rises over its last viewport.
      className="group/sky relative isolate overflow-hidden data-[pinned]:h-svh data-[pinned]:min-h-[34rem]"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      <h1 className="sr-only">{intro.heading}</h1>

      {/* Old map paper, behind every scene. */}
      <div
        data-paper
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-4%] bg-cover bg-center opacity-80"
        style={{ backgroundImage: `url(${skyTextures.paper})` }}
      />

      {skyScenes.map((scene, i) => (
        <Scene key={scene.id} scene={scene} eager={i === 0} />
      ))}

      {/* Two banks along the foot of the sky, always drifting. The preloader
          draws the same two in the same places (public/preloader.js). */}
      <Cloud src={skyTextures.cloudBank} drift className="bottom-[-8%] left-[-60%] w-[200%] opacity-85 md:bottom-[-30%] md:left-[-14%] md:w-[78%]" />
      <Cloud src={skyTextures.cloudBank2} drift className="bottom-[-12%] right-[-70%] w-[190%] opacity-85 md:bottom-[-36%] md:right-[-14%] md:w-[66%]" />

      {/* The clouds that close over a scene, and what they close into. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden group-data-[pinned]/sky:block">
        <div data-veil className="absolute inset-0 opacity-0" style={{ backgroundColor: CREAM }} />
        <Cloud src={skyTextures.cloudBank} cover className="bottom-[-30%] left-[-30%] w-[120%] opacity-0" />
        <Cloud src={skyTextures.cloudBank2} cover className="bottom-[-30%] right-[-30%] w-[110%] opacity-0" />
        <Cloud src={skyTextures.cloudPuff} cover flip className="top-[-24%] left-[16%] w-[70%] opacity-0" />
      </div>
    </section>
  );
}

function Scene({ scene, eager }: { scene: SkyScene; eager: boolean }) {
  const center = scene.side === "center";
  const textLeft = scene.side === "left";

  return (
    <div
      data-scene
      className={cn(
        "relative z-[4] flex min-h-svh flex-col justify-center gap-[6vw] px-[6vw] py-[18vw]",
        // Pinned: every scene fills the same frame, one above the other.
        "group-data-[pinned]/sky:absolute group-data-[pinned]/sky:inset-0 group-data-[pinned]/sky:min-h-0 group-data-[pinned]/sky:py-0",
        center ? "items-center" : textLeft ? "md:flex-row-reverse md:items-center" : "md:flex-row md:items-center",
      )}
    >
      <div
        data-photo
        className={cn(
          "relative w-full",
          center
            ? "h-[46svh] md:absolute md:inset-[34%_14%_2%] md:h-auto md:w-auto"
            : "h-[46svh] md:h-[82%] md:w-[60%]",
        )}
        style={
          {
            maskImage: `url(${skyTextures.mask})`,
            WebkitMaskImage: `url(${skyTextures.mask})`,
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          } as CSSProperties
        }
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={scene.image.src}
          alt={scene.image.alt}
          width={scene.image.width}
          height={scene.image.height}
          fetchPriority={eager ? "high" : undefined}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply [filter:grayscale(.7)_sepia(.22)_brightness(1.12)_contrast(.96)]"
        />
        <Cloud src={skyTextures.cloudBank} className="bottom-[-26%] left-[-6%] z-[1] w-[70%] opacity-60" />
      </div>

      <div
        style={serifStyle}
        className={cn(
          "relative z-[2] text-center",
          !center && (textLeft ? "md:w-[34%] md:text-left" : "md:w-[34%] md:text-right"),
          center && "md:absolute md:inset-x-0 md:top-[15%]",
        )}
      >
        <p className="m-0 text-[3vw] font-semibold uppercase tracking-[0.3em] opacity-80 md:text-[0.95vw]">
          <Letters text={scene.kicker} />
        </p>
        <h2 className="m-0 mt-[2vw] text-[9vw] leading-[1.02] font-bold uppercase tracking-[0.04em] md:mt-[0.8vw] md:text-[3.6vw]">
          <Letters text={scene.title} />
        </h2>
        {scene.line ? (
          <p data-line className="m-0 mt-[3vw] text-[3.4vw] font-semibold uppercase tracking-[0.16em] opacity-75 md:mt-[1.2vw] md:text-[0.95vw]">
            {scene.line}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Letters the scroll can resolve one by one; read as one word by assistive tech. */
function Letters({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/(\s+)/).map((word, i) =>
          /^\s+$/.test(word) ? (
            word
          ) : (
            // Each word stays whole when the line wraps.
            <span key={i} className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, j) => (
                <span key={j} data-char className="inline-block">
                  {char}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </>
  );
}

function Cloud({
  src,
  className,
  drift = false,
  cover = false,
  flip = false,
}: {
  src: string;
  className?: string;
  drift?: boolean;
  cover?: boolean;
  flip?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden="true"
      data-drift={drift ? "" : undefined}
      data-cover={cover ? "" : undefined}
      className={cn("pointer-events-none absolute z-[3] h-auto max-w-none select-none", flip && "-scale-y-100", className)}
    />
  );
}
