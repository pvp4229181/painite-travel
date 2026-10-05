import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our booking promise",
  description:
    "Phased payments with no full prepayment before arrival, seamless check-in and departure, and a flexible, fair cancellation policy.",
  path: "/our-booking-promise",
});

const promises = [
  {
    title: "Guest-centric payment policy",
    lead: "Your luxury journey begins with confidence, not obligation. That's why we follow a flexible approach to payments.",
    points: [
      "No full prepayment required before arrival: we believe in earning your trust before seeking your commitment.",
      "A clear, phased schedule is shared in advance, making your planning effortless.",
      "The final balance is collected during your journey, before departure, once you've experienced our standard of service.",
    ],
  },
  {
    title: "Seamless check-in and departure",
    lead: "Every detail matters, from the moment you arrive until the moment you depart.",
    points: [
      "Early check-in and late check-out are always requested on your behalf, subject to availability.",
      "For early-morning arrivals or late-night departures, we arrange solutions such as day-use suites, private lounges or bespoke arrangements tailored to your schedule.",
      "Simply share your preferences and we will orchestrate the rest with discretion.",
    ],
  },
  {
    title: "Flexible and fair cancellation",
    lead: "Even the finest plans can change. Luxury should always feel stress-free, which is why our cancellation terms are designed with care.",
    points: [
      "Complimentary cancellation up to a defined date, based on itinerary complexity and hotel policies.",
      "Transparent details of any non-refundable components, always shared upfront.",
      "Advocacy on your behalf with our handpicked hotels and partners to minimise charges where possible.",
    ],
  },
];

export default function BookingPromisePage() {
  return (
    <>
      <PageHero
        scene="lake"
        eyebrow="Our booking promise"
        title="Built on trust."
        titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl"
        subtitle="Transparency, integrity and service, from enquiry to departure."
      />

      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Reveal as="p" className="max-w-3xl font-serif text-[1.75rem] leading-snug md:text-[2rem]">
            Trust is the foundation of every relationship we create: with our guests, our partners and our team. These
            are the promises we make to every traveller.
          </Reveal>

          <div className="mt-16 space-y-4">
            {promises.map((p, i) => (
              <Reveal key={p.title} className="grid gap-8 border-t border-line pt-10 pb-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
                <div>
                  <p className="eyebrow text-terracotta">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="mt-3 font-serif text-[2rem] leading-tight">{p.title}</h2>
                </div>
                <div>
                  <p className="max-w-xl text-[14.5px] leading-[1.75] text-text">{p.lead}</p>
                  <ul className="mt-6 max-w-xl space-y-3 text-[14px] leading-relaxed text-muted">
                    {p.points.map((point) => (
                      <li key={point} className="flex gap-3">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-terracotta" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-[13px] leading-relaxed text-muted">
            The exact payment schedule and cancellation dates for your journey are set out in your booking confirmation.
          </p>
        </div>
      </section>

      <CtaBand title="Luxury, on your terms." cta="Plan your journey" />
    </>
  );
}
