"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import Landscape from "@/components/ui/Landscape";
import { CircleArrow } from "@/components/ui/Button";

export default function ExperiencesCarousel({ experiences }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [resetting, setResetting] = useState(false);
  const reducedMotion = useReducedMotion();
  const count = experiences.length;

  useEffect(() => {
    if (count <= 2 || hovered || focused || reducedMotion || resetting) return;
    const timer = setInterval(() => {
      if (!document.hidden) setIndex(current => current + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [count, hovered, focused, reducedMotion, resetting]);

  useEffect(() => {
    if (!resetting) return;
    const timer = setTimeout(() => setResetting(false), 50);
    return () => clearTimeout(timer);
  }, [resetting]);

  function next() {
    if (index < count) setIndex(current => current + 1);
  }

  function finishScroll() {
    if (index >= count) {
      setResetting(true);
      setIndex(0);
    }
  }

  if (!count) return null;
  const cards = count > 2 ? [...experiences, ...experiences.slice(0, 2)] : experiences;

  return <div role="region" aria-label="Signature experiences" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div className="experiences-viewport">
      <div className={`experiences-track ${resetting ? "is-resetting" : ""}`}
        style={{ transform: `translateX(calc(${index} * ( -50% - 6px)))` }}
        onTransitionEnd={finishScroll}>
        {cards.map((experience, position) => {
          const visible = position >= index && position < index + 2;
          return <Link key={`${experience.slug}-${position}`} href={`/experiences/${experience.slug}`}
            tabIndex={visible ? 0 : -1} aria-hidden={!visible}
            className="experience-slide group relative isolate flex items-end overflow-hidden border border-ivory/15 text-ivory">
            <Landscape scene={experience.scene} shade className="-z-10 transition-transform duration-700 group-hover:scale-105" />
            <div className="flex w-full items-end justify-between gap-4"><div>
              <h3 className="font-serif text-4xl">{experience.name}</h3>
              <p className="mt-2 text-sm text-ivory/90">{experience.line}</p>
            </div><CircleArrow /></div>
          </Link>;
        })}
      </div>
    </div>
    {count > 2 && <div className="mt-5 flex items-center justify-between gap-4">
      <p className="text-xs text-ivory/70" aria-live={focused || reducedMotion ? "polite" : "off"}>
        {index % count + 1} / {count} experiences
      </p>
      <div className="flex gap-2">
        <button type="button" className="experience-control" aria-label="Previous experiences" onClick={() => { setIndex(current => (current - 1 + count) % count); }}><ArrowLeft size={17} /></button>
        <button type="button" className="experience-control" aria-label="Next experiences" onClick={() => { next(); }}><ArrowRight size={17} /></button>
      </div>
    </div>}
  </div>;
}
