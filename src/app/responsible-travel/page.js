import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Responsible travel",
  description: "How Painite travels lightly: local guides, small lodges, fair wages and respect for wildlife and communities.",
  path: "/responsible-travel",
});

const principles = [
  { title: "Local people, fairly paid", text: "Our guides, drivers and hosts live in the places you visit. We pay fairly and work with them year after year." },
  { title: "Smaller, better places to stay", text: "We favour owner-run lodges, restored heritage buildings and hotels that invest in their communities." },
  { title: "Wildlife on its own terms", text: "No animal rides or shows. Safaris with expert naturalists who put the animals first." },
  { title: "Slower journeys", text: "Fewer internal flights, longer stays and routes that make sense on the map." },
];

export default function ResponsibleTravelPage() {
  return (
    <>
      <PageHero scene="mist" eyebrow="Responsible travel" title="Travel lightly, stay longer." titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl" />
      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Reveal as="p" className="max-w-2xl font-serif text-[1.75rem] leading-snug md:text-[2rem]">
            The places we love are only worth visiting because of the people who live there and the landscapes they
            look after. We try to leave both better for our being there.
          </Reveal>
          <Stagger className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {principles.map((p) => (
              <StaggerItem key={p.title} className="border-t border-line pt-6">
                <h2 className="font-serif text-[1.5rem] leading-tight">{p.title}</h2>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{p.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
