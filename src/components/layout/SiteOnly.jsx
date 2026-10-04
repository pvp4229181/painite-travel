"use client";

import { usePathname } from "next/navigation";

/** Renders the public site chrome (header, footer, etc.) everywhere except the admin. */
export default function SiteOnly({ children }) {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ? null : children;
}
