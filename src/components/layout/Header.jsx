"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { mainNav, site } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
        scrolled || menuOpen
          ? "border-b border-ivory/5 bg-ink/92 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-luxe flex h-[72px] items-center justify-between">
        <Logo priority />

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative py-2 text-[13px] text-ivory/90 transition-colors hover:text-ivory",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ivory/70 after:transition-transform after:duration-500",
                isActive(item.href) ? "text-ivory after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/plan-your-journey"
          className="group hidden items-center gap-3 border border-ivory/40 bg-ivory px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-gold hover:bg-gold hover:text-ink lg:inline-flex"
        >
          Plan your journey
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Link>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center text-ivory lg:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] bottom-0 overflow-y-auto bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav aria-label="Mobile" className="container-luxe flex flex-col pt-8 pb-12">
              {mainNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "block border-b border-ivory/10 py-4 font-serif text-3xl",
                      isActive(item.href) ? "text-gold" : "text-ivory",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/plan-your-journey"
                onClick={() => setMenuOpen(false)}
                className="mt-10 inline-flex items-center justify-center gap-3 bg-gold px-6 py-4 text-sm text-ink"
              >
                Plan your journey <ArrowRight className="size-4" strokeWidth={1.5} />
              </Link>
              <div className="mt-10 space-y-2 text-sm text-ivory/70">
                <a href={`mailto:${site.email}`} className="block">
                  {site.email}
                </a>
                <a href={site.phoneHref} className="block">
                  {site.phone}
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
