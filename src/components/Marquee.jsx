"use client";

import FastMarquee from "react-fast-marquee";

const places = [
  "Kathmandu",
  "Paro",
  "Jaipur",
  "Udaipur",
  "Galle",
  "Punakha",
  "Varanasi",
  "Pokhara",
  "Kandy",
  "Baa Atoll",
  "Agra",
  "Munnar",
  "Bumthang",
  "Yala",
];

export default function Marquee({ items = places, className }) {
  return (
    <div className={className}>
      <FastMarquee speed={28} gradient={false} pauseOnHover autoFill>
        {items.map((p) => (
          <span key={p} className="mx-8 inline-flex items-center gap-8 font-serif text-3xl text-ivory/80 italic md:text-4xl">
            {p}
            <span className="size-1.5 rounded-full bg-gold" aria-hidden />
          </span>
        ))}
      </FastMarquee>
    </div>
  );
}
