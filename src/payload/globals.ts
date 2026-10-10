import type { Field, GlobalConfig } from "payload";
import {
  captionField,
  colorField,
  imageField,
  linesField,
  pageHeaderFields,
  paragraphsField,
  pendingField,
} from "./fields";
import { globalHooks } from "./revalidate";

const access = {
  read: () => true,
  update: ({ req }: { req: { user?: unknown } }) => Boolean(req.user),
};

function page(slug: string, label: string, fields: Field[], description?: string): GlobalConfig {
  return { slug, label, access, hooks: globalHooks, admin: { group: "Pages", description }, fields };
}

const indexedItems = (name: string, label: string): Field => ({
  name,
  label,
  type: "array",
  fields: [
    {
      type: "row",
      fields: [
        { name: "index", type: "text", admin: { width: "15%", description: "e.g. 01" } },
        { name: "title", type: "text", required: true, admin: { width: "85%" } },
      ],
    },
    { name: "body", type: "textarea" },
  ],
});

const faqField = (name = "faq", label = "Questions & answers"): Field => ({
  name,
  label,
  type: "array",
  admin: { description: "Shown as an expandable list, and sent to Google as FAQ results." },
  fields: [
    { name: "question", type: "text", required: true },
    { name: "answer", type: "textarea", required: true },
    {
      name: "pending",
      label: "Answer still needs confirming",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Ticked answers carry a small 'pending' marker and are left out of Google's FAQ data." },
    },
  ],
});

const titled = (name: string, label: string, fields: Field[]): Field => ({
  name,
  label,
  type: "group",
  fields: [{ name: "title", type: "text" }, ...fields],
});

/* ---------------------------------------------------------------- site */

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Academy details",
  access,
  hooks: globalHooks,
  admin: {
    group: "Settings",
    description: "Name, contact details, timings and menus. These appear on every page and in Google's business listing.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "name", label: "Full name", type: "text", required: true },
            {
              type: "row",
              fields: [
                { name: "shortName", label: "Short name", type: "text", required: true, admin: { width: "50%" } },
                { name: "wordmark", type: "text", required: true, admin: { width: "50%", description: "The name in the header and footer." } },
              ],
            },
            { name: "tagline", type: "text" },
            { name: "description", label: "Google description", type: "textarea", admin: { description: "The default summary search engines show. About 150 characters." } },
            { name: "foundedYear", label: "Founded", type: "number", required: true },
            {
              name: "founder",
              type: "group",
              fields: [
                { name: "name", type: "text", required: true },
                { name: "fullName", label: "Full name", type: "text" },
                { name: "role", type: "text" },
              ],
            },
          ],
        },
        {
          label: "Contact",
          name: "contact",
          fields: [
            {
              type: "row",
              fields: [
                { name: "phone", type: "text", admin: { width: "50%", description: "As it should be printed, e.g. +91 96057 30952" } },
                {
                  name: "whatsapp",
                  label: "WhatsApp number",
                  type: "text",
                  admin: {
                    width: "50%",
                    description: "Digits only, with country code, e.g. 919605730952. Every WhatsApp button uses this — while empty they open the Contact page instead.",
                  },
                  validate: (v: unknown) => !v || /^\d{10,15}$/.test(String(v)) || "Digits only, including 91 at the start.",
                },
              ],
            },
            { name: "email", type: "email" },
            {
              name: "address",
              type: "group",
              fields: [
                { name: "street", type: "text" },
                {
                  type: "row",
                  fields: [
                    { name: "locality", label: "City", type: "text", required: true, admin: { width: "34%" } },
                    { name: "region", label: "State", type: "text", required: true, admin: { width: "33%" } },
                    { name: "postalCode", label: "PIN code", type: "text", admin: { width: "33%" } },
                  ],
                },
              ],
            },
            {
              name: "openingHours",
              label: "Timings",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "days", type: "text", required: true, admin: { width: "35%", description: "e.g. Classes · Mon – Sat" } },
                    { name: "hours", type: "text", required: true, admin: { width: "65%" } },
                  ],
                },
              ],
            },
            { name: "mapEmbedSrc", label: "Map embed link", type: "text", admin: { description: "Google Maps → Share → Embed a map → copy only the src=\"…\" link." } },
            { name: "mapDirectionsUrl", label: "Directions link", type: "text", admin: { description: "Google Maps → Share → Copy link." } },
          ],
        },
        {
          label: "Social",
          fields: [
            {
              name: "social",
              type: "array",
              admin: { description: "Instagram, Facebook, YouTube… Shown in the footer and sent to Google." },
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "25%", description: "e.g. Instagram" } },
                    { name: "handle", type: "text", required: true, admin: { width: "25%", description: "e.g. @choorakkodi" } },
                    { name: "href", label: "Link", type: "text", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Menus",
          fields: [
            {
              name: "primaryNav",
              label: "Main menu",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "35%" } },
                    { name: "href", label: "Link", type: "text", required: true, admin: { width: "35%", description: "e.g. /about" } },
                    { name: "meta", label: "Small note", type: "text", admin: { width: "30%" } },
                  ],
                },
              ],
            },
            {
              name: "footerNav",
              label: "Footer links",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "50%" } },
                    { name: "href", label: "Link", type: "text", required: true, admin: { width: "50%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Page not found",
          name: "notFound",
          fields: [
            linesField("heading", "Heading", "One line per row."),
            { name: "sub", label: "Sub-heading", type: "text" },
            { name: "body", type: "textarea" },
          ],
        },
      ],
    },
  ],
};

/* --------------------------------------------------------- home chronicle */

const faces = [
  { label: "Bodoni (classic serif)", value: "bodoni" },
  { label: "Anton (tall condensed)", value: "anton" },
  { label: "Shrikhand (heavy italic)", value: "shrikhand" },
  { label: "Archivo Black (bold)", value: "archivo" },
  { label: "Unbounded (wide)", value: "unbounded" },
  { label: "Syne (geometric)", value: "syne" },
];

const photoLayoutFields: Field[] = [
  {
    type: "row",
    fields: [
      { name: "x", label: "Left (%)", type: "number", required: true, defaultValue: 10, admin: { width: "20%", description: "0 = left edge" } },
      { name: "y", label: "Down", type: "number", required: true, defaultValue: 0, admin: { width: "20%" } },
      { name: "w", label: "Width (%)", type: "number", required: true, defaultValue: 26, admin: { width: "20%" } },
      { name: "rotate", label: "Tilt (°)", type: "number", required: true, defaultValue: 0, admin: { width: "20%" } },
      { name: "speed", label: "Drift", type: "number", required: true, defaultValue: 0.4, min: 0, max: 1, admin: { width: "20%", step: 0.05, description: "0 – 1" } },
    ],
  },
];

const chapterFields: Field[] = [
  {
    type: "row",
    fields: [
      // Not `id`: Payload gives every array row its own id.
      { name: "key", label: "Key", type: "text", required: true, admin: { width: "20%", description: "Short unique name, e.g. gurus" } },
      { name: "marker", label: "Big marker", type: "text", required: true, admin: { width: "20%", description: "A year or a word. 'Year to verify' sets the chapter beside its photo instead" } },
      { name: "kicker", label: "Small label", type: "text", admin: { width: "35%" } },
      { name: "counter", label: "Year counter", type: "text", required: true, admin: { width: "25%", description: "Year in the corner" } },
    ],
  },
  {
    type: "row",
    fields: [
      { name: "face", label: "Marker typeface", type: "select", required: true, defaultValue: "bodoni", options: faces, admin: { width: "34%" } },
      {
        name: "tone",
        label: "Text colour",
        type: "select",
        required: true,
        defaultValue: "light",
        options: [
          { label: "Dark text (light background)", value: "light" },
          { label: "Light text (dark background)", value: "dark" },
        ],
        admin: { width: "33%" },
      },
      {
        name: "trail",
        label: "Dotted trail bends",
        type: "select",
        required: true,
        defaultValue: "left",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
        admin: { width: "33%" },
      },
    ],
  },
  { type: "row", fields: [colorField("bg", "Background"), colorField("disc", "Disc behind the marker")] },
  captionField(),
  {
    name: "photos",
    type: "array",
    admin: { description: "Framed prints scattered around the chapter. Position is in % of the screen width." },
    fields: [imageField("image", "Photo", "IMAGE"), ...photoLayoutFields],
  },
  {
    name: "silhouette",
    label: "Silhouette object",
    type: "group",
    fields: [
      {
        name: "kind",
        label: "Object",
        type: "select",
        options: [
          { label: "None", value: "none" },
          { label: "Lamp", value: "lamp" },
          { label: "Staff", value: "staff" },
          { label: "Shield", value: "shield" },
          { label: "Sword", value: "sword" },
          { label: "Fish (logo)", value: "fish" },
        ],
        defaultValue: "none",
      },
      {
        type: "row",
        admin: { condition: (_, sibling) => Boolean(sibling?.kind && sibling.kind !== "none") },
        fields: [
          { name: "x", label: "Left (%)", type: "number", defaultValue: 40, admin: { width: "20%" } },
          { name: "y", label: "Down", type: "number", defaultValue: 0, admin: { width: "20%" } },
          { name: "w", label: "Width (%)", type: "number", defaultValue: 8, admin: { width: "20%" } },
          { name: "rotate", label: "Tilt (°)", type: "number", defaultValue: 0, admin: { width: "20%" } },
          { name: "spin", label: "Spin on scroll (°)", type: "number", admin: { width: "20%" } },
        ],
      },
    ],
  },
];

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Home page",
  access,
  hooks: globalHooks,
  admin: {
    group: "Pages",
    description:
      "The scrolling chronicle from 1960 to today. Chapters play in the order listed. The opening film above it is fixed artwork and is changed by the developer.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Opening",
          name: "intro",
          fields: [
            {
              name: "heading",
              label: "Page heading (for Google and screen readers)",
              type: "text",
              required: true,
              admin: { description: "Not printed on screen — the opening film carries no words." },
            },
            {
              type: "row",
              fields: [
                { name: "year", label: "Start year", type: "text", required: true, admin: { width: "33%" } },
                { name: "end", label: "End year", type: "text", required: true, admin: { width: "33%" } },
                { name: "counter", label: "First counter year", type: "text", required: true, admin: { width: "34%" } },
              ],
            },
            colorField("bg", "Ground colour after the film"),
          ],
        },
        {
          label: "Chapters · before the styles",
          fields: [{ name: "chapters", label: "Chapters", type: "array", fields: chapterFields }],
        },
        {
          label: "The four styles",
          name: "mura",
          fields: [
            { type: "row", fields: [colorField("bg", "Background"), { name: "counter", label: "Year counter", type: "text", required: true }] },
            {
              name: "rows",
              label: "Sliding rows",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "first", label: "Dark word", type: "text", required: true, admin: { width: "40%" } },
                    { name: "second", label: "Light word", type: "text", required: true, admin: { width: "30%" } },
                    {
                      name: "direction",
                      label: "Slides",
                      type: "select",
                      required: true,
                      defaultValue: "1",
                      options: [
                        { label: "Left → right", value: "1" },
                        { label: "Right → left", value: "-1" },
                      ],
                      admin: { width: "30%" },
                    },
                  ],
                },
              ],
            },
            captionField(),
          ],
        },
        {
          label: "Chapters · after the styles",
          fields: [{ name: "laterChapters", label: "Chapters", type: "array", fields: chapterFields }],
        },
        {
          label: "Affiliations",
          fields: [linesField("affiliations", "Affiliations", "One organisation per line.")],
        },
        {
          label: "Programmes",
          name: "programmes",
          fields: [
            { type: "row", fields: [colorField("bg", "Background"), { name: "counter", label: "Year counter", type: "text", required: true }] },
            linesField("title", "Big title", "One line per row."),
            { name: "note", type: "text" },
            {
              name: "items",
              label: "Programme cards",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "kicker", label: "Small label", type: "text", admin: { width: "30%" } },
                    { name: "title", type: "text", required: true, admin: { width: "40%" } },
                    { name: "href", label: "Link", type: "text", required: true, admin: { width: "30%", description: "e.g. /admissions" } },
                  ],
                },
                { name: "detail", type: "textarea" },
                imageField("image", "Photo", "IMAGE"),
              ],
            },
          ],
        },
      ],
    },
  ],
};

/* --------------------------------------------------------- inner pages */

export const SharedSections = page(
  "shared-sections",
  "Shared sections",
  [
    {
      type: "tabs",
      tabs: [
        {
          label: "Legacy intro",
          name: "homeIntro",
          fields: [
            { name: "eyebrow", type: "text" },
            linesField("heading", "Heading", "One line per row."),
            paragraphsField("body", "Body"),
            pendingField(),
            imageField("image", "Large photo", "KALARI IMAGE"),
            imageField("secondaryImage", "Small photo", "TRAINING IMAGE"),
          ],
        },
        {
          label: "Founder",
          name: "founder",
          fields: [
            { name: "eyebrow", type: "text" },
            { name: "name", type: "text", required: true },
            linesField("heading", "Heading", "One line per row."),
            { name: "intro", label: "Biography", type: "textarea" },
            pendingField(),
            imageField("image", "Portrait", "FOUNDER IMAGE"),
            {
              name: "facts",
              type: "array",
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "label", type: "text", required: true, admin: { width: "40%" } },
                    { name: "value", type: "text", required: true, admin: { width: "60%" } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Why Choorakkodi",
          name: "pillars",
          fields: [
            { name: "eyebrow", type: "text" },
            linesField("heading", "Heading", "One line per row."),
            indexedItems("items", "Pillars"),
          ],
        },
      ],
    },
  ],
  "Sections that appear on more than one page: the legacy introduction, the founder, and 'Why Choorakkodi'.",
);

export const AboutPage = page("about-page", "About · Our legacy", [
  {
    type: "tabs",
    tabs: [
      {
        label: "Page",
        name: "about",
        fields: [
          ...pageHeaderFields(),
          {
            name: "sections",
            type: "array",
            fields: [{ name: "title", type: "text", required: true }, { name: "body", type: "textarea" }, pendingField()],
          },
          imageField("portrait", "Portrait", "FOUNDER IMAGE"),
          imageField("archival", "Archive photo", "HISTORICAL IMAGE"),
          imageField("wide", "Wide photo", "KALARI IMAGE"),
          {
            name: "recognition",
            label: "Recognition & press",
            type: "group",
            fields: [
              { name: "title", type: "text" },
              linesField("items", "Items", "One award, affiliation or appearance per line."),
              pendingField(),
            ],
          },
        ],
      },
      {
        label: "Timeline",
        fields: [
          {
            name: "timeline",
            type: "array",
            admin: { description: "The years on the About page and in the legacy timeline." },
            fields: [
              {
                type: "row",
                fields: [
                  { name: "year", type: "text", required: true, admin: { width: "25%" } },
                  { name: "title", type: "text", required: true, admin: { width: "75%" } },
                ],
              },
              { name: "lead", label: "Summary", type: "textarea" },
              pendingField(),
              imageField("image", "Photo", "HISTORICAL IMAGE"),
            ],
          },
        ],
      },
    ],
  },
]);

export const KalarippayattuPage = page("kalarippayattu-page", "Kalarippayattu", [
  {
    type: "tabs",
    tabs: [
      {
        label: "Page",
        name: "page",
        fields: [
          ...pageHeaderFields(),
          titled("what", "What is Kalarippayattu?", [paragraphsField("body", "Body")]),
          titled("style", "The Choorakkodi style", [{ name: "body", type: "textarea" }, pendingField()]),
          {
            name: "stages",
            type: "array",
            fields: [
              {
                type: "row",
                fields: [
                  { name: "index", type: "text", admin: { width: "15%", description: "e.g. 01" } },
                  { name: "name", type: "text", required: true, admin: { width: "45%", description: "e.g. Meythari" } },
                  { name: "translation", type: "text", admin: { width: "40%", description: "e.g. Body work" } },
                ],
              },
              { name: "body", type: "textarea" },
            ],
          },
          titled("learn", "What students learn", [linesField("items", "Items")]),
          titled("who", "Who can join", [{ name: "body", type: "textarea" }, pendingField()]),
          titled("schedule", "Schedules", [linesField("items", "Timings", "One line per batch or timing."), pendingField()]),
          titled("fees", "Fees", [pendingField()]),
          {
            name: "images",
            type: "group",
            fields: [
              imageField("hero", "Opening photo", "TRAINING IMAGE"),
              imageField("stage", "Stages photo", "TRAINING IMAGE"),
              imageField("wide", "Wide photo", "TRAINING IMAGE"),
              imageField("detail", "Detail photo", "WEAPONS IMAGE"),
            ],
          },
        ],
      },
      { label: "Questions", fields: [faqField()] },
    ],
  },
]);

export const MarmaPage = page("marma-page", "Marma healing", [
  {
    type: "tabs",
    tabs: [
      {
        label: "Page",
        name: "page",
        fields: [
          ...pageHeaderFields(),
          titled("what", "What is marma?", [paragraphsField("body", "Body")]),
          titled("tradition", "The tradition", [paragraphsField("body", "Body")]),
          titled("points", "The vital points", [
            { name: "body", type: "textarea" },
            { name: "note", type: "textarea" },
            {
              name: "regions",
              type: "array",
              admin: { description: "The body-map regions. The key must stay one of: head, torso, back, arms, legs." },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "region",
                      label: "Key",
                      type: "select",
                      required: true,
                      options: ["head", "torso", "back", "arms", "legs"].map((v) => ({ label: v, value: v })),
                      admin: { width: "25%" },
                    },
                    { name: "label", type: "text", required: true, admin: { width: "35%" } },
                    { name: "blurb", type: "text", admin: { width: "40%" } },
                  ],
                },
              ],
            },
          ]),
          titled("healing", "Healing", [paragraphsField("body", "Body")]),
          titled("consultation", "Consultation", [{ name: "body", type: "textarea" }, pendingField()]),
          {
            name: "disclaimer",
            type: "textarea",
            required: true,
            admin: { description: "Legal wording. Take advice before changing it." },
          },
          imageField("image", "Photo", "MARMA IMAGE"),
        ],
      },
      { label: "Questions", fields: [faqField()] },
    ],
  },
]);

export const AdmissionsPage = page("admissions-page", "Admissions", [
  {
    type: "tabs",
    tabs: [
      {
        label: "Page",
        name: "page",
        fields: [
          ...pageHeaderFields(),
          indexedItems("steps", "Steps"),
          titled("who", "Who can join", [{ name: "body", type: "textarea" }, pendingField()]),
          titled("bring", "What to bring", [linesField("items", "Items")]),
          { name: "scheduleTitle", label: "Schedule heading", type: "text" },
          linesField("scheduleItems", "Timings", "One line per batch or timing."),
          pendingField("schedulePending", "Schedule pending note"),
          { name: "feesTitle", label: "Fees heading", type: "text" },
          pendingField("feesPending", "Fees pending note"),
        ],
      },
      { label: "Questions", fields: [faqField()] },
    ],
  },
]);

export const HeritagePage = page("heritage-page", "Heritage", [
  ...pageHeaderFields(),
  { name: "method", type: "textarea" },
  {
    name: "entries",
    label: "Archive entries",
    type: "array",
    fields: [
      {
        type: "row",
        fields: [
          { name: "key", label: "Key", type: "text", required: true, admin: { width: "20%" } },
          { name: "index", label: "Label", type: "text", admin: { width: "25%", description: "e.g. Archive 01" } },
          { name: "year", type: "text", admin: { width: "20%" } },
          { name: "title", type: "text", required: true, admin: { width: "35%" } },
        ],
      },
      { name: "caption", type: "textarea" },
      pendingField(),
      imageField("image", "Photo", "HISTORICAL IMAGE"),
    ],
  },
]);

export const ContactPage = page("contact-page", "Contact", pageHeaderFields(), "Address, phone and timings are in Settings → Academy details.");

export const DisciplinesPage = page("disciplines-page", "Disciplines", [
  {
    name: "disciplines",
    type: "array",
    fields: [
      {
        type: "row",
        fields: [
          { name: "slug", label: "Key", type: "text", required: true, admin: { width: "25%" } },
          { name: "index", type: "text", admin: { width: "15%" } },
          { name: "title", type: "text", required: true, admin: { width: "30%" } },
          { name: "subtitle", type: "text", admin: { width: "30%" } },
        ],
      },
      { name: "eyebrow", type: "text" },
      { name: "summary", type: "textarea" },
      pendingField(),
      linesField("highlights", "Highlights"),
      imageField("image", "Photo", "TRAINING IMAGE"),
    ],
  },
]);

export const globals = [
  SiteSettings,
  Homepage,
  SharedSections,
  AboutPage,
  KalarippayattuPage,
  MarmaPage,
  AdmissionsPage,
  HeritagePage,
  ContactPage,
  DisciplinesPage,
];
