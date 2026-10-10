import type { Block, CollectionConfig } from "payload";
import { imageField, linesField, paragraphsField } from "./fields";
import { collectionHooks } from "./revalidate";

/** Anyone logged in to the admin may edit; the public API is read-only. */
const editorAccess = {
  read: () => true,
  create: ({ req }: { req: { user?: unknown } }) => Boolean(req.user),
  update: ({ req }: { req: { user?: unknown } }) => Boolean(req.user),
  delete: ({ req }: { req: { user?: unknown } }) => Boolean(req.user),
};

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Admin user", plural: "Admin users" },
  auth: true,
  admin: { useAsTitle: "email", group: "Settings" },
  fields: [{ name: "name", type: "text" }],
};

export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Photo", plural: "Photos" },
  access: { ...editorAccess },
  admin: { group: "Library", description: "Every photo used on the site. Upload here, or directly from any image field." },
  hooks: collectionHooks,
  upload: {
    staticDir: "media",
    mimeTypes: ["image/*"],
    // The site uses next/image, which resizes on request; one sensible
    // ceiling keeps phone uploads from storing 12-megapixel originals.
    resizeOptions: { width: 2400, height: 2400, fit: "inside", withoutEnlargement: true },
    formatOptions: { format: "webp", options: { quality: 86 } },
  },
  fields: [
    {
      name: "alt",
      label: "Description",
      type: "text",
      required: true,
      admin: { description: "What the photo shows. Read aloud to blind visitors and used by Google." },
    },
  ],
};

/* ---------------------------------------------------------------- events */

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Event", plural: "Events" },
  access: editorAccess,
  hooks: collectionHooks,
  defaultSort: "-date",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "date", "isPlaceholder"],
    description: "Upcoming and past events. Past events move to the archive automatically after their date.",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar", description: "The web address, e.g. summer-camp-2027. Lowercase words joined by hyphens." },
    },
    {
      name: "isPlaceholder",
      label: "Sample / not a real event",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Ticked events show a 'not a scheduled event' marker and are hidden from Google." },
    },
    {
      type: "row",
      fields: [
        { name: "date", type: "date", required: true, admin: { width: "33%", date: { pickerAppearance: "dayOnly" } } },
        { name: "endDate", label: "End date (optional)", type: "date", admin: { width: "33%", date: { pickerAppearance: "dayOnly" } } },
        { name: "time", type: "text", admin: { width: "33%", description: "e.g. 5 – 7.30 pm" } },
      ],
    },
    { name: "location", type: "text", required: true, defaultValue: "Chelavoor, Kozhikode" },
    { name: "summary", type: "textarea", required: true, admin: { description: "One or two sentences for the event card." } },
    paragraphsField("description", "Description"),
    imageField("image", "Main photo", "EVENT IMAGE"),
    {
      name: "schedule",
      type: "array",
      admin: { description: "The programme, in order." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "time", type: "text", admin: { width: "30%" } },
            { name: "label", type: "text", required: true, admin: { width: "70%" } },
          ],
        },
      ],
    },
    {
      name: "info",
      label: "Key details",
      type: "array",
      admin: { description: "Short facts shown beside the description — Entry, Audience, Booking…" },
      fields: [
        {
          type: "row",
          fields: [
            { name: "label", type: "text", required: true, admin: { width: "35%" } },
            { name: "value", type: "text", required: true, admin: { width: "65%" } },
          ],
        },
      ],
    },
    { name: "gallery", type: "array", fields: [imageField("photo", "Photo", "EVENT IMAGE")] },
  ],
};

/* ------------------------------------------------------------------ blog */

export const blogCategories = ["Kalari", "Heritage", "Marma", "Training", "Wellness", "Culture"] as const;

const articleBlocks: Block[] = [
  { slug: "p", labels: { singular: "Paragraph", plural: "Paragraphs" }, fields: [{ name: "text", type: "textarea", required: true }] },
  { slug: "h2", labels: { singular: "Heading", plural: "Headings" }, fields: [{ name: "text", type: "text", required: true }] },
  { slug: "h3", labels: { singular: "Sub-heading", plural: "Sub-headings" }, fields: [{ name: "text", type: "text", required: true }] },
  {
    slug: "quote",
    labels: { singular: "Quote", plural: "Quotes" },
    fields: [
      { name: "text", type: "textarea", required: true },
      { name: "attribution", type: "text" },
    ],
  },
  {
    slug: "list",
    labels: { singular: "List", plural: "Lists" },
    fields: [
      linesField("items", "Items"),
      { name: "ordered", label: "Numbered list", type: "checkbox", defaultValue: false },
    ],
  },
  {
    slug: "image",
    labels: { singular: "Photo", plural: "Photos" },
    fields: [imageField("image", "Photo", "IMAGE"), { name: "caption", type: "text" }],
  },
  {
    slug: "cta",
    labels: { singular: "WhatsApp button", plural: "WhatsApp buttons" },
    fields: [
      { name: "heading", type: "text", required: true },
      { name: "label", label: "Button text", type: "text", required: true, defaultValue: "WhatsApp the academy" },
      { name: "message", label: "Pre-filled message", type: "textarea", required: true },
    ],
  },
];

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: { singular: "Journal article", plural: "Journal" },
  access: editorAccess,
  hooks: collectionHooks,
  defaultSort: "-publishedAt",
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "isDraft"],
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar", description: "The web address. Lowercase words joined by hyphens." },
    },
    {
      name: "isDraft",
      label: "Unreviewed draft",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Drafts show an 'unreviewed' note and are hidden from Google. Untick once the academy has approved the text.",
      },
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Show first on the Journal page." } },
    { name: "category", type: "select", required: true, options: blogCategories.map((c) => ({ label: c, value: c })) },
    { name: "excerpt", type: "textarea", required: true, admin: { description: "One or two sentences for the article card and Google." } },
    {
      type: "row",
      fields: [
        { name: "author", type: "text", required: true, defaultValue: "The Choorakkodi Journal", admin: { width: "40%" } },
        { name: "publishedAt", type: "date", required: true, admin: { width: "30%", date: { pickerAppearance: "dayOnly" } } },
        // Not `updatedAt`: Payload owns that field for its own edit timestamps.
        { name: "revisedAt", label: "Revised on", type: "date", admin: { width: "30%", date: { pickerAppearance: "dayOnly" } } },
      ],
    },
    { name: "readingMinutes", label: "Reading time (minutes)", type: "number", min: 1, defaultValue: 5 },
    imageField("image", "Cover photo", "IMAGE"),
    { name: "body", label: "Article", type: "blocks", blocks: articleBlocks, required: true },
  ],
};

/* ---------------------------------------------------------- testimonials */

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  access: editorAccess,
  hooks: collectionHooks,
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "meta", "isPlaceholder"],
    description: "Only publish words you have written permission to use. Keep healing stories to experience — no cure or diagnosis claims.",
  },
  fields: [
    { name: "quote", type: "textarea", required: true },
    { name: "name", type: "text", required: true },
    { name: "meta", label: "Line under the name", type: "text", admin: { description: "e.g. Student · 4 years, or Parent of a junior student" } },
    { name: "story", label: "Longer story", type: "textarea", admin: { description: "Shown on the Testimonials page." } },
    imageField("image", "Portrait", "PORTRAIT"),
    {
      name: "isPlaceholder",
      label: "Sample / not a real testimonial",
      type: "checkbox",
      defaultValue: false,
      admin: { position: "sidebar", description: "Samples carry a visible marker and are never sent to Google as reviews." },
    },
    { name: "order", type: "number", admin: { position: "sidebar", description: "Lower numbers show first." } },
  ],
};

/* --------------------------------------------------------------- gallery */

export const galleryCategories = ["Training", "Weapons", "Kalari", "Marma", "Heritage", "People"] as const;

export const Gallery: CollectionConfig = {
  slug: "gallery",
  labels: { singular: "Gallery photo", plural: "Gallery" },
  access: editorAccess,
  hooks: collectionHooks,
  admin: {
    group: "Content",
    useAsTitle: "caption",
    defaultColumns: ["caption", "category", "onHome", "order"],
  },
  fields: [
    imageField("image", "Photo", "IMAGE"),
    { name: "caption", type: "text", required: true },
    {
      type: "row",
      fields: [
        { name: "category", type: "select", required: true, options: galleryCategories.map((c) => ({ label: c, value: c })), admin: { width: "34%" } },
        {
          name: "ratio",
          label: "Shape",
          type: "select",
          required: true,
          defaultValue: "landscape",
          options: [
            { label: "Landscape", value: "landscape" },
            { label: "Portrait", value: "portrait" },
            { label: "Square", value: "square" },
            { label: "Tall", value: "tall" },
            { label: "Wide", value: "wide" },
          ],
          admin: { width: "33%", description: "How much space the photo takes in the grid." },
        },
        { name: "year", type: "text", admin: { width: "33%", description: "Only if known. 'circa 1970s' is fine." } },
      ],
    },
    { name: "onHome", label: "Show in the home-page teaser", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "order", type: "number", admin: { position: "sidebar", description: "Lower numbers show first." } },
  ],
};

export const collections = [Users, Media, Events, Posts, Testimonials, Gallery];
