import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import sharp from "sharp";

import { collections } from "./payload/collections";
import { globals } from "./payload/globals";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * The academy's CMS. It runs inside this same Next.js app — the site and the
 * admin (/admin) are one deployment — and keeps everything on that server:
 * content in a SQLite file, uploaded photos in /media.
 *
 * Both paths must sit on persistent disk. Back up the two together.
 */
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  admin: {
    user: "users",
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " — Choorakkodi admin" },
  },
  collections,
  globals,
  db: sqliteAdapter({
    client: { url: process.env.DATABASE_URI ?? "file:./data/choorakkodi.db" },
  }),
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  telemetry: false,
});
