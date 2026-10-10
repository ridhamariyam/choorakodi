import { ImageResponse } from "next/og";
import { site as defaultSite } from "@/data/site";
import { getContent } from "@/lib/content";

export const alt = `${defaultSite.name} — Kalarippayattu in Kozhikode, Kerala`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card. Generated rather than authored so it can never drift
 * out of sync with the brand name or locality set in the admin.
 */
export default async function OpengraphImage() {
  const { site } = await getContent();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#101312",
          color: "#FFFFFF",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#C4A487" }}>
            Kalari · Heritage · {site.contact.address.locality}
          </span>
          <span style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#8A8175" }}>
            Est. {site.foundedYear}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 108, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            Choorakkodi
          </span>
          <span
            style={{
              fontSize: 40,
              fontWeight: 400,
              letterSpacing: -1,
              lineHeight: 1.2,
              color: "#8A8175",
              marginTop: 18,
            }}
          >
            Martial Arts Academy
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid rgba(245,241,232,0.18)",
            paddingTop: 28,
          }}
        >
          <span style={{ fontSize: 26, color: "#FFFFFF", opacity: 0.75 }}>
            The lineage lives on.
          </span>
          <span style={{ fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: "#0B5F5C" }}>
            ●
          </span>
        </div>
      </div>
    ),
    size,
  );
}
