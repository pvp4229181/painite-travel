import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Landscape from "@/components/ui/Landscape";
import { ArrowLink } from "@/components/ui/Button";
import { durationLabel } from "@/data/journeys";
import { getJourneys } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Multi-country journeys",
  description:
    "Combine India, Nepal, Bhutan, Sri Lanka and the Maldives in one seamless private journey, with permits, transfers and logistics handled end to end.",
  path: "/journeys/multi-country",
});

const combinations = [
  { title: "India + Bhutan", text: "Cultural heritage meets Himalayan stillness: the Taj Mahal and Rajasthan paired with Paro and Punakha.", scene: "bhutan" },
  { title: "India + Nepal", text: "Northern India's icons combined with the Kathmandu Valley and Himalayan panoramas.", scene: "himalaya" },
  { title: "India + Nepal + Bhutan", text: "The definitive Himalayan-and-plains journey across three cultures.", scene: "golden" },
  { title: "India + Sri Lanka", text: "The subcontinent's grandeur followed by the island's tea country and coast.", scene: "tea" },
  { title: "India + Maldives", text: "Culture and heritage followed by pure Indian Ocean seclusion.", scene: "ocean" },
  { title: "India + Sri Lanka + Maldives", text: "A grand tour: heritage, island variety and overwater calm.", scene: "lagoon" },
  { title: "Nepal + Bhutan", text: "Two Himalayan cultures in one unhurried journey.", scene: "mist" },
];

export default async function MultiCountryPage() {
  const journeys = (await getJourneys()).filter((j) => j.destinations?.length > 1);

  return (
    <>
      <PageHero
        scene="himalaya"
        eyebrow="Journeys"
        title="Multi-country journeys."
        titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl"
        subtitle="One seamless private journey, across borders."
      />

      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Reveal as="p" className="max-w-3xl font-serif text-[1.75rem] leading-snug md:text-[2rem]">
            Our deepest strength: combining destinations into one seamless private journey, because we operate across
            all five, not just India.
          </Reveal>

          <p className="eyebrow mt-20 text-terracotta">Combinations</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="display-md">Journeys that cross borders</h2>
            <p className="max-w-sm text-[13px] leading-relaxed text-muted">
              Each combination is designed privately, with permits, transfers and logistics handled end to end.
            </p>
          </div>
          <Stagger className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {combinations.map((c) => (
              <StaggerItem key={c.title}>
                <Link href="/plan-your-journey?destination=multiple" className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Landscape scene={c.scene} className="transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-4 font-serif text-[1.75rem] leading-tight group-hover:text-terracotta">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.text}</p>
                  <span className="mt-3 inline-block border-b border-text/40 pb-1 text-[13px]">Enquire</span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {journeys.length > 0 && (
        <section className="bg-cream-soft text-text">
          <div className="container-luxe py-24">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="display-md">A place to begin</h2>
              <ArrowLink href="/journeys?destination=multiple">All multi-country journeys</ArrowLink>
            </div>
            <div className="mt-12 grid gap-x-5 gap-y-12 md:grid-cols-2">
              {journeys.map((j) => (
                <Link key={j.slug} href={`/journeys/${j.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Landscape scene={j.scene} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                  </div>
                  <p className="eyebrow mt-5 text-muted">
                    {j.region} · {durationLabel(j)}
                  </p>
                  <h3 className="mt-1.5 font-serif text-[1.85rem] leading-tight group-hover:text-terracotta">{j.title}</h3>
                  <p className="mt-1 text-[12.5px] text-muted">{j.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Design a multi-country journey." cta="Plan your journey" href="/plan-your-journey?destination=multiple" />
    </>
  );
}
