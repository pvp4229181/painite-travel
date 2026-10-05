import { notFound } from "next/navigation";
import { Compass, House, MapPin, Sun, Users } from "lucide-react";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Gallery from "@/components/sections/Gallery";
import Itinerary from "@/components/sections/Itinerary";
import Landscape from "@/components/ui/Landscape";
import JsonLd from "@/components/ui/JsonLd";
import { Button } from "@/components/ui/Button";
import FilmButton from "@/components/ui/FilmButton";
import { getJourney, getJourneys } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata, tripJsonLd } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getJourneys()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const j = await getJourney(slug);
  if (!j) return {};
  return buildMetadata({ title: j.title, description: `${j.summary} ${j.intro}`, path: `/journeys/${j.slug}` });
}

const glanceItems = [
  { key: "destinations", label: "Destinations", Icon: MapPin },
  { key: "style", label: "Travel style", Icon: Compass },
  { key: "season", label: "Best season", Icon: Sun },
  { key: "idealFor", label: "Ideal for", Icon: Users },
  { key: "accommodation", label: "Accommodation", Icon: House },
];

export default async function JourneyPage({ params }) {
  const { slug } = await params;
  const j = await getJourney(slug);
  if (!j) notFound();

  const enquire = `/plan-your-journey?journey=${j.slug}`;

  return (
    <>
      <PageHero
        scene={j.scene}
        video={j.video}
        eyebrow={j.region}
        title={j.title}
        titleClass="text-[clamp(3rem,7.5vw,5.5rem)]"
        subtitle={`${j.days} days / ${j.nights} nights`}
        className="min-h-[520px] md:min-h-[560px]"
      >
        <div className="flex flex-wrap items-center gap-6">
          <Button href={enquire}>Enquire about this journey</Button>
          <FilmButton />
        </div>
      </PageHero>

      {/* At a glance */}
      <section className="bg-cream text-text">
        <div className="container-luxe pt-20 pb-24 md:pt-24">
          <Reveal as="h2" className="display-md">
            Journey at a glance
          </Reveal>
          <Stagger className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 sm:grid-cols-3 lg:grid-cols-5">
            {glanceItems.map(({ key, label, Icon }) => (
              <StaggerItem key={key}>
                <Icon className="size-4 text-terracotta" strokeWidth={1.25} aria-hidden />
                <p className="eyebrow mt-3 text-muted">{label}</p>
                <p className="mt-1.5 font-serif text-[1.2rem] leading-snug">{j.glance[key]}</p>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Reveal as="h2" className="display-lg max-w-lg">
                {j.introTitle}
              </Reveal>
              <Reveal as="p" delay={0.1} className="mt-6 max-w-md text-[14px] leading-[1.75] text-muted">
                {j.intro}
              </Reveal>
            </div>
            <Reveal className="relative aspect-[4/2.9] overflow-hidden">
              <Landscape scene={j.slug === "himalayan-kingdoms" ? "golden" : j.scene} sun={j.slug === "himalayan-kingdoms" ? { x: 20, y: 40, r: 5 } : undefined} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Day by day */}
      <section className="border-t border-line bg-cream text-text">
        <div className="container-luxe grid gap-10 py-20 lg:grid-cols-[minmax(0,17rem)_1fr] lg:gap-16 lg:py-24">
          <div>
            <Reveal as="h2" className="display-md">
              Day by day
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
              A starting point, not a schedule. Every day can be reshaped around your pace and interests.
            </Reveal>
          </div>
          <Itinerary days={j.itinerary} />
        </div>
      </section>

      <Gallery items={j.gallery} eyebrow="Gallery" title="Moments from the journey" className="bg-cream-soft" />

      <CtaBand
        title={
          <>
            Make this journey
            <br />
            your own.
          </>
        }
        cta="Enquire about this journey"
        href={enquire}
      />
      <JsonLd data={tripJsonLd({ ...j, days: j.itinerary })} />
    </>
  );
}
