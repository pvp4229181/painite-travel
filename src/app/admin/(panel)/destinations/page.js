import Destination from "@models/Destination";
import Region from "@models/Region";
import AdminTable, { Flash, PageHeader, fmtDate } from "@/components/admin/AdminTable";
import { PublishedBadge } from "@/components/admin/Badge";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";

export const metadata = { title: "Destinations" };

export default async function DestinationsAdmin({ searchParams }) {
  await adminDb();
  const sp = await searchParams;
  const [rows, regionCounts] = await Promise.all([
    Destination.find().sort({ order: 1, name: 1 }).lean(),
    Region.aggregate([{ $group: { _id: "$destination", n: { $sum: 1 } } }]),
  ]);
  const regions = Object.fromEntries(regionCounts.map((r) => [r._id, r.n]));

  return (
    <>
      <PageHeader
        title="Destinations"
        description="The countries Painite plans journeys in."
        newHref="/admin/destinations/new"
        newLabel="New destination"
      />
      {sp.deleted && <Flash>Destination deleted.</Flash>}
      <AdminTable
        rows={rows.map(toPlain)}
        href={(d) => `/admin/destinations/${d.id}`}
        empty="No destinations yet."
        columns={[
          { label: "Destination", primary: true, render: (d) => d.name },
          { label: "Tagline", render: (d) => d.tagline || "—", className: "text-muted" },
          { label: "Regions", render: (d) => regions[d.slug] || 0, className: "text-muted" },
          { label: "Updated", render: (d) => fmtDate(d.updatedAt), className: "text-muted whitespace-nowrap" },
          { label: "Status", render: (d) => <PublishedBadge published={d.published} /> },
        ]}
      />
    </>
  );
}
