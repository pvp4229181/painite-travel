import { notFound } from "next/navigation";
import ExperienceEditorial from "@/components/sections/ExperienceEditorial";
import CtaBand from "@/components/sections/CtaBand";
import Gallery from "@/components/sections/Gallery";
import { getDestinations, getExperience, getExperiences } from "@/lib/content";
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

  return <><ExperienceEditorial experience={e} destinations={where} others={others} /><Gallery items={e.gallery} eyebrow="Gallery" title={`${e.name} in pictures`} className="bg-cream-soft" /><CtaBand title={`Let us make ${e.name.toLowerCase()} part of your journey.`} cta="Plan your experience" href={`/plan-your-journey?experience=${encodeURIComponent(e.slug)}`} /></>;
}
