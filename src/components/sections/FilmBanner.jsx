"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { Reveal } from "@/lib/motion";

const filmSrc = "/videos/painite-travel-film.mp4?v=20261006-clean";
const poster = "/images/cleaned/destinations/maldives.webp";

export default function FilmBanner() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const syncPlayback = () => {
      if (preference.matches || !visible || document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.1 });
    observer.observe(sectionRef.current);
    preference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      video.pause();
    };
  }, []);

  return (
    <section ref={sectionRef} aria-label="The Painite travel film" className="relative isolate overflow-hidden bg-ink text-ivory">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Image quality={90} src={poster} alt="" fill sizes="100vw" className="object-cover" />
        <video ref={videoRef} src={filmSrc} poster={poster} muted loop playsInline preload="none"
          className="absolute inset-0 size-full object-cover motion-reduce:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/10" />
      </div>
      <div className="container-luxe flex min-h-[520px] flex-col justify-center py-24 md:min-h-[640px] md:py-32">
        <Reveal as="p" className="eyebrow mb-6 text-gold-soft">The Painite film</Reveal>
        <Reveal as="h2" className="max-w-2xl font-serif text-[clamp(2.8rem,5.5vw,5.5rem)] leading-[1.06] tracking-[-0.025em] [text-wrap:balance]">
          This is how we believe travel should feel.
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">
          From palace courtyards to Himalayan mornings and the quiet of the Indian Ocean.
        </Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-5 border-t border-ivory/25 pt-5">
          <p className="text-xs leading-relaxed tracking-[0.1em] text-ivory/80">India · Nepal · Bhutan · Sri Lanka · Maldives</p>
        </div>
      </div>
    </section>
  );
}
