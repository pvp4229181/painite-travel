import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import Landscape from "@/components/ui/Landscape";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Our story",
  description:
    "From Agra, in the shadow of the Taj Mahal, to a life in luxury travel: how founder Anurag Rathore built Painite Travels.",
  path: "/our-story",
});

const path = [
  {
    title: "Front Office Associate",
    text: "Where I began, and where I learned that elegance lies in the little things: a warm greeting, anticipating a guest's needs, the promise of a flawless stay.",
  },
  {
    title: "Tour Executive",
    text: "I mastered the art of logistics, personalisation and creating seamless guest experiences: the discipline behind the magic.",
  },
  {
    title: "Tour Manager",
    text: "I refined my craft further, designing bespoke journeys tailored to each traveller's rhythm, preferences and dreams.",
  },
];

const credentials = [
  "MBA",
  "Travel Management Certification",
  "Travel Consultant Service Program",
  "IITFC Certified",
  "IITG Certified",
  "Ministry of Tourism, Govt. of India",
];

const friends = ["Maggie Jordan", "Ms Charlotte", "Karen Catcher", "Ruth", "Katherine", "Catherine", "Dr Amy"];

const initials = (name) =>
  name
    .replace(/^(Ms|Dr)\s+/, "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        scene="heritage"
        eyebrow="Our story"
        title="From humble beginnings to a life in luxury travel."
        titleClass="text-[clamp(2.8rem,6.5vw,5.2rem)] max-w-5xl"
        subtitle="Luxury isn't about the price tag. It's about how something makes you feel."
      />

      <section className="bg-cream text-text">
        <div className="container-luxe grid items-start gap-14 py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-terracotta">Where it began</p>
            <Reveal as="h2" className="display-lg mt-4">
              A journey that began at home.
            </Reveal>
            <Reveal as="div" delay={0.1} className="mt-8 max-w-lg space-y-5 text-[14px] leading-[1.75] text-muted">
              <p>
                I was born and raised in Agra, where the Taj Mahal wasn&apos;t just a monument; it was part of my daily
                life. Watching travellers from all over the world stand in awe of its beauty lit a quiet fire in me. I
                didn&apos;t know it then, but those quiet moments planted the first seeds of my journey.
              </p>
              <p>
                Back then, travel felt like a distant dream. Coming from a middle-class family, even eating out was
                rare, something special. Our idea of a trip was visiting my nani&apos;s village. So when I found myself in
                the travel industry years later, walking through India&apos;s grand palaces and staying in luxury hotels,
                I often paused to think: how did I get here?
              </p>
              <p>
                That sense of wonder never left me. I didn&apos;t want to just experience it; I wanted to share it. Not
                only with people who could afford five-star hotels, but also with those who save up for years to take a
                once-in-a-lifetime trip. Because luxury isn&apos;t about the price tag. It&apos;s about how something makes
                you feel.
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:pt-10">
            <div className="relative aspect-[4/4.2] overflow-hidden">
              <Landscape scene="desert" />
            </div>
            <p className="mt-6 border-l-2 border-terracotta pl-4 font-serif text-[1.45rem] italic leading-snug text-terracotta">
              &ldquo;Our idea of a trip was visiting my nani&apos;s village. It was simple, warm, and real.&rdquo;
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="container-luxe py-24">
          <p className="eyebrow text-gold">My path</p>
          <Reveal as="h2" className="display-lg mt-4 max-w-2xl">
            My path to luxury travel.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-[14px] leading-[1.75] text-ivory/75">
            Every role taught me something the next one needed: elegance, then logistics, then the quiet art of a
            journey designed for one person alone.
          </Reveal>
          <Stagger as="ol" className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
            {path.map((p, i) => (
              <StaggerItem as="li" key={p.title} className="border-t border-ivory/20 pt-6">
                <p className="eyebrow text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-serif text-[1.6rem] leading-tight">{p.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-ivory/75">{p.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-cream text-text">
        <div className="container-luxe grid gap-12 py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-terracotta">Education meets experience</p>
            <Reveal as="h2" className="display-lg mt-4">
              Marrying experience with education.
            </Reveal>
          </div>
          <div>
            <Reveal as="p" className="max-w-lg text-[14px] leading-[1.75] text-muted">
              My professional experience has been matched with formal training. I believe in marrying what you learn on
              the ground with what you learn in study. That&apos;s why I pursued a Travel Consultant Service program and a
              Travel Management Certification, to deepen my insight into the luxury travel world. My MBA sharpened my
              strategic thinking, business acumen and leadership: the tools I use every day to run a company that
              doesn&apos;t just arrange trips, but curates treasured memories.
            </Reveal>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {credentials.map((c) => (
                <li key={c} className="border border-line px-4 py-2 text-[13px]">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-cream-soft text-text">
        <div className="container-luxe py-24">
          <div className="mx-auto max-w-2xl">
            <p className="eyebrow text-terracotta">The spark</p>
            <Reveal as="h2" className="display-lg mt-4">
              The spark behind Painite Travels.
            </Reveal>
            <Reveal as="div" delay={0.1} className="mt-8 space-y-5 text-[14.5px] leading-[1.8] text-muted">
              <p>
                In 2013, friends and guests, those who saw something in me before I fully saw it in myself, began
                encouraging me to share my passion and build something of my own. Their confidence followed me as they
                introduced me to others who trusted me to curate unforgettable journeys across India. For years that
                quiet faith grew. Then, in 2023, a dear friend reminded me how far I&apos;d come, and I finally took the
                leap.
              </p>
              <p>
                Painite Travels wasn&apos;t born of a sudden idea. It was built on years of encouragement, trust, and the
                belief that every journey should be as special as the people taking it: a dream made real, thanks to
                friends from near and far who believed in me every step of the way.
              </p>
              <p>So wherever your next journey leads, I hope we&apos;ll walk that path with you.</p>
            </Reveal>
            <p className="mt-10 font-script text-4xl text-terracotta">Warmly, Anurag</p>
            <p className="mt-2 text-[13px] text-muted">Anurag Rathore, Founder, Painite Travels</p>
          </div>
        </div>
      </section>

      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <p className="eyebrow text-terracotta">With gratitude</p>
          <Reveal as="h2" className="display-lg mt-4 max-w-2xl">
            The friends who believed in me.
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-6 max-w-xl text-[14px] leading-[1.75] text-muted">
            Painite Travels exists because of the people who saw it in me before I fully saw it in myself. To these
            friends, and to the many more not named here: thank you, for every word of encouragement that brought me to
            this point.
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">
            {friends.map((name) => (
              <li key={name} className="flex flex-col items-center text-center">
                <span className="inline-flex size-16 items-center justify-center rounded-full border border-terracotta/40 font-serif text-xl text-terracotta">
                  {initials(name)}
                </span>
                <span className="mt-3 text-[13px]">{name}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center font-serif text-lg italic text-muted">
            &hellip;and many more friends who believed, every step of the way.
          </p>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="container-luxe grid items-center gap-12 py-24 lg:grid-cols-2">
          <div>
            <p className="eyebrow text-gold">The name</p>
            <Reveal as="h2" className="display-lg mt-4">
              Why &ldquo;Painite&rdquo;.
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className="max-w-lg text-[14px] leading-[1.75] text-ivory/80">
            Painite is one of the rarest gemstones on earth; for decades, only a handful of specimens were known to
            exist. I took the name as a promise: that what we create should be just as rare, just as deliberately
            sought, and never mass-produced.
          </Reveal>
        </div>
      </section>

      <CtaBand title="Begin with a conversation." cta="Start planning" />
    </>
  );
}
