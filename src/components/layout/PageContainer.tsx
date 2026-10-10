import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PageContainerProps = {
  children: ReactNode;
  className?: string;
  /** "wide" removes the max-width for full-bleed editorial compositions. */
  width?: "default" | "wide" | "narrow";
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
};

const widthClasses = {
  narrow: "max-w-4xl",
  default: "max-w-[var(--container-editorial)]",
  wide: "max-w-[110rem]",
} as const;

/**
 * Horizontal rhythm for the whole site: one gutter, one measure, applied
 * everywhere so nothing drifts a few pixels out of alignment between pages.
 */
export function PageContainer({
  children,
  className,
  width = "default",
  as: Tag = "div",
}: PageContainerProps) {
  return (
    <Tag className={cn("gutter mx-auto w-full", widthClasses[width], className)}>{children}</Tag>
  );
}
