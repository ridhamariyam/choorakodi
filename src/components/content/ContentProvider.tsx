"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Site } from "@/data/site";
import type { NavItem } from "@/data/navigation";

/**
 * The slice of CMS content that client components need on every page: the
 * academy's details (WhatsApp links, address in the menu) and the main menu.
 * Everything else is passed down as props from server components, so page
 * content is not serialised into every route's payload.
 */
export type ClientContent = { site: Site; primaryNav: NavItem[] };

const ContentContext = createContext<ClientContent | null>(null);

export function ContentProvider({ value, children }: { value: ClientContent; children: ReactNode }) {
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

function useClientContent(): ClientContent {
  const value = useContext(ContentContext);
  if (!value) throw new Error("useSite/usePrimaryNav must be used inside <ContentProvider>.");
  return value;
}

export function useSite(): Site {
  return useClientContent().site;
}

export function usePrimaryNav(): NavItem[] {
  return useClientContent().primaryNav;
}
