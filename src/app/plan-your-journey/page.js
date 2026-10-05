import JourneyPlanner from "@/components/sections/JourneyPlanner";
import { getDestination, getDestinations, getExperiences, getJourney } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Plan your journey",
  description: "Tell us about the journey you have in mind. A Painite curator will personally reply within 24 hours.",
  path: "/plan-your-journey",
});

export default async function PlanPage({ searchParams }) {
  const sp = await searchParams;
  const [destinationDoc, journey, destinations, experiences] = await Promise.all([
    getDestination(sp?.destination),
    getJourney(sp?.journey),
    getDestinations(),
    getExperiences(),
  ]);
  const destination = destinationDoc?.slug ?? (sp?.destination === "multiple" ? "multiple" : "");

  return <JourneyPlanner destinations={destinations} experiences={experiences} defaultDestination={destination || journey?.destinations[0] || ""} journey={journey} defaultExperience={experiences.find(e => e.slug === sp?.experience)?.slug || ""} />;
}
