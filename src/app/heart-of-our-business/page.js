import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "The heart of our business",
  description:
    "Our philosophy: people before profit, connection over transaction, and luxury measured by how a journey makes you feel.",
  path: "/heart-of-our-business",
});

const values = [
  {
    title: "People before profit",
    text: "We've never been driven by profit margins or metrics. From the very beginning, what mattered most was connection: who's happy, who finds joy in their work, and who feels seen and valued. When people thrive, trust grows, energy flows, and extraordinary journeys follow naturally.",
  },
  {
    title: "A personal journey",
    text: "Growing up in Agra, the Taj Mahal was part of my daily view, not as a tourist but as a child immersed in its wonder. Those early experiences taught me the most important lesson in hospitality: that travel, at its best, makes you feel something.",
  },
  {
    title: "More than luxury",
    text: "We work with travellers from all walks of life, some arriving by private jet, others saving for a once-in-a-lifetime journey. Both deserve to feel royal. True luxury is not about thread counts or gilded lobbies; it's about care, attention, and how a journey makes you feel.",
  },
  {
    title: "We build connections",
    text: "Every guest, guide, driver and partner matters. From a traveller exploring India for the first time to a team member in Rajasthan ensuring every pillow is perfect, we remember names, not numbers.",
  },
  {
    title: "Lighting up our own street",
    text: "If I can't be the sun that lights up the whole world, I'll be the lamp that lights up my street. We focus on a business where kindness matters as much as competence, and success is measured in smiles, memories and trust.",
  },
  {
    title: "Our promise",
    text: "At Painite Travels, luxury is personal, thoughtful and unforgettable. Our goal is to craft experiences that leave a lasting impression, build trust, and create memories to cherish forever.",
  },
];

export default function HeartOfOurBusinessPage() {
  return (
    <>
      <PageHero
        scene="golden"
        eyebrow="Our philosophy"
        title="The heart of Painite Travels."
        titleClass="text-[clamp(3rem,7vw,5.5rem)] max-w-4xl"
        subtitle="Luxury travel, redefined by care."
      />

      <section className="bg-cream text-text">
        <div className="container-luxe grid gap-12 py-24 lg:grid-cols-2">
          <Reveal as="h2" className="display-lg">
            Business is not about numbers. It&apos;s about people.
          </Reveal>
          <Reveal as="p" delay={0.1} className="max-w-lg text-[14px] leading-[1.75] text-muted lg:pt-2">
            Our journeys are built on trust, connection and unforgettable experiences. Luxury is not just about
            five-star hotels or private transfers; it&apos;s about creating moments that touch the heart, linger in
            memory, and make you feel truly valued.
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-soft text-text">
        <div className="container-luxe py-24">
          <p className="eyebrow text-terracotta">What defines us</p>
          <h2 className="display-md mt-4 max-w-2xl">The values behind every decision we make.</h2>
          <Stagger className="mt-12 grid gap-x-10 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <StaggerItem key={v.title} className="border-t border-line py-6">
                <h3 className="font-serif text-[1.6rem] leading-tight">{v.title}</h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted">{v.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="container-luxe py-24 text-center">
          <Reveal as="p" className="mx-auto max-w-3xl font-serif text-[2rem] italic leading-snug md:text-[2.5rem]">
            &ldquo;Every person on your journey is part of the story.&rdquo;
          </Reveal>
          <Reveal as="p" delay={0.1} className="mx-auto mt-8 max-w-xl text-[14px] leading-[1.75] text-ivory/75">
            Whether you&apos;re seeking a private palace stay, a cultural journey through India&apos;s hidden gems or a
            wellness retreat in serene surroundings, we ensure every detail is curated with care, elegance and
            exclusivity.
          </Reveal>
        </div>
      </section>

      <CtaBand title="Start your journey." cta="Plan your journey" />
    </>
  );
}
