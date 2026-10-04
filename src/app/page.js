import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import JourneysPreview from "@/components/home/JourneysPreview";
import DestinationsShowcase from "@/components/sections/DestinationsShowcase";
import ExperiencesList from "@/components/sections/ExperiencesList";
import FilmBanner from "@/components/sections/FilmBanner";
import CtaBand from "@/components/sections/CtaBand";
import { PlanningProcess, ServicesPreview, ResponsiblePreview, JournalPreview, QuestionsPreview, EnquiryPreview } from "@/components/home/TravelDetails";
import { getDestinations } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ path: "/" });

export default async function HomePage() {
  const destinations = await getDestinations();
  return (
    <>
      <Hero destinations={destinations} />
      <Intro />
      <FilmBanner />
      <DestinationsShowcase />
      <JourneysPreview />
      <ExperiencesList />
      <PlanningProcess />
      <ServicesPreview />
      <ResponsiblePreview />
      <JournalPreview />
      <QuestionsPreview />
      <EnquiryPreview />
      <CtaBand title="Ready to begin the conversation?" cta="Plan your journey" />
    </>
  );
}
