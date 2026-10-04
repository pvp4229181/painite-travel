import Tour from "@models/Tour";
import AdminTable, { Flash, PageHeader, fmtDate } from "@/components/admin/AdminTable";
import { Badge, PublishedBadge } from "@/components/admin/Badge";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";

export const metadata = { title: "Journeys" };

export default async function JourneysAdmin({ searchParams }) {
  await adminDb();
  const sp = await searchParams;
  const rows = (await Tour.find().sort({ order: 1, title: 1 }).lean()).map(toPlain);

  return (
    <>
      <PageHeader title="Journeys" description="Sample itineraries shown on the website." newHref="/admin/journeys/new" newLabel="New journey" />
      {sp.deleted && <Flash>Journey deleted.</Flash>}
      <AdminTable
        rows={rows}
        href={(j) => `/admin/journeys/${j.id}`}
        empty="No journeys yet."
        columns={[
          { label: "Journey", primary: true, render: (j) => j.title },
          { label: "Region", render: (j) => j.region || "—", className: "text-muted" },
          { label: "Length", render: (j) => `${j.days} days`, className: "text-muted whitespace-nowrap" },
          { label: "Updated", render: (j) => fmtDate(j.updatedAt), className: "text-muted whitespace-nowrap" },
          {
            label: "Status",
            render: (j) => (
              <span className="flex gap-1.5">
                <PublishedBadge published={j.published} />
                {j.featured && <Badge tone="gold">Featured</Badge>}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}
