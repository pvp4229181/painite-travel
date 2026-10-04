import Link from "next/link";
import Enquiry, { ENQUIRY_STATUSES } from "@models/Enquiry";
import AdminTable, { Flash, PageHeader, fmtDateTime } from "@/components/admin/AdminTable";
import { ENQUIRY_STATUS, EnquiryStatus } from "@/components/admin/Badge";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";
import { cn } from "@/lib/utils";

export const metadata = { title: "Enquiries" };

export default async function EnquiriesPage({ searchParams }) {
  await adminDb();
  const sp = await searchParams;
  const status = ENQUIRY_STATUSES.includes(sp.status) ? sp.status : "";

  const [rows, grouped] = await Promise.all([
    Enquiry.find(status ? { status } : {}).sort({ createdAt: -1 }).limit(500).lean(),
    Enquiry.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
  ]);
  const count = Object.fromEntries(grouped.map((g) => [g._id, g.n]));
  const total = grouped.reduce((a, g) => a + g.n, 0);

  const tabs = [{ key: "", label: "All", n: total }, ...ENQUIRY_STATUSES.map((s) => ({ key: s, label: ENQUIRY_STATUS[s].label, n: count[s] || 0 }))];

  return (
    <>
      <PageHeader title="Enquiries" description="Messages sent through the Plan your journey form." />
      {sp.deleted && <Flash>Enquiry deleted.</Flash>}

      <nav aria-label="Filter by status" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.key || "all"}
            href={t.key ? `/admin/enquiries?status=${t.key}` : "/admin/enquiries"}
            aria-current={status === t.key ? "page" : undefined}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-[13px] transition-colors",
              status === t.key ? "border-ink bg-ink text-ivory" : "border-line bg-white/70 hover:border-text/40",
            )}
          >
            {t.label} <span className={status === t.key ? "text-ivory/60" : "text-muted"}>{t.n}</span>
          </Link>
        ))}
      </nav>

      <AdminTable
        rows={rows.map(toPlain)}
        href={(e) => `/admin/enquiries/${e.id}`}
        empty={status ? "No enquiries with this status." : "No enquiries yet."}
        columns={[
          {
            label: "From",
            primary: true,
            render: (e) => (
              <>
                {e.name}
                <span className="block text-[12.5px] font-normal text-muted">{e.email}</span>
              </>
            ),
          },
          { label: "Interested in", render: (e) => e.journey || e.destination || "—" },
          { label: "Dates", render: (e) => e.dates || "—", className: "text-muted" },
          { label: "Received", render: (e) => fmtDateTime(e.createdAt), className: "text-muted whitespace-nowrap" },
          { label: "Status", render: (e) => <EnquiryStatus status={e.status} /> },
        ]}
      />
    </>
  );
}
