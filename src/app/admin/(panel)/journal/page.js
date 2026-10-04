import Article from "@models/Article";
import AdminTable, { Flash, PageHeader, fmtDate } from "@/components/admin/AdminTable";
import { PublishedBadge } from "@/components/admin/Badge";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";

export const metadata = { title: "Journal" };

export default async function JournalAdmin({ searchParams }) {
  await adminDb();
  const sp = await searchParams;
  const rows = (await Article.find().sort({ date: -1 }).lean()).map(toPlain);

  return (
    <>
      <PageHeader title="Journal" description="Articles and travel notes." newHref="/admin/journal/new" newLabel="New article" />
      {sp.deleted && <Flash>Article deleted.</Flash>}
      <AdminTable
        rows={rows}
        href={(a) => `/admin/journal/${a.id}`}
        empty="No articles yet."
        columns={[
          { label: "Title", primary: true, render: (a) => a.title },
          { label: "Category", render: (a) => a.category || "—", className: "text-muted" },
          { label: "Date", render: (a) => fmtDate(a.date), className: "text-muted whitespace-nowrap" },
          { label: "Status", render: (a) => <PublishedBadge published={a.published} /> },
        ]}
      />
    </>
  );
}
