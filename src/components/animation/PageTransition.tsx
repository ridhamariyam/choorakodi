"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useLenis } from "@/hooks/useLenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Wordmark } from "@/components/brand/BrandMark";
import { cn } from "@/lib/utils";

type TransitionApi = {
  navigate: (href: string) => void;
  isTransitioning: boolean;
};

const TransitionContext = createContext<TransitionApi>({
  navigate: () => {},
  isTransitioning: false,
});

export function usePageTransition(): TransitionApi {
  return useContext(TransitionContext);
}

/** If the route never resolves, reveal anyway rather than trapping the user. */
const SAFETY_MS = 2600;

/**
 * Route transition: a deep-green layer rises over the current page, the
 * Choorakkodi mark holds for a beat, the route changes behind it, and the
 * layer continues upward off-screen. One direction of travel throughout —
 * it reads as a single movement rather than a curtain opening and closing.
 *
 * Under reduced motion the overlay is never used; navigation is immediate.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { scrollToTop } = useLenis();

  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const safetyRef = useRef<number | null>(null);
  /** The href we are travelling to, or null when idle. */
  const pendingRef = useRef<string | null>(null);
  const lastPathRef = useRef(pathname);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const clearSafety = useCallback(() => {
    if (safetyRef.current !== null) {
      window.clearTimeout(safetyRef.current);
      safetyRef.current = null;
    }
  }, []);

  const playOut = useCallback(() => {
    clearSafety();
    const overlay = overlayRef.current;
    const mark = markRef.current;
    if (!overlay || !mark) {
      setIsTransitioning(false);
      setAnnouncement("");
      return;
    }

    timelineRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { clipPath: "inset(100% 0% 0% 0%)", pointerEvents: "none" });
        setIsTransitioning(false);
        setAnnouncement("");
      },
    });
    timelineRef.current = tl;

    tl.to(mark, { autoAlpha: 0, y: -18, duration: 0.32, ease: "power2.in" })
      .to(
        overlay,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.72, ease: "power3.inOut" },
        0.08,
      );
  }, [clearSafety]);

  // Fires once the new route has actually rendered.
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;

    if (!pendingRef.current) return;
    pendingRef.current = null;

    scrollToTop(true);
    // Measure the new document before uncovering it, or pinned sections on the
    // incoming page start with stale positions.
    const raf = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      playOut();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [pathname, playOut, scrollToTop]);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) return;

      if (reducedMotion) {
        router.push(href);
        scrollToTop(true);
        return;
      }

      const overlay = overlayRef.current;
      const mark = markRef.current;
      if (!overlay || !mark) {
        router.push(href);
        return;
      }

      // A second click mid-transition retargets rather than stacking.
      if (pendingRef.current) {
        pendingRef.current = href;
        router.push(href);
        return;
      }

      pendingRef.current = href;
      setIsTransitioning(true);
      setAnnouncement("Loading page");

      timelineRef.current?.kill();
      const tl = gsap.timeline({
        onComplete: () => {
          router.push(href);
          // If the route stalls or errors, uncover rather than hang.
          safetyRef.current = window.setTimeout(() => {
            pendingRef.current = null;
            playOut();
          }, SAFETY_MS);
        },
      });
      timelineRef.current = tl;

      gsap.set(overlay, { clipPath: "inset(100% 0% 0% 0%)", pointerEvents: "auto" });
      gsap.set(mark, { autoAlpha: 0, y: 14 });

      tl.to(overlay, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.62, ease: "power3.inOut" })
        .to(mark, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.28);
    },
    [pathname, reducedMotion, router, scrollToTop, playOut],
  );

  useEffect(
    () => () => {
      timelineRef.current?.kill();
      if (safetyRef.current !== null) window.clearTimeout(safetyRef.current);
    },
    [],
  );

  const api = useMemo<TransitionApi>(() => ({ navigate, isTransitioning }), [
    navigate,
    isTransitioning,
  ]);

  return (
    <TransitionContext.Provider value={api}>
      {children}

      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] grid place-items-center bg-green-deep"
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div ref={markRef} className="flex flex-col items-center gap-5 opacity-0">
          <Wordmark tone="mono" className="h-14 w-auto sm:h-20" />
        </div>
      </div>

      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </span>
    </TransitionContext.Provider>
  );
}

export type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

/**
 * A real anchor with a real href — crawlable, middle-clickable, and
 * open-in-new-tab friendly — that routes through the transition on a plain
 * left click. Falls back to next/link's own handling for external URLs.
 */
export function TransitionLink({
  href,
  children,
  className,
  onClick,
  ...rest
}: TransitionLinkProps) {
  const { navigate } = usePageTransition();
  const isRoute = href.startsWith("/") && !href.startsWith("//");
  // A bare "#section" link scrolls the current page — it must not be routed
  // through the transition, and it is certainly not an external URL.
  const isHash = href.startsWith("#");

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!isRoute || event.defaultPrevented) return;
    // Let the browser handle modified clicks: new tab, new window, download.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (event.button !== 0) return;

    event.preventDefault();
    navigate(href);
  };

  if (isHash) {
    return (
      <a href={href} className={cn(className)} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }

  if (!isRoute) {
    return (
      <a
        href={href}
        className={cn(className)}
        rel="noopener noreferrer"
        target="_blank"
        onClick={onClick}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn(className)} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
