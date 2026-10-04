import Landscape from "@/components/ui/Landscape";
import { ArrowLink } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";

const pillars = [
  {
    title: "Specialists, not generalists",
    text: "Five destinations only, so our knowledge runs deep rather than wide.",
  },
  {
    title: "Bespoke, not packaged",
    text: "Every journey begins with a conversation and is built around your interests, pace and hotels.",
  },
  {
    title: "Private, not group",
    text: "Your own guide, driver and arrangements, at your own rhythm.",
  },
  {
    title: "One dedicated team",
    text: "The same people plan your journey and stay reachable throughout it.",
  },
];

export default function Intro() {
  return (
    <section id="our-philosophy" className="bg-cream text-text">
      <div className="container-luxe grid items-center gap-16 pt-24 pb-20 md:pt-32 lg:grid-cols-2 lg:gap-12">
        <div>
          <Reveal as="h2" className="display-lg">
            Luxury through care,
            <br />
            service and access.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-8 max-w-md text-[14px] leading-[1.75] text-muted">
            Every traveller sees a place differently. So we begin with you: what you love, how you like to travel,
            what you want to remember. From there, we create a private journey that feels entirely your own.
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <ArrowLink href="/about">How we travel</ArrowLink>
          </Reveal>
        </div>

        <Reveal className="relative pb-16 sm:pb-8 lg:pl-12" amount={0.3}>
          <div className="relative aspect-[4/3.2] w-full overflow-hidden">
            <Landscape scene="hero" />
          </div>
          <div className="absolute bottom-0 left-0 aspect-[1.08] w-[46%] overflow-hidden border-[6px] border-cream sm:-bottom-6 lg:left-0">
            <Landscape scene="golden" sun={{ x: 12, y: 40, r: 5 }} />
          </div>
        </Reveal>
      </div>

      <div className="container-luxe pb-24 md:pb-28">
        <Stagger className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pillars.map((p) => (
            <StaggerItem key={p.title} className="border-t border-line pt-6">
              <h3 className="font-serif text-[1.45rem] leading-tight">{p.title}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">{p.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
