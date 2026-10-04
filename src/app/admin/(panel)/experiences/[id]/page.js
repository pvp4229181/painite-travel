import { notFound } from "next/navigation";
import ExperienceForm from "@/components/admin/forms/ExperienceForm";
import { adminDb } from "@/lib/admin/data";
import { loadForEdit } from "@/lib/admin/resources";

export const metadata = { title: "Edit experience" };

export default async function ExperienceEditor({ params }) {
  await adminDb();
  const { id } = await params;
  const experience = await loadForEdit("experiences", id);
  if (!experience) notFound();
  return <ExperienceForm key={id} id={id} initial={experience} />;
}
