"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLenis } from "@/hooks/useLenis";
import styles from "./RevealFooter.module.css";

/** The page's bottom corner radius once the whole footer shows (noahlesage.com). */
const MAX_RADIUS = 52;
/** Share of the footer that must show before its contents fade in. */
const VISIBLE_AT = 0.25;
/** Least breathing room kept under the closing section's content. */
const MIN_PAD = 40;

const inFlow = (el: Element): el is HTMLElement =>
  el instanceof HTMLElement && el.tagName !== "SCRIPT" && !/^(fixed|absolute)$/.test(getComputedStyle(el).position);

/**
 * The block the footer rises over: the page's last section, or — when that is
 * a long composition like the homepage chronicle — its own last part.
 */
function closingBlock(card: HTMLElement): HTMLElement | null {
  let block: HTMLElement | null = card;
  do {
    const children: HTMLElement[] = Array.from(block.children).filter(inFlow);
    block = children[children.length - 1] ?? null;
  } while (block && block.offsetHeight > window.innerHeight * 2);
  return block;
}

/**
 * The page and its footer, revealed the way noahlesage.com does it: the
 * footer is fixed under the page, and over the last stretch of scroll (as
 * long as the footer is tall) the page is clipped from the bottom, so the
 * footer shows through while the page's corners round — radius = revealed
 * height × 52 / footer height. The page keeps a transparent margin as tall
 * as the footer under it, so it ends right after its closing content and the
 * footer shows through that margin as the page lifts: the page rises by the
 * footer's height and no more, with no blank band added to the last section.
 *
 * A footer taller than the screen could never be seen whole while fixed, so
 * it falls back to sitting in the flow under the page. Tabbing into the
 * footer scrolls to the end, so a focused link is never hidden under the page.
 */
export function RevealFooter({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const { getLenis } = useLenis();
  const cardRef = useRef<HTMLElement>(null);
  const footRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const foot = footRef.current;
    if (!card || !foot) return;

    const root = document.documentElement;
    let height = 0;
    let fixed = true;
    let raf = 0;
    let closing: HTMLElement | null = null;

    /** Room for the footer under the page, and a little air under its last content. */
    const fit = () => {
      card.style.marginBottom = fixed ? `${height}px` : "";
      if (closing) closing.style.paddingBottom = "";
      closing = fixed ? closingBlock(card) : null;
      if (!closing) return;
      if (parseFloat(getComputedStyle(closing).paddingBottom) < MIN_PAD) closing.style.paddingBottom = `${MIN_PAD}px`;
    };

    const draw = () => {
      raf = 0;
      if (!fixed) {
        card.style.clipPath = "";
        foot.dataset.visible = "true";
        delete root.dataset.footerRevealed;
        return;
      }
      // The footer shows through the gap between the page's bottom edge and
      // the screen's.
      const shown = Math.min(height, Math.max(0, window.innerHeight - card.getBoundingClientRect().bottom));
      // Lets fixed overlays that live inside the page (the story's year
      // counter) step aside instead of sitting over the footer.
      if (shown > 0) root.dataset.footerRevealed = "true";
      else delete root.dataset.footerRevealed;
      const radius = height ? (shown / height) * MAX_RADIUS : 0;
      card.style.clipPath = shown > 0 ? `inset(0 round 0 0 ${radius}px ${radius}px)` : "";
      if (shown > height * VISIBLE_AT) foot.dataset.visible = "true";
      else if (shown === 0) foot.dataset.visible = "false";
    };
    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(draw);
    };
    const size = () => {
      height = foot.offsetHeight;
      fixed = height <= window.innerHeight;
      foot.dataset.mode = fixed ? "fixed" : "static";
      fit();
      schedule();
    };

    const observer = new ResizeObserver(size);
    observer.observe(foot);
    // A new route swaps the page's sections; refit to the new closing one.
    const pages = new MutationObserver(size);
    pages.observe(card, { childList: true });
    size();

    const onFocus = () => {
      if (!fixed) return;
      const end = document.documentElement.scrollHeight;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(end, { immediate: true });
      else window.scrollTo({ top: end });
    };
    foot.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", size);
    return () => {
      window.cancelAnimationFrame(raf);
      observer.disconnect();
      pages.disconnect();
      card.style.marginBottom = "";
      if (closing) closing.style.paddingBottom = "";
      foot.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", size);
      delete root.dataset.footerRevealed;
    };
  }, [getLenis]);

  return (
    <>
      <main ref={cardRef} id="main" className={styles.card}>
        {children}
      </main>
      <div ref={footRef} className={styles.footer} data-mode="static" data-visible="true">
        {footer}
      </div>
    </>
  );
}
