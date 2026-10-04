import PageHero from "@/components/sections/PageHero";
import ExperiencesList from "@/components/sections/ExperiencesList";
import CtaBand from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Experiences",
  description: "Heritage, wildlife, wellness, gastronomy, romance and island time. Not just what you see, but how you feel it.",
  path: "/experiences",
});

export default function ExperiencesPage() {
  return (
    <>
      <PageHero
        scene="golden"
        eyebrow="Experiences"
        title="Beyond the expected."
        titleClass="text-[clamp(3rem,7vw,5.5rem)]"
        subtitle="Not just what you see, but how you feel it."
      />
      <ExperiencesList showHeading={false} />
      <CtaBand />
    </>
  );
}
