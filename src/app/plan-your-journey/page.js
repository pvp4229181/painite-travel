import Landscape from "@/components/ui/Landscape";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { getDestination, getDestinations, getExperiences, getJourney } from "@/lib/content";
import { site } from "@/data/site";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Plan your journey",
  description: "Tell us about the journey you have in mind. A Painite curator will personally reply within 24 hours.",
  path: "/plan-your-journey",
});

export default async function PlanPage({ searchParams }) {
  const sp = await searchParams;
  const [destinationDoc, journey, destinations, experiences] = await Promise.all([
    getDestination(sp?.destination),
    getJourney(sp?.journey),
    getDestinations(),
    getExperiences(),
  ]);
  const destination = destinationDoc?.slug ?? "";

  return (
    <section className="grid bg-ink pt-[72px] lg:grid-cols-2">
      <div className="relative isolate flex min-h-[460px] flex-col justify-end overflow-hidden text-ivory lg:min-h-full">
        <Landscape
          scene="dusk"
          shade="linear-gradient(180deg, rgba(10,15,13,0) 50%, rgba(10,15,13,0.5) 100%)"
          className="-z-10"
        />
        <div className="px-6 pt-24 pb-12 md:px-12 lg:px-8 lg:pb-14 xl:px-12">
          <p className="font-script text-3xl text-gold-soft">Journeys beyond boundaries</p>
          <h1 className="mt-3 max-w-sm font-serif text-[2.4rem] leading-[1.1] md:text-[2.6rem]">
            Every journey starts with a conversation, never a template.
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
            <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-gold">
              <i className="fa-regular fa-envelope text-[12px] text-gold" aria-hidden /> {site.email}
            </a>
            <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-gold">
              <i className="fa-solid fa-phone text-[11px] text-gold" aria-hidden /> {site.phone}
            </a>
            <a
              href={`https://wa.me/${site.phoneHref.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-2 hover:text-gold"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-whatsapp text-[13px] text-gold" aria-hidden /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="bg-cream px-6 py-16 text-text md:px-12 lg:px-10 lg:py-20 xl:px-14">
        <h2 className="font-serif text-[2.6rem] leading-none md:text-[3.2rem]">Let&apos;s plan your journey.</h2>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted">
          Tell us a little about the journey you have in mind. A Painite curator will personally review your enquiry and
          reply within 24 hours.
        </p>
        {journey && (
          <p className="mt-4 border-l-2 border-terracotta pl-3 text-[13px] text-text">
            Enquiring about <span className="font-serif text-lg italic">{journey.title}</span>
          </p>
        )}
        <div className="mt-10">
          <EnquiryForm destinations={destinations} experiences={experiences} defaultDestination={destination || journey?.destinations[0] || ""} defaultJourney={journey?.slug ?? ""} />
        </div>
      </div>
    </section>
  );
}
