import Link from "next/link";
import Landscape from "@/components/ui/Landscape";
import { CircleArrow } from "@/components/ui/Button";
import { getJourneys } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";

export default async function JourneysPreview() {
  // Featured journeys lead; the rest fill the remaining places in order.
  const journeys = await getJourneys();
  const [featured, ...list] = [...journeys.filter((j) => j.featured), ...journeys.filter((j) => !j.featured)].slice(0, 4);
  if (!featured) return null;

  return (
    <section className="bg-cream text-text">
      <div className="container-luxe py-24 md:py-28">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Reveal as="h2" className="display-lg">
            Journeys designed around you.
          </Reveal>
          <Reveal as="p" delay={0.1} className="max-w-[17.5rem] text-[13px] leading-[1.75] text-muted">
            These are not fixed packages, but a glimpse of what is possible. Each journey is tailored entirely around
            you.
          </Reveal>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-10">
          <Reveal>
            <Link
              href={`/journeys/${featured.slug}`}
              className="group relative block aspect-square overflow-hidden text-ivory"
            >
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]">
                <Landscape scene={featured.scene} shade="linear-gradient(180deg, rgba(10,15,13,0) 45%, rgba(10,15,13,0.75) 100%)" />
              </div>
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4 md:inset-x-6 md:bottom-7">
                <div>
                  <p className="eyebrow text-ivory/85">
                    {featured.region}, {featured.days} days
                  </p>
                  <h3 className="mt-2 font-serif text-[2rem] leading-none md:text-[2.4rem]">{featured.title}</h3>
                  <p className="mt-3 text-[13px] text-ivory/85">{featured.summary}</p>
                </div>
                <CircleArrow />
              </div>
            </Link>
          </Reveal>

          <Stagger className="flex flex-col">
            {list.map((j) => (
              <StaggerItem key={j.slug} className="border-b border-line first:border-t">
                <Link href={`/journeys/${j.slug}`} className="group grid grid-cols-[minmax(0,9rem)_1fr] items-center gap-5 py-4 sm:grid-cols-[minmax(0,8.5rem)_1fr] md:gap-6">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                      <Landscape scene={j.scene} />
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow text-muted">
                      {j.region}, {j.days} days
                    </p>
                    <h3 className="mt-1.5 font-serif text-[1.55rem] leading-tight transition-colors group-hover:text-terracotta">
                      {j.title}
                    </h3>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{j.summary}</p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
