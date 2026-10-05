import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Faq from "@/components/sections/Faq";
import JsonLd from "@/components/ui/JsonLd";
import { faqs } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Questions, answered",
  description: "How private journeys with Painite work, from the first conversation to your return home.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <PageHero scene="tea" eyebrow="Questions, answered" title="Good questions." titleClass="text-[clamp(3rem,7vw,5.5rem)]" />
      <section className="bg-cream text-text">
        <div className="container-luxe grid gap-12 py-24 lg:grid-cols-[minmax(0,18rem)_1fr] lg:gap-16">
          <p className="text-[14px] leading-[1.75] text-muted">
            Anything else on your mind? Write to us and a member of the team will reply personally.
          </p>
          <Faq items={faqs} />
        </div>
      </section>
      <CtaBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
    </>
  );
}
