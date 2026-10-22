/** Splits text so the given phrases can be set bold, longest phrase first. */
export function highlight(text: string, phrases: string[]): { text: string; bold: boolean }[] {
  const sorted = [...phrases].sort((a, b) => b.length - a.length);
  if (sorted.length === 0) return [{ text, bold: false }];
  const pattern = new RegExp(`(${sorted.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({ text: part, bold: sorted.includes(part) }));
}
