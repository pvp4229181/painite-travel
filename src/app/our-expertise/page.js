import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our expertise",
  description:
    "Specialists in five destinations: destination and hotel knowledge, guide networks, ground logistics and personal service across South Asia and the Indian Ocean.",
  path: "/our-expertise",
});

const areas = [
  { title: "Destination knowledge", text: "First-hand, current understanding of five destinations: seasons, regions, and the places worth your time." },
  { title: "Hotel knowledge", text: "We know the hotels personally: the right rooms, the right welcomes, the right fit for each journey." },
  { title: "Guide network", text: "Licensed specialists, historians and naturalists, matched to interests and language." },
  { title: "Ground logistics", text: "Transfers, permits, timing and contingencies, coordinated so travel feels effortless." },
  { title: "Private experiences", text: "Access and arrangements that cannot simply be booked online." },
  { title: "Luxury travel planning", text: "Considered itinerary design balancing icons and quiet, personal moments." },
  { title: "Crisis handling", text: "Calm, reliable support when plans need to change, on the ground and off." },
  { title: "Personal service", text: "One dedicated team, reachable throughout, who know your journey intimately." },
];

const trust = [
  "Registered private limited company: Painite Travels Private Limited",
  "Based in Agra, Uttar Pradesh, India",
  "Recognised tourism registrations and professional memberships (verifiable details on request)",
];

export default function OurExpertisePage() {
  return (
    <>
      <PageHero
        scene="himalaya"
        eyebrow="Our expertise"
        title="Specialists in five destinations."
        titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl"
        subtitle="We go deep, not wide."
      />

      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Reveal as="p" className="max-w-2xl font-serif text-[1.75rem] leading-snug md:text-[2rem]">
            Five destinations, known first-hand, and everything it takes to travel them privately and well.
          </Reveal>
          <p className="eyebrow mt-20 text-terracotta">Eight areas of expertise</p>
          <h2 className="display-md mt-4">What sets our work apart</h2>
          <Stagger as="ol" className="mt-12 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
            {areas.map((a, i) => (
              <StaggerItem as="li" key={a.title} className="border-t border-line py-6">
                <span className="eyebrow text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-serif text-[1.5rem] leading-tight">{a.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-muted">{a.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="container-luxe grid gap-12 py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-gold">Trust and credentials</p>
            <Reveal as="h2" className="display-lg mt-4">
              Verifiable, not decorative.
            </Reveal>
          </div>
          <div>
            <ul className="space-y-4 border-t border-ivory/20 pt-6 text-[14px] leading-relaxed text-ivory/85">
              {trust.map((t) => (
                <li key={t} className="flex gap-3">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-serif text-lg italic text-ivory/70">
              We publish only credentials that can be documented and verified.
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Ready to begin the conversation?" cta="Plan your journey" />
    </>
  );
}
