"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { useConfig } from "@payloadcms/ui";
import { BrandMark } from "@/components/brand/BrandMark";

export function NavIntro() {
  const pathname = usePathname();
  const { config } = useConfig();
  const adminPath = config.routes.admin;
  const active = pathname === adminPath || pathname === `${adminPath}/`;

  return (
    <div className="studio-nav-intro">
      <Link className="studio-brand studio-brand--nav" href={adminPath} aria-label="Choorakkodi Studio home">
        <BrandMark className="studio-brand__mark" tone="reverse" />
        <div><strong>CHOORAKKODI</strong><span>CONTENT STUDIO</span></div>
      </Link>
      <span className="studio-workspace-label">YOUR WORKSPACE</span>
      <Link className={`studio-dashboard-link${active ? " studio-dashboard-link--active" : ""}`} href={adminPath} aria-current={active ? "page" : undefined}>
        <LayoutDashboard size={18} strokeWidth={1.6} aria-hidden="true" />
        <span>Overview</span>
        {active && <span className="studio-dashboard-link__dot" />}
      </Link>
    </div>
  );
}
