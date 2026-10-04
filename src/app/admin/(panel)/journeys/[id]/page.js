import { notFound } from "next/navigation";
import Destination from "@models/Destination";
import JourneyForm from "@/components/admin/forms/JourneyForm";
import { adminDb } from "@/lib/admin/data";
import { loadForEdit } from "@/lib/admin/resources";

export const metadata = { title: "Edit journey" };

export default async function JourneyEditor({ params }) {
  await adminDb();
  const { id } = await params;
  const [journey, destinations] = await Promise.all([
    loadForEdit("journeys", id),
    Destination.find().sort({ order: 1 }).select("slug name").lean(),
  ]);
  if (!journey) notFound();

  return (
    <JourneyForm
      key={id}
      id={id}
      initial={journey}
      destinationOptions={destinations.map((d) => ({ value: d.slug, label: d.name }))}
    />
  );
}
