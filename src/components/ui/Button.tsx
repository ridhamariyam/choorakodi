"use client";

import type { ReactNode } from "react";
import { TransitionLink } from "@/components/animation/PageTransition";
import { MagneticButton } from "@/components/animation/MagneticButton";
import { ArrowSlot } from "./ArrowLink";
import { cn } from "@/lib/utils";

export type ButtonVariant = "solid" | "outline" | "ghost" | "bone";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  // Taupe with ink text: white on taupe is too faint to read.
  solid: "bg-green text-[#101312] hover:bg-green-deep",
  // Hairline box that fills on hover. Reads correctly on any ground.
  outline:
    "border border-current/35 hover:border-current/70 bg-transparent",
  ghost: "bg-transparent hover:opacity-70",
  // Off-white on dark grounds.
  bone: "bg-bone text-ink hover:bg-bone-dim",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-5 py-3 text-meta gap-2.5",
  md: "px-7 py-4 text-meta-lg gap-3",
  lg: "px-8 py-5 text-meta-lg gap-3.5 sm:px-10",
};

export type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  /** Show the sliding arrow slot. */
  arrow?: boolean;
  /** Magnetic hover. Reserve for primary CTAs so it stays meaningful. */
  magnetic?: boolean;
  /** Renders an external anchor instead of a routed link. */
  external?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit";
};

/**
 * Editorial button: square corners, uppercase letterspaced label, no shadow.
 * The brief explicitly rules out rounded, shadowed, SaaS-looking buttons.
 */
export function Button({
  children,
  href,
  onClick,
  variant = "solid",
  size = "md",
  className,
  arrow = true,
  magnetic = false,
  external = false,
  ariaLabel,
  type = "button",
}: ButtonProps) {
  const classes = cn(
    "group/arrow inline-flex items-center justify-center font-medium uppercase tracking-[0.14em]",
    "transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      <span>{children}</span>
      {arrow ? <ArrowSlot /> : null}
    </>
  );

  const element = href ? (
    external ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    ) : (
      <TransitionLink href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </TransitionLink>
    )
  ) : (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );

  return magnetic ? <MagneticButton>{element}</MagneticButton> : element;
}
