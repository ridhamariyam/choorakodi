/** Tiny class-name joiner. No dependency needed for what amounts to a filter. */
export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

/** "01", "02" … from a zero-based index. Used for the editorial numbering. */
export function ordinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}
