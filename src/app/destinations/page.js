import PageHero from "@/components/sections/PageHero";
import DestinationsShowcase from "@/components/sections/DestinationsShowcase";
import CtaBand from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Destinations",
  description: "India, Nepal, Bhutan, Sri Lanka and the Maldives: five places we know first-hand, designed privately and without haste.",
  path: "/destinations",
});

export default function DestinationsPage() {
  return (
    <>
      <PageHero scene="himalaya" eyebrow="Destinations" title="Five places, known deeply." titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl" subtitle="Specialists, not generalists." />
      <DestinationsShowcase />
      <CtaBand />
    </>
  );
}
