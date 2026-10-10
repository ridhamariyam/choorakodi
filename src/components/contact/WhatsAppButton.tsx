"use client";

import { hasWhatsApp as siteHasWhatsApp, whatsAppHref } from "@/data/site";
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
 * While no WhatsApp number has been supplied the button stays fully
 * functional and routes to /contact instead — better than a dead link, and
 * far better than dialling an invented number.
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
  const href = whatsAppHref(site, message);

  return (
    <Button
      href={href}
      external={hasWhatsApp}
      variant={variant}
      size={size}
      magnetic={magnetic}
      arrow={!showIcon}
      className={cn("group/arrow", className)}
      ariaLabel={hasWhatsApp ? `${label} (opens WhatsApp)` : `${label} — go to contact page`}
    >
      {showIcon ? (
        <span className="inline-flex items-center gap-2.5">
          <WhatsAppIcon className="h-[1.15em] w-[1.15em]" />
          {label}
        </span>
      ) : (
        label
      )}
    </Button>
  );
}
