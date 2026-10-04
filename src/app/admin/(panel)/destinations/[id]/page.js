import { notFound } from "next/navigation";
import Service from "@models/Service";
import DestinationForm from "@/components/admin/forms/DestinationForm";
import { adminDb } from "@/lib/admin/data";
import { loadForEdit } from "@/lib/admin/resources";

export const metadata = { title: "Edit destination" };

export default async function DestinationEditor({ params }) {
  await adminDb();
  const { id } = await params;
  const [destination, experiences] = await Promise.all([
    loadForEdit("destinations", id),
    Service.find().sort({ order: 1 }).select("slug name").lean(),
  ]);
  if (!destination) notFound();

  return (
    <DestinationForm
      key={id}
      id={id}
      initial={destination}
      experienceOptions={experiences.map((e) => ({ value: e.slug, label: e.name }))}
    />
  );
}
