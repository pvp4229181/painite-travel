"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import Landscape from "@/components/ui/Landscape";
import { Button } from "@/components/ui/Button";
import { destinations as starterDestinations } from "@/data/destinations";

const countryOrder = ["india", "nepal", "bhutan", "sri-lanka", "maldives"];

export default function Hero({ destinations: suppliedDestinations = starterDestinations }) {
  const destinations = countryOrder.map(slug => suppliedDestinations.find(item => item.slug === slug)).filter(Boolean);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const photoStrip = useRef(null);
  const previousActive = useRef(null);
  const heroVideo = useRef(null);

  useEffect(() => {
    const video = heroVideo.current;
    if (!video) return;
    if (paused || reducedMotion) video.pause();
    else video.play().catch(() => {});
  }, [active, paused, reducedMotion]);

  useEffect(() => {
    if (paused || destinations.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % destinations.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [active, paused, destinations.length]);

  useEffect(() => {
    const strip = photoStrip.current;
    const wrapping = active === 0 && previousActive.current === destinations.length - 1;
    const firstScroll = previousActive.current === null;
    const card = strip?.children[(wrapping ? destinations.length * 2 : destinations.length) + active];
    if (!card) return;
    previousActive.current = active;
    strip.scrollTo({
      left: card.offsetLeft,
      behavior: firstScroll || reducedMotion ? "instant" : "smooth",
    });
    if (wrapping) {
      const reset = setTimeout(() => {
        strip.scrollTo({ left: strip.children[destinations.length].offsetLeft, behavior: "instant" });
      }, 1000);
      return () => clearTimeout(reset);
    }
  }, [active, destinations.length, reducedMotion]);
  function selectDestination(index) {
    setActive(index);
  }
  const destination = destinations[active];

  return (
    <section aria-label="Explore our destinations" aria-roledescription="carousel" className="home-hero relative isolate flex flex-col overflow-hidden bg-ink text-ivory">
      <div className="absolute inset-0 -z-10">
      <AnimatePresence initial={false}>
      <motion.div key={destination.slug} className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0, scale: 1.04, zIndex: 1 }}
        animate={{ opacity: 1, scale: 1, zIndex: 1 }}
        exit={{ opacity: 0, zIndex: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}>

        <Landscape scene={destination.homeScene || destination.scene} priority />
        {!reducedMotion && <video
          ref={heroVideo}
          src={`/videos/hero/${destination.slug}.mp4${destination.slug === "india" ? "?v=2" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />}
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg,rgba(5,20,16,.68),rgba(5,20,16,.08) 80%),linear-gradient(180deg,rgba(5,20,16,.48),transparent 35%,rgba(5,20,16,.85))" }} />
      </motion.div>
      </AnimatePresence>
      </div>
      <div className="hero-stage relative flex flex-1 items-center pt-28 pb-12">
        <div className="container-luxe w-full">
          <div className="hero-copy">
            <p className="hero-eyebrow"><span className="h-px w-9 bg-gold-soft" /> PRIVATE JOURNEYS. EXTRAORDINARY PLACES.</p>
            <p className="hero-pretitle font-serif italic">Somewhere extraordinary.</p>
            <div className="hero-title relative overflow-hidden font-serif leading-none tracking-[-.04em]">
              <AnimatePresence initial={false}>
                <motion.h1 key={destination.slug} className="absolute inset-0"
                  initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}>{destination.name}</motion.h1>
              </AnimatePresence>
            </div>
            <motion.p key={`line-${destination.slug}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.5, delay: reducedMotion ? 0 : 0.2 }} className="mt-4 max-w-[360px] text-base leading-relaxed text-ivory/85">{destination.homeLine}</motion.p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Button className="!bg-ivory !text-ink hover:!bg-gold-soft" href={`/destinations/${destination.slug}`}>Discover {destination.name}</Button>
              <a href="/plan-your-journey" className="inline-flex min-h-11 items-center gap-2 border-b border-ivory/40 text-sm">Make it yours <ArrowUpRight size={16} strokeWidth={1.5} /></a>
            </div>
          </div>
        </div>
        <div className="hero-preview hidden lg:block">
        <div className="mb-4 flex items-center justify-between pr-8 text-[11px] tracking-[.2em] text-ivory/75"><span>FIND YOUR SOMEWHERE</span><span>{String(active + 1).padStart(2, "0")} / {String(destinations.length).padStart(2, "0")}</span></div>
        <div ref={photoStrip} className="hero-photo-strip relative flex gap-3 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[...destinations, ...destinations, ...destinations].map((item, position) => <button type="button" key={`${item.slug}-${position}`} aria-hidden={position < destinations.length || position >= destinations.length * 2 ? true : undefined} tabIndex={position < destinations.length || position >= destinations.length * 2 ? -1 : 0} aria-label={`Show ${item.name}`} aria-pressed={position % destinations.length === active} onClick={() => selectDestination(position % destinations.length)} className={`group relative isolate flex shrink-0 h-[290px] w-[200px] items-end overflow-hidden border p-4 text-left xl:h-[320px] xl:w-[220px] ${position % destinations.length === active ? "border-gold-soft" : "border-ivory/25"}`}>
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <Landscape scene={item.homeScene || item.scene} shade />
            </div>
            <span className="font-serif text-3xl">{item.name}</span>
          </button>)}
        </div>
        </div>
      </div>
      <div className="container-luxe hero-footer">
        <div className="hero-controls">
          <div className="hero-destinations" aria-label="Choose a destination">
            {destinations.map((item, index) => <button key={item.slug} aria-pressed={index === active} onClick={() => selectDestination(index)} className={`hero-destination ${index === active ? "is-active" : ""}`}><span className="hero-destination-number">{String(index + 1).padStart(2, "0")}</span><span>{item.name}</span><span className="hero-progress">{index === active && <motion.span key={`${item.slug}-${paused}`} initial={{ scaleX: 0 }} animate={{ scaleX: paused || reducedMotion ? 0 : 1 }} transition={{ duration: 7, ease: "linear" }} />}</span></button>)}
          </div>
          <button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume automatic rotation" : "Pause automatic rotation"} className="hero-pause">
            {paused ? <Play size={15} /> : <Pause size={15} />}<span>{paused ? "Resume" : "Pause"}</span>
          </button>
        </div>
        <div className="hero-footnote"><span>RARE BY NATURE. BESPOKE BY DESIGN.</span><a href="#our-philosophy" className="inline-flex min-h-11 items-center gap-3">A world worth discovering <ArrowDown size={14} /></a></div>
      </div>
    </section>
  );
}
