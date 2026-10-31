"use client";

import { Phone } from "lucide-react";
import { hasWhatsApp as siteHasWhatsApp, telHref, whatsAppHref } from "@/data/site";
import { useSite } from "@/components/content/ContentProvider";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/Button";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { cn } from "@/lib/utils";

export type WhatsAppButtonProps = {
  label?: string;
  /** Pre-filled message body. Written per context, not generic. */
  message?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  magnetic?: boolean;
  showIcon?: boolean;
};

/**
 * The primary conversion control.
 *
 * While no WhatsApp number has been supplied the button calls the academy
 * instead, with a phone icon, so it never promises a chat that cannot happen.
 */
export function WhatsAppButton({
  label = "WhatsApp us",
  message,
  variant = "solid",
  size = "md",
  className,
  magnetic = false,
  showIcon = true,
}: WhatsAppButtonProps) {
  const site = useSite();
  const hasWhatsApp = siteHasWhatsApp(site);
  const href = hasWhatsApp ? whatsAppHref(site, message) : telHref(site);
  const text = !hasWhatsApp && /whatsapp/i.test(label) ? "Call the academy" : label;
  const Icon = hasWhatsApp ? WhatsAppIcon : Phone;

  return (
    <Button
      href={href}
      external={hasWhatsApp || href.startsWith("tel:")}
      variant={variant}
      size={size}
      magnetic={magnetic}
      arrow={!showIcon}
      className={cn("group/arrow", className)}
      ariaLabel={hasWhatsApp ? `${text} (opens WhatsApp)` : `${text} — call ${site.contact.phone}`}
    >
      {showIcon ? (
        <span className="inline-flex items-center gap-2.5">
          <Icon className="h-[1.15em] w-[1.15em]" />
          {text}
        </span>
      ) : (
        text
      )}
    </Button>
  );
}
