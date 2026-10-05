import Link from "next/link";
import Landscape from "@/components/ui/Landscape";
import { getDestinations } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default async function DestinationsShowcase({ title, intro, className }) {
  const destinations = await getDestinations();
  return (
    <section className={cn("bg-ink text-ivory", className)}>
      <div className="container-luxe py-24 md:py-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal as="h2" className="display-lg">
            {title ?? (
              <>
                Five destinations.
                <br />
                One standard of care.
              </>
            )}
          </Reveal>
          <Reveal as="p" delay={0.1} className="max-w-[16.5rem] text-[13px] leading-[1.75] text-ivory/65 md:mb-2">
            {intro ?? "We specialise deeply rather than broadly: five places we know first-hand, designed privately and without haste."}
          </Reveal>
        </div>

        <Stagger className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
          {destinations.map((d, i) => (
            <StaggerItem key={d.slug} className={cn(i % 2 === 1 && "lg:mt-7", i === 4 && "col-span-2 sm:col-span-1")}>
              <Link
                href={`/destinations/${d.slug}`}
                className={cn(
                  "group relative block aspect-[9/16] overflow-hidden border border-ivory/10 max-lg:aspect-[3/4]",
                  i === 4 && "max-sm:aspect-[16/9]",
                )}
              >
                <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.06]">
                  <Landscape scene={d.cardScene} shade="linear-gradient(180deg, rgba(10,15,13,0) 50%, rgba(10,15,13,0.7) 100%)" />
                </div>
                <div className="absolute inset-x-4 bottom-5 md:inset-x-5">
                  <h3 className="font-serif text-[1.65rem] leading-none">{d.name}</h3>
                  <p className="mt-2 max-w-[11rem] text-[11.5px] leading-snug text-ivory/85">{d.tagline}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-ivory/20 pt-6 sm:flex-row sm:items-center">
          <p className="max-w-lg text-sm leading-relaxed text-ivory/80">From Himalayan valleys to the Indian Ocean, combine our destinations in one privately planned journey.</p>
          <Link href="/journeys/multi-country" className="shrink-0 border-b border-gold pb-2 text-sm text-gold">Explore multi-country journeys</Link>
        </div>
      </div>
    </section>
  );
}
