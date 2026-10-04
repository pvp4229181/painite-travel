"use client";

import { useState } from "react";
import Link from "next/link";
import Landscape from "@/components/ui/Landscape";
import { CircleArrow } from "@/components/ui/Button";
import { journeys as starterJourneys, durationLabel } from "@/data/journeys";
import { destinations as starterDestinations } from "@/data/destinations";

export default function JourneyGrid({ defaultDestination = "", journeys = starterJourneys, destinations = starterDestinations }) {
  const [destination, setDestination] = useState(defaultDestination);
  const [duration, setDuration] = useState("");
  const filtered = journeys.filter(j => (!destination || (destination === "multiple" ? j.destinations.length > 1 : j.destinations.includes(destination))) && (!duration || (duration === "short" ? j.days <= 12 : j.days > 12)));
  return <>
    <div className="mt-9 grid gap-4 sm:grid-cols-2">
      <label className="text-xs tracking-wide">Destination<select value={destination} onChange={e => setDestination(e.target.value)} className="mt-2 block w-full border border-line bg-cream-soft px-4 py-3 text-sm"><option value="">All destinations</option><option value="multiple">Multi-country journeys</option>{destinations.map(d => <option key={d.slug} value={d.slug}>{d.name}</option>)}</select></label>
      <label className="text-xs tracking-wide">Journey length<select value={duration} onChange={e => setDuration(e.target.value)} className="mt-2 block w-full border border-line bg-cream-soft px-4 py-3 text-sm"><option value="">All journeys</option><option value="short">Up to 12 days</option><option value="long">13 days or more</option></select></label>
    </div>
    <p aria-live="polite" className="mt-6 text-xs text-muted">{filtered.length} journeys to inspire you</p>
    <div className="mt-6 grid gap-x-5 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{filtered.map(j => <Link key={j.slug} href={`/journeys/${j.slug}`} className="group block"><div className="relative aspect-[4/3] overflow-hidden"><Landscape scene={j.scene} className="transition-transform duration-700 group-hover:scale-105" /><CircleArrow className="absolute right-4 bottom-4 bg-ink/30" /></div><h2 className="mt-4 font-serif text-[1.85rem] leading-tight group-hover:text-terracotta">{j.title}</h2><p className="mt-2 text-xs text-muted">{durationLabel(j)} · {j.region}</p><p className="mt-2 text-sm text-muted">{j.summary}</p></Link>)}</div>
    {!filtered.length && <div className="py-16 text-center"><h2 className="font-serif text-3xl">Your journey starts with a blank page.</h2><p className="mt-3 text-sm text-muted">Try another filter, or let us create something around you.</p><button onClick={() => {setDestination("");setDuration("");}} className="mt-5 border-b border-text pb-1 text-sm">Reset filters</button></div>}
  </>;
}
