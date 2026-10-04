"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { BookOpen, ExternalLink, Inbox, LayoutDashboard, LogOut, MapPin, Menu, Route, Sparkles, X } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview", Icon: LayoutDashboard, exact: true },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox, badge: "enquiries" },
  { href: "/admin/journeys", label: "Journeys", Icon: Route },
  { href: "/admin/destinations", label: "Destinations", Icon: MapPin },
  { href: "/admin/experiences", label: "Experiences", Icon: Sparkles },
  { href: "/admin/journal", label: "Journal", Icon: BookOpen },
];

export default function AdminShell({ email, newEnquiries = 0, children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const active = (item) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  async function signOut() {
    await axios.post("/api/admin/logout").catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex flex-col items-start px-6 pt-7 pb-8" onClick={() => setOpen(false)}>
        <LogoMark className="h-12 sm:h-12" />
        <span className="mt-2 text-[9px] tracking-[0.42em] text-gold">ADMIN</span>
      </Link>
      <nav aria-label="Admin" className="flex-1 space-y-0.5 px-3">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active(item) ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
              active(item) ? "bg-ivory/10 text-ivory" : "text-ivory/65 hover:bg-ivory/5 hover:text-ivory",
            )}
          >
            <item.Icon className="size-4" strokeWidth={1.5} />
            <span className="flex-1">{item.label}</span>
            {item.badge && newEnquiries > 0 && (
              <span className="rounded-full bg-terracotta px-2 py-0.5 text-[11px] text-ivory">{newEnquiries}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 border-t border-ivory/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-[13px] text-ivory/65 hover:bg-ivory/5 hover:text-ivory"
        >
          <ExternalLink className="size-4" strokeWidth={1.5} /> View website
        </a>
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] text-ivory/65 hover:bg-ivory/5 hover:text-ivory"
        >
          <LogOut className="size-4" strokeWidth={1.5} /> Sign out
        </button>
        <p className="truncate px-3 pt-2 text-[11.5px] text-ivory/40" title={email}>
          {email}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-cream-soft text-text">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 bg-ink lg:block">{sidebar}</aside>

      <div className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 lg:hidden">
        <Link href="/admin" className="flex items-center">
          <LogoMark className="h-8 sm:h-8" />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 items-center justify-center text-ivory"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
