import Service from "@models/Service";
import AdminTable, { Flash, PageHeader, fmtDate } from "@/components/admin/AdminTable";
import { PublishedBadge } from "@/components/admin/Badge";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";

export const metadata = { title: "Experiences" };

export default async function ExperiencesAdmin({ searchParams }) {
  await adminDb();
  const sp = await searchParams;
  const rows = (await Service.find().sort({ order: 1, name: 1 }).lean()).map(toPlain);

  return (
    <>
      <PageHeader
        title="Experiences"
        description="Themes like heritage, wildlife and wellness."
        newHref="/admin/experiences/new"
        newLabel="New experience"
      />
      {sp.deleted && <Flash>Experience deleted.</Flash>}
      <AdminTable
        rows={rows}
        href={(e) => `/admin/experiences/${e.id}`}
        empty="No experiences yet."
        columns={[
          { label: "Experience", primary: true, render: (e) => e.name },
          { label: "Line", render: (e) => e.line || "—", className: "text-muted" },
          { label: "Updated", render: (e) => fmtDate(e.updatedAt), className: "text-muted whitespace-nowrap" },
          { label: "Status", render: (e) => <PublishedBadge published={e.published} /> },
        ]}
      />
    </>
  );
}
