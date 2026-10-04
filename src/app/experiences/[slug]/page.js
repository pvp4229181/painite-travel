import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { getDestinations, getExperience, getExperiences } from "@/lib/content";
import { Reveal, Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getExperiences()).map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const e = await getExperience(slug);
  if (!e) return {};
  return buildMetadata({ title: e.name, description: `${e.line} ${e.body}`, path: `/experiences/${e.slug}` });
}

export default async function ExperiencePage({ params }) {
  const { slug } = await params;
  const e = await getExperience(slug);
  if (!e) notFound();

  const [destinations, experiences] = await Promise.all([getDestinations(), getExperiences()]);
  const where = destinations.filter((d) => d.experiences?.includes(e.slug));
  const others = experiences.filter((x) => x.slug !== e.slug);

  return (
    <>
      <PageHero scene={e.scene} sun={e.sun} eyebrow="Experiences" title={e.name} subtitle={e.line}>
        <Button href="/plan-your-journey">Plan your journey</Button>
      </PageHero>

      <section className="bg-cream text-text">
        <div className="container-luxe grid gap-14 py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal as="p" className="font-serif text-[1.75rem] leading-snug md:text-[2rem]">
              {e.body}
            </Reveal>
            {where.length > 0 && (
              <Reveal delay={0.1} className="mt-10">
                <p className="eyebrow text-muted">Where we offer it</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {where.map((d) => (
                    <Link
                      key={d.slug}
                      href={`/destinations/${d.slug}`}
                      className="rounded-full border border-line px-4 py-1.5 text-[13px] transition-colors hover:border-terracotta hover:text-terracotta"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </Reveal>
            )}
          </div>
          <div>
            <Reveal as="h2" className="eyebrow text-muted">
              Moments we love
            </Reveal>
            <Stagger as="ul" className="mt-4 border-t border-line">
              {e.moments.map((m, i) => (
                <StaggerItem as="li" key={m} className="flex gap-6 border-b border-line py-5">
                  <span className="eyebrow pt-1.5 text-terracotta">0{i + 1}</span>
                  <span className="font-serif text-[1.4rem] leading-snug">{m}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="bg-ink text-ivory">
        <div className="container-luxe py-16">
          <p className="eyebrow text-ivory/60">More experiences</p>
          <div className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
            {others.map((x) => (
              <Link key={x.slug} href={`/experiences/${x.slug}`} className="font-serif text-3xl text-ivory/85 transition-colors hover:text-gold">
                {x.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
