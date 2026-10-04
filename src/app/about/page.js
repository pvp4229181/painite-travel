import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Landscape from "@/components/ui/Landscape";
import Marquee from "@/components/Marquee";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our story",
  description: "Painite is a private travel company based in Agra, India, specialising in five destinations across South Asia and the Indian Ocean.",
  path: "/about",
});

const steps = [
  { n: "01", title: "A conversation", text: "We start with you: what you love, how you like to travel, and what you hope to remember." },
  { n: "02", title: "A proposal", text: "A private itinerary, hotels chosen for you, and a clear, itemised price. We refine it together." },
  { n: "03", title: "The details", text: "Guides, drivers, permits, flights and the small touches. One team handles everything." },
  { n: "04", title: "The journey", text: "You travel at your own rhythm, and the people who planned it stay reachable throughout." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero scene="desert" eyebrow="Our story" title="Named for a rare stone." titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl" subtitle="Journeys beyond boundaries." />

      <section className="bg-cream text-text">
        <div className="container-luxe grid items-center gap-14 py-24 lg:grid-cols-2">
          <div>
            <Reveal as="h2" className="display-lg">
              Rare, by design.
            </Reveal>
            <Reveal as="div" delay={0.1} className="mt-8 max-w-md space-y-5 text-[14px] leading-[1.75] text-muted">
              <p>
                Painite is one of the rarest gemstones on earth, first found in the mountains of Myanmar. We chose the
                name because the journeys we care about are rare too: private, unhurried and shaped entirely around
                the people taking them.
              </p>
              <p>
                We are based in Agra, a few minutes from the Taj Mahal, and we work in only five places: India, Nepal,
                Bhutan, Sri Lanka and the Maldives. Staying small and specialised means we know the guides, the hotels
                and the quiet corners personally.
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <ArrowLink href="/responsible-travel">How we travel responsibly</ArrowLink>
            </Reveal>
          </div>
          <Reveal className="relative aspect-[4/4.2] overflow-hidden">
            <Landscape scene="lake" />
          </Reveal>
        </div>
      </section>

      <section className="overflow-hidden bg-ink py-14 text-ivory">
        <Marquee />
      </section>

      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Reveal as="h2" className="display-lg max-w-xl">
            How a journey comes together.
          </Reveal>
          <Stagger className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {steps.map((s) => (
              <StaggerItem key={s.n} className="border-t border-line pt-6">
                <p className="eyebrow text-terracotta">{s.n}</p>
                <h3 className="mt-3 font-serif text-[1.6rem] leading-tight">{s.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{s.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
