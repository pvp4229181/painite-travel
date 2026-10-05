"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { mainNav, site } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState(null);

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
  const sectionActive = (item) => isActive(item.href) || item.children?.some((c) => isActive(c.href));

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

        <nav
          aria-label="Main"
          className="hidden items-center gap-8 lg:flex"
          onMouseLeave={() => setDropdown(null)}
          onKeyDown={(e) => e.key === "Escape" && setDropdown(null)}
        >
          {mainNav.map((item) => (
            <div
              key={item.href}
              className="relative"
              onMouseEnter={() => setDropdown(item.children ? item.label : null)}
              onFocus={() => setDropdown(item.children ? item.label : null)}
              onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setDropdown(null)}
            >
              <Link
                href={item.href}
                onClick={() => setDropdown(null)}
                aria-haspopup={item.children ? "true" : undefined}
                aria-expanded={item.children ? dropdown === item.label : undefined}
                className={cn(
                  "relative flex items-center gap-1.5 py-2 text-[13px] text-ivory/90 transition-colors hover:text-ivory",
                  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-ivory/70 after:transition-transform after:duration-500",
                  sectionActive(item) ? "text-ivory after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100",
                )}
              >
                {item.label}
                {item.children && (
                  <ChevronDown
                    className={cn("size-3.5 opacity-60 transition-transform duration-300", dropdown === item.label && "rotate-180")}
                    strokeWidth={1.5}
                  />
                )}
              </Link>
              <AnimatePresence>
                {item.children && dropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-full left-0 w-64 pt-3"
                  >
                    <ul className="border border-ivory/10 bg-ink/95 p-2 shadow-2xl backdrop-blur-md">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setDropdown(null)}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={cn(
                              "block px-4 py-2.5 text-[13px] transition-colors hover:bg-ivory/5 hover:text-gold",
                              pathname === child.href ? "text-gold" : "text-ivory/80",
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <Link
          href="/plan-your-journey"
          className="group hidden items-center gap-3 border border-ivory/40 bg-ivory px-4 py-2.5 text-[12.5px] text-ink transition-colors hover:border-gold hover:bg-gold hover:text-ink lg:inline-flex"
        >
          Enquire Privately
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
          // Explicit height: the header's backdrop-filter makes it the containing block for
          // fixed children, so bottom-0 would collapse this panel to the header's height.
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] h-[calc(100dvh-72px)] overflow-y-auto bg-ink lg:hidden"
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
                <div className="border-b border-ivory/10 py-4">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn("block font-serif text-3xl", sectionActive(item) ? "text-gold" : "text-ivory")}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="mt-3 border-l border-ivory/15 pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className={cn("block py-1.5 text-[14px]", pathname === child.href ? "text-gold" : "text-ivory/70")}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                </motion.div>
              ))}
              <Link
                href="/plan-your-journey"
                onClick={() => setMenuOpen(false)}
                className="mt-10 inline-flex items-center justify-center gap-3 bg-gold px-6 py-4 text-sm text-ink"
              >
                Enquire Privately <ArrowRight className="size-4" strokeWidth={1.5} />
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
