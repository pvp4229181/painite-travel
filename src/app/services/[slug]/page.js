import { notFound } from "next/navigation";
import ServiceEditorial from "@/components/sections/ServiceEditorial";
import EnquirySection from "@/components/sections/EnquirySection";
import { getServiceDetail, serviceDetails } from "@/data/services";
import { getDestinations, getExperiences } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return serviceDetails.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getServiceDetail(slug);
  if (!s) return {};
  return buildMetadata({ title: s.name, description: s.intro, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  const s = getServiceDetail(slug);
  if (!s) notFound();
  const [destinations, experiences] = await Promise.all([getDestinations(), getExperiences()]);

  return <><ServiceEditorial service={s} allServices={serviceDetails} /><EnquirySection destinations={destinations} experiences={experiences} /></>;
}
