import { ArrowUpRight, ExternalLink, Feather, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/components/brand/BrandMark";

export function AdminLogo() {
  return (
    <div className="studio-brand studio-brand--login" aria-label="Choorakkodi Studio">
      <BrandMark className="studio-brand__mark" />
      <div>
        <strong>CHOORAKKODI</strong>
        <span>THE CONTENT STUDIO</span>
      </div>
    </div>
  );
}

export function AdminIcon() {
  return <BrandMark className="studio-header-mark" />;
}

export function LoginWelcome() {
  return (
    <div className="studio-login-welcome">
      <span className="studio-eyebrow"><Feather size={14} aria-hidden="true" /> A legacy, in your hands</span>
      <h1>Welcome back.</h1>
      <p>A little care. A new story. Keep the academy’s world up to date.</p>
    </div>
  );
}

export function LoginFooter() {
  return (
    <div className="studio-login-footer">
      <span><ShieldCheck size={15} aria-hidden="true" /> Your private academy workspace</span>
      <Link href="/">Back to the website <ArrowUpRight size={14} aria-hidden="true" /></Link>
    </div>
  );
}

export function ViewWebsite() {
  return (
    <a className="studio-website-link" href="/" target="_blank" rel="noopener noreferrer" aria-label="View website (opens in a new tab)">
      <span>View website</span><ExternalLink size={14} aria-hidden="true" />
      <span className="studio-sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function NavFooter() {
  return (
    <div className="studio-nav-footer">
      <span className="studio-nav-footer__symbol"><Feather size={17} aria-hidden="true" /></span>
      <div><strong>Small updates. Lasting stories.</strong><p>Made for the people behind the academy.</p></div>
    </div>
  );
}
