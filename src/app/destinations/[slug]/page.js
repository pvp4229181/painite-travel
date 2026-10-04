import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Landscape from "@/components/ui/Landscape";
import { ArrowLink, Button } from "@/components/ui/Button";
import { durationLabel } from "@/data/journeys";
import { getDestination, getDestinations, getExperiences, getJourneysFor } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return {};
  return buildMetadata({
    title: `${d.name}, privately`,
    description: `${d.heroLine} ${d.introText}`,
    path: `/destinations/${d.slug}`,
  });
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();

  const [trips, allExperiences, destinations] = await Promise.all([getJourneysFor(d.slug), getExperiences(), getDestinations()]);
  const exps = (d.experiences ?? []).map((s) => allExperiences.find((e) => e.slug === s)).filter(Boolean);

  return (
    <>
      <PageHero
        scene={d.scene}
        title={d.name}
        subtitle={d.heroLine}
        footer={
          <div className="container-luxe relative pb-6">
            <nav aria-label="Destinations" className="flex flex-wrap gap-x-7 gap-y-2 border-t border-ivory/20 pt-5">
              {destinations.map((x) => (
                <Link
                  key={x.slug}
                  href={`/destinations/${x.slug}`}
                  aria-current={x.slug === d.slug ? "page" : undefined}
                  className={cn(
                    "text-[12px] tracking-[0.12em] transition-colors",
                    x.slug === d.slug ? "text-gold" : "text-ivory/85 hover:text-ivory",
                  )}
                >
                  {x.name}
                </Link>
              ))}
            </nav>
          </div>
        }
      >
        <Button href={`/plan-your-journey?destination=${d.slug}`}>Plan your journey</Button>
      </PageHero>

      {/* Intro + regions */}
      <section className="bg-cream text-text">
        <div className="container-luxe py-24 md:py-28">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal as="h2" className="display-lg">
              {d.introTitle}
            </Reveal>
            <div className="lg:pt-2">
              <Reveal as="p" delay={0.1} className="max-w-md text-[14px] leading-[1.75] text-muted">
                {d.introText}
              </Reveal>
              <Reveal as="p" delay={0.18} className="mt-6 font-serif text-[1.45rem] italic text-terracotta">
                {d.quote}
              </Reveal>
            </div>
          </div>

          <Stagger className="mt-16 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {d.regions.map((r, i) => (
              <StaggerItem key={r.name} className={cn(i % 2 === 1 && "lg:mt-8")}>
                <div className="group relative aspect-[4/5] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-105">
                    <Landscape scene={r.scene} />
                  </div>
                </div>
                <h3 className="mt-4 font-serif text-[1.65rem] leading-none">{r.name}</h3>
                <p className="mt-2 text-[12.5px] text-muted">{r.line}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Signature experiences */}
      <section className="bg-ink text-ivory">
        <div className="container-luxe py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Reveal as="h2" className="display-md">
              Signature experiences in {d.name}
            </Reveal>
            <ArrowLink href="/experiences" tone="light">
              View all experiences
            </ArrowLink>
          </div>
          <Stagger className="mt-12 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {exps.map((e) => (
              <StaggerItem key={e.slug}>
                <Link href={`/experiences/${e.slug}`} className="group relative block aspect-[1/1.03] overflow-hidden">
                  <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-105">
                    <Landscape scene={e.scene} shade />
                  </div>
                  <span className="absolute bottom-4 left-4 font-serif text-[1.6rem] md:left-5">{e.name}</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Journeys */}
      {trips.length > 0 && (
        <section className="bg-cream text-text">
          <div className="container-luxe py-24">
            <Reveal as="h2" className="display-md">
              Journeys through {d.name}
            </Reveal>
            <Stagger className="mt-12 grid gap-x-5 gap-y-12 md:grid-cols-2">
              {trips.map((j) => (
                <StaggerItem key={j.slug}>
                  <Link href={`/journeys/${j.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]">
                        <Landscape scene={j.scene} />
                      </div>
                    </div>
                    <p className="eyebrow mt-5 text-muted">{durationLabel(j)}</p>
                    <h3 className="mt-1.5 font-serif text-[1.85rem] leading-tight transition-colors group-hover:text-terracotta">
                      {j.title}
                    </h3>
                    <p className="mt-1 text-[12.5px] text-muted">{j.summary}</p>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
