import PageHero from "@/components/sections/PageHero";
import ServicesList from "@/components/sections/ServicesList";
import CtaBand from "@/components/sections/CtaBand";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Services", description: "Private travel planning, hotels, guides, airport assistance and dedicated support across South Asia and the Indian Ocean.", path: "/services" });

export default function ServicesPage() {
  return <>
    <PageHero scene="heritage" eyebrow="Our services" title="Every detail, thoughtfully arranged." subtitle="From your first idea to your journey home, one dedicated team coordinates it all." />
    <section className="bg-cream text-text"><div className="container-luxe py-24"><h2 className="display-lg">From planning to departure</h2><ServicesList detailed /></div></section>
    <CtaBand title="Let’s plan your private journey." cta="Plan your journey" />
  </>;
}
