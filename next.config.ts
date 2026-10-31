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
  // The Our Legacy page is folded into the homepage for now; its route is
  // kept in src/app so it can come back.
  async redirects() {
    return [{ source: "/about", destination: "/", permanent: false }];
  },
  // Without PAYLOAD_SECRET the CMS is off, and its routes would crash with a
  // 500. Send them to the catch-all so they get the normal 404 page instead.
  async rewrites() {
    if (process.env.PAYLOAD_SECRET) return [];
    return {
      beforeFiles: [
        { source: "/admin/:path*", destination: "/cms-disabled" },
        { source: "/api/:path*", destination: "/cms-disabled" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
