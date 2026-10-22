import type { Field, GroupField, TextareaField } from "payload";

/**
 * Shared field shapes for the admin.
 *
 * The site's components were written against plain data (string arrays,
 * caption runs, image slots). Rather than teach editors those structures,
 * each one is edited as the simplest thing that can hold it — mostly a
 * textarea — and src/lib/content.ts converts it back on read.
 */

/**
 * An image slot: an optional upload plus the text the site needs whether or
 * not a photo exists yet. Without an upload the site draws a labelled
 * placeholder block, never a stock photo.
 */
export function imageField(name: string, label?: string, placeholderLabel = "IMAGE"): GroupField {
  return {
    name,
    label,
    type: "group",
    fields: [
      {
        name: "image",
        type: "upload",
        relationTo: "media",
        admin: { description: "Leave empty to show a labelled placeholder instead of a photo." },
      },
      {
        type: "row",
        fields: [
          {
            name: "alt",
            label: "Description",
            type: "text",
            admin: { width: "60%", description: "What the photo shows. Read aloud to blind visitors and used by Google." },
          },
          {
            name: "label",
            label: "Placeholder label",
            type: "text",
            defaultValue: placeholderLabel,
            admin: { width: "40%", description: "Printed on the placeholder while no photo is uploaded." },
          },
        ],
      },
    ],
  };
}

/** A list of short strings, one per line: headings split over lines, bullet lists. */
export function linesField(name: string, label: string, description = "One item per line."): TextareaField {
  return { name, label, type: "textarea", admin: { description, rows: 4 } };
}

/** Several paragraphs, separated by an empty line. */
export function paragraphsField(name: string, label: string): TextareaField {
  return {
    name,
    label,
    type: "textarea",
    admin: { description: "Separate paragraphs with an empty line.", rows: 8 },
  };
}

/** The chronicle's captions: short lines with some words in bold. */
export function captionField(name = "caption", label = "Caption"): TextareaField {
  return {
    name,
    label,
    type: "textarea",
    admin: {
      rows: 6,
      description:
        "Each line appears on its own line on the site, in this order. Wrap words in **double asterisks** to make them bold.",
    },
  };
}

/** The discreet "pending" note shown where the academy still owes information. */
export function pendingField(name = "pending", label = "Pending note"): TextareaField {
  return {
    name,
    label,
    type: "textarea",
    admin: {
      rows: 3,
      description:
        "Shown as a small 'pending' note on the page. Clear this box once the real information is written above.",
    },
  };
}

export function colorField(name: string, label: string, description?: string): Field {
  return {
    name,
    label,
    type: "text",
    // Colours are set in code; editors change content only.
    admin: { hidden: true, description: description ?? "A hex colour, e.g. #10706c." },
    validate: (value: unknown) =>
      !value || /^#[0-9a-fA-F]{6}$/.test(String(value)) || "Use a six-digit hex colour like #10706c.",
  };
}

/** Eyebrow + multi-line heading + standfirst: the opening of every inner page. */
export function pageHeaderFields(): Field[] {
  return [
    { name: "eyebrow", type: "text", admin: { description: "The small label above the heading." } },
    linesField("heading", "Heading", "One line per row — the heading breaks exactly where you break it."),
    { name: "standfirst", type: "textarea", admin: { description: "The short introduction under the heading." } },
  ];
}
