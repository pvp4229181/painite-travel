import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import ServicesList from "@/components/sections/ServicesList";
import CtaBand from "@/components/sections/CtaBand";
import Landscape from "@/components/ui/Landscape";
import { CircleArrow } from "@/components/ui/Button";
import { serviceDetails } from "@/data/services";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Services", description: "Private travel planning, hotels, guides, airport assistance and dedicated support across South Asia and the Indian Ocean.", path: "/services" });

export default function ServicesPage() {
  return <>
    <PageHero scene="heritage" eyebrow="Our services" title="Every detail, thoughtfully arranged." subtitle="From your first idea to your journey home, one dedicated team coordinates it all." />
    <section className="bg-ink text-ivory">
      <div className="container-luxe py-24">
        <p className="eyebrow text-gold">Detailed services</p>
        <h2 className="display-lg mt-4">Explore in depth</h2>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {serviceDetails.map((s) => (
            <Link key={s.slug} href={`/services/${s.slug}`} className="group relative block aspect-[3/4] overflow-hidden border border-ivory/10">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-105">
                <Landscape scene={s.scene} shade="linear-gradient(180deg, rgba(10,15,13,0) 40%, rgba(10,15,13,0.75) 100%)" />
              </div>
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <h3 className="font-serif text-[1.5rem] leading-tight">{s.name}</h3>
                <CircleArrow className="max-sm:hidden" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
    <section className="bg-cream text-text"><div className="container-luxe py-24"><h2 className="display-lg">From planning to departure</h2><ServicesList detailed /></div></section>
    <CtaBand title="Let’s plan your private journey." cta="Plan your journey" />
  </>;
}
