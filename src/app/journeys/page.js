import JourneyGrid from "@/components/sections/JourneyGrid";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { getDestinations, getJourneys } from "@/lib/content";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Journeys",
  description: "A few ways to begin. Not fixed packages, but a glimpse of what is possible, each tailored entirely around you.",
  path: "/journeys",
});

export default async function JourneysPage({ searchParams }) {
  const [params, journeys, destinations] = await Promise.all([searchParams, getJourneys(), getDestinations()]);
  return (
    <>
      <PageHero scene="lake" eyebrow="Journeys" title="A few ways to begin." titleClass="text-[clamp(3rem,7vw,5.5rem)]" subtitle="Not fixed packages, but a glimpse of what is possible." />
      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <Reveal as="p" className="max-w-xl text-[14px] leading-[1.75] text-muted">
              Every journey below is a starting point. We reshape the route, the pace and the hotels around you, or
              begin again from a blank page.
            </Reveal>
            <ArrowLink href="/journeys/multi-country" className="shrink-0">Multi-country journeys</ArrowLink>
          </div>
          <JourneyGrid journeys={journeys} destinations={destinations} defaultDestination={params?.destination === "multiple" ? "multiple" : ""} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
