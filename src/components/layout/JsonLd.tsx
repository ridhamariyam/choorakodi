/**
 * Renders JSON-LD. Accepts nulls so callers can pass a builder result straight
 * through — builders return null when the underlying data is placeholder.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> | null | undefined }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      // Content is built from typed local data, never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
