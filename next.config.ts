import path from "node:path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root. Without it Turbopack walks up and finds an
  // unrelated lockfile in the home directory.
  turbopack: { root: path.resolve(process.cwd()) },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    // Photos uploaded in the admin are served by Payload from /api/media/file.
    localPatterns: [{ pathname: "/api/media/file/**" }, { pathname: "/images/**" }],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
