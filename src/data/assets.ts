/**
 * Image slots.
 *
 * Until real Choorakkodi photography exists, every slot carries `src: null`
 * and renders as a composed placeholder block (see components/content/Figure).
 * Dropping a file into /public/images/<folder>/ and setting `src` here is the
 * only change needed — no component edits, no layout changes.
 *
 * We deliberately do NOT point these at stock photography: the brief forbids
 * passing generic imagery off as the academy's own.
 */

export type ImageSlot = {
  /** Path under /public once the real asset exists, otherwise null. */
  src: string | null;
  /** Meaningful alt text. Written now so accessibility is not an afterthought. */
  alt: string;
  /** Shown inside the placeholder block, e.g. "HISTORICAL IMAGE". */
  label: string;
  /** Intended location + subject, surfaced in CONTENT_TODO.md. */
  brief?: string;
  width?: number;
  height?: number;
};

export function slot(
  label: string,
  alt: string,
  options: Partial<Omit<ImageSlot, "label" | "alt">> = {},
): ImageSlot {
  return { src: null, label, alt, ...options };
}
