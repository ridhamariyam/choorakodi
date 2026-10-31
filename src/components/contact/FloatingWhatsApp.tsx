"use client";

import { useRef, useState } from "react";
import { Phone } from "lucide-react";
import { hasWhatsApp as siteHasWhatsApp, telHref, whatsAppHref } from "@/data/site";
import { useSite } from "@/components/content/ContentProvider";
import { useGsap } from "@/hooks/useGsap";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "@/lib/utils";

const MESSAGE = "Hello Choorakkodi — I would like to know more about training at the academy.";

/**
 * The persistent WhatsApp affordance: the real WhatsApp mark, circular, in
 * WhatsApp's own green so it is recognised instantly. It is the only round,
 * brand-coloured element on the site — everything else is square and in the
 * Choorakkodi palette — which is what makes it read as a utility rather than
 * as part of the editorial layout.
 *
 * Restrained on purpose: no pulsing ring, no auto-opening bubble, no badge,
 * no label. It fades in once the hero is behind you and then stays put.
 *
 * Until a WhatsApp number exists it is a call button in the brand's green.
 */
export function FloatingWhatsApp() {
  const scope = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const site = useSite();
  const hasWhatsApp = siteHasWhatsApp(site);
  const href = whatsAppHref(site, MESSAGE);

  useGsap(
    ({ gsap, ScrollTrigger, root, reduced }) => {
      const button = root.firstElementChild as HTMLElement | null;
      if (!button) return;

      if (reduced) {
        setVisible(true);
        gsap.set(button, { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.set(button, { autoAlpha: 0, scale: 0.8 });

      ScrollTrigger.create({
        // Shortly after the hero starts leaving — the bar no longer carries a
        // WhatsApp control, so this should not wait a full viewport.
        start: "top -25%",
        end: 99999,
        onToggle: (self) => {
          setVisible(self.isActive);
          gsap.to(button, {
            autoAlpha: self.isActive ? 1 : 0,
            scale: self.isActive ? 1 : 0.8,
            duration: 0.5,
            ease: "back.out(1.6)",
          });
        },
      });
    },
    [],
    { scope },
  );

  const label = hasWhatsApp
    ? "Message Choorakkodi on WhatsApp"
    : `Call Choorakkodi on ${site.contact.phone}`;

  const classes = cn(
    "flex h-14 w-14 items-center justify-center rounded-full",
    // WhatsApp brand green, so the icon is the thing people already know.
    hasWhatsApp ? "bg-[#25D366] text-white" : "bg-[#10706c] text-white",
    "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.07]",
    "focus-visible:outline-offset-4",
    "sm:h-[3.75rem] sm:w-[3.75rem]",
  );

  return (
    <div
      ref={scope}
      className="floating-contact fixed bottom-0 right-0 z-[120] p-[max(1rem,env(safe-area-inset-bottom))] sm:p-6"
    >
      <div className={cn("opacity-0", !visible && "pointer-events-none")}>
        {hasWhatsApp ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            className={classes}
            tabIndex={visible ? 0 : -1}
          >
            <WhatsAppIcon className="h-7 w-7 sm:h-[1.9rem] sm:w-[1.9rem]" />
          </a>
        ) : (
          <a href={telHref(site)} aria-label={label} title={label} className={classes} tabIndex={visible ? 0 : -1}>
            <Phone className="h-6 w-6" aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
