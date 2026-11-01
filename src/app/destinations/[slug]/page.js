import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Gallery from "@/components/sections/Gallery";
import Landscape from "@/components/ui/Landscape";
import { ArrowLink, Button } from "@/components/ui/Button";
import { durationLabel } from "@/data/journeys";
import { getArticles, getDestination, getDestinations, getExperiences, getJourneysFor } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const regionImages = {
  Rajasthan: { src: "/images/cleaned/regions/rajasthan.webp", alt: "Amber Fort in Rajasthan", position: "center 35%" },
  Kerala: { src: "/images/cleaned/regions/kerala.webp", alt: "A houseboat on Kerala’s backwaters" },
  Varanasi: { src: "/images/cleaned/regions/varanasi.webp", alt: "Varanasi’s riverside ghats and temples" },
  "Madhya Pradesh": { src: "/images/cleaned/regions/madhya-pradesh.webp", alt: "A tiger in Kanha National Park" },
  "Kathmandu Valley": { src: "/images/cleaned/regions/kathmandu-valley.webp", alt: "Temple architecture in Patan Durbar Square" },
  Pokhara: { src: "/images/cleaned/regions/pokhara.webp", alt: "Phewa Lake and the Annapurna range from Pokhara" },
  "Everest region": { src: "/images/cleaned/regions/everest-region.webp", alt: "Namche Bazaar in Nepal’s Everest region", position: "center 30%" },
  Chitwan: { src: "/images/cleaned/regions/chitwan.webp", alt: "A one-horned rhinoceros in Chitwan National Park" },
  Paro: { src: "/images/cleaned/regions/paro.webp", alt: "Tiger’s Nest monastery in Paro" },
  Thimphu: { src: "/images/cleaned/regions/thimphu.webp", alt: "Tashichho Dzong in Thimphu" },
  Punakha: { src: "/images/cleaned/regions/punakha.webp", alt: "Punakha Dzong beside the river in Bhutan" },
  Bumthang: { src: "/images/cleaned/regions/bumthang.webp", alt: "Jakar Dzong in Bumthang" },
  "Cultural Triangle": { src: "/images/cleaned/regions/cultural-triangle.webp", alt: "Sigiriya rock fortress at sunset" },
  "Hill Country": { src: "/images/cleaned/regions/hill-country.webp", alt: "Tea plantations in Sri Lanka’s hill country" },
  Yala: { src: "/images/cleaned/regions/yala.webp", alt: "A leopard in Yala National Park" },
  Galle: { src: "/images/cleaned/regions/galle.webp", alt: "Galle lighthouse framed by palm trees", position: "center 50%" },
  "North Malé Atoll": { src: "/images/cleaned/regions/north-male-atoll.webp", alt: "A palm-fringed beach in Thulusdhoo, North Malé Atoll" },
  "Baa Atoll": { src: "/images/cleaned/regions/baa-atoll.webp", alt: "An island and turquoise lagoon in Baa Atoll" },
  "Raa Atoll": { src: "/images/cleaned/regions/raa-atoll.webp", alt: "An infinity pool at sunset in Raa Atoll" },
  "Southern atolls": { src: "/images/cleaned/regions/southern-atolls.webp", alt: "A whale shark swimming in open water" },
};

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) return {};
  return buildMetadata({
    title: `Luxury private travel in ${d.name}`,
    description: `${d.heroLine} ${d.introText}`,
    path: `/destinations/${d.slug}`,
  });
}

export default async function DestinationPage({ params }) {
  const { slug } = await params;
  const d = await getDestination(slug);
  if (!d) notFound();

  const [trips, allExperiences, destinations, articles] = await Promise.all([
    getJourneysFor(d.slug),
    getExperiences(),
    getDestinations(),
    getArticles(),
  ]);
  const exps = (d.experiences ?? []).map((s) => allExperiences.find((e) => e.slug === s)).filter(Boolean);
  const reading = articles.filter((a) => a.category === d.name).slice(0, 3);
  const places = d.places ?? [];

  return (
    <>
      <PageHero
        scene={d.scene}
        video={d.video || (["india", "nepal", "bhutan", "sri-lanka", "maldives"].includes(d.slug) ? `/videos/hero/${d.slug}.mp4?v=20261101-clean` : undefined)}
        title={
          <>
            <span className="eyebrow mb-4 block text-ivory/80">Luxury private travel in</span>
            {d.name}
          </>
        }
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
                    {regionImages[r.name] ? (
                      <Image quality={90}
                        src={regionImages[r.name].src}
                        alt={regionImages[r.name].alt}
                        style={{ objectPosition: regionImages[r.name].position }}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <Landscape scene={r.scene} />
                    )}
                  </div>
                </div>
                <h3 className="mt-4 font-serif text-[1.65rem] leading-none">{r.name}</h3>
                <p className="mt-2 text-[12.5px] text-muted">{r.line}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Places + when to travel */}
      {(places.length > 0 || d.whenToTravel || d.bestTime) && (
        <section className="bg-cream-soft text-text">
          <div className="container-luxe grid gap-14 py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            {places.length > 0 && (
              <div>
                <p className="eyebrow text-terracotta">Where we take you</p>
                <Reveal as="h2" className="display-md mt-4">
                  Across {d.name}
                </Reveal>
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {places.map((place) => (
                    <li key={place} className="border border-line px-4 py-2 text-[13px]">
                      {place}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {(d.whenToTravel || d.bestTime) && (
              <div>
                <p className="eyebrow text-terracotta">Best time to visit</p>
                <Reveal as="h2" className="display-md mt-4">
                  When to travel
                </Reveal>
                {d.bestTime && <p className="mt-6 font-serif text-[1.45rem] italic text-terracotta">{d.bestTime}</p>}
                {d.whenToTravel && <p className="mt-4 max-w-md text-[14px] leading-[1.75] text-muted">{d.whenToTravel}</p>}
              </div>
            )}
          </div>
        </section>
      )}

      <Gallery items={d.gallery} eyebrow="Gallery" title={`${d.name} in pictures`} />

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

      {/* Journal */}
      {reading.length > 0 && (
        <section className="bg-cream-soft text-text">
          <div className="container-luxe py-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <Reveal as="h2" className="display-md">
                Reading on {d.name}
              </Reveal>
              <ArrowLink href="/journal">Read the journal</ArrowLink>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {reading.map((a) => (
                <Link key={a.slug} href={`/journal/${a.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Landscape scene={a.scene} className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-5 font-serif text-[1.75rem] leading-tight group-hover:text-terracotta">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title={`Design your ${d.name} journey.`} cta="Plan your journey" href={`/plan-your-journey?destination=${d.slug}`} />
    </>
  );
}
