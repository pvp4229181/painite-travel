import Link from "next/link";
import { BookOpen, Inbox, MapPin, Route, Sparkles } from "lucide-react";
import Article from "@models/Article";
import Destination from "@models/Destination";
import Enquiry from "@models/Enquiry";
import Service from "@models/Service";
import Tour from "@models/Tour";
import AdminTable, { PageHeader, fmtDateTime } from "@/components/admin/AdminTable";
import { EnquiryStatus } from "@/components/admin/Badge";
import ImportButton from "@/components/admin/ImportButton";
import { adminDb } from "@/lib/admin/data";
import { toPlain } from "@/lib/content";

export const metadata = { title: "Overview" };

async function counts(Model) {
  const [total, published] = await Promise.all([Model.countDocuments(), Model.countDocuments({ published: true })]);
  return { total, published };
}

export default async function Dashboard() {
  await adminDb();
  const [journeys, destinations, experiences, articles, newEnquiries, totalEnquiries, recent] = await Promise.all([
    counts(Tour),
    counts(Destination),
    counts(Service),
    counts(Article),
    Enquiry.countDocuments({ status: "new" }),
    Enquiry.countDocuments(),
    Enquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  const needsImport = [journeys, destinations, experiences, articles].some((c) => c.total === 0);

  const stats = [
    { label: "New enquiries", value: newEnquiries, sub: `${totalEnquiries} in total`, href: "/admin/enquiries?status=new", Icon: Inbox, accent: newEnquiries > 0 },
    { label: "Journeys", value: journeys.published, sub: `${journeys.total} in total`, href: "/admin/journeys", Icon: Route },
    { label: "Destinations", value: destinations.published, sub: `${destinations.total} in total`, href: "/admin/destinations", Icon: MapPin },
    { label: "Experiences", value: experiences.published, sub: `${experiences.total} in total`, href: "/admin/experiences", Icon: Sparkles },
    { label: "Articles", value: articles.published, sub: `${articles.total} in total`, href: "/admin/journal", Icon: BookOpen },
  ];

  return (
    <>
      <PageHeader title="Overview" description="What's happening across the website." />

      {needsImport && (
        <div className="mb-6 rounded-xl border border-gold/50 bg-gold/10 p-5 md:p-6">
          <h2 className="font-serif text-2xl">Bring the website&apos;s content into the admin</h2>
          <p className="mt-2 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Some sections are still showing the starter content written into the codebase, so they can&apos;t be edited here yet.
            Importing copies it into the database. Anything already imported is left untouched.
          </p>
          <div className="mt-4">
            <ImportButton />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-line bg-white/70 p-4 transition-colors hover:border-text/30"
          >
            <s.Icon className={s.accent ? "size-4 text-terracotta" : "size-4 text-muted"} strokeWidth={1.5} />
            <p className="mt-4 font-serif text-4xl leading-none">{s.value}</p>
            <p className="mt-2 text-[13px] font-medium">{s.label}</p>
            <p className="text-[12px] text-muted">{s.label === "New enquiries" ? s.sub : `published · ${s.sub}`}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 mb-4 flex items-end justify-between">
        <h2 className="font-serif text-2xl">Latest enquiries</h2>
        <Link href="/admin/enquiries" className="text-[13px] text-muted underline-offset-4 hover:text-text hover:underline">
          View all
        </Link>
      </div>
      <AdminTable
        rows={recent.map(toPlain)}
        href={(e) => `/admin/enquiries/${e.id}`}
        empty="No enquiries yet. They'll appear here when someone sends the form on the website."
        columns={[
          { label: "From", primary: true, render: (e) => e.name },
          { label: "Interested in", render: (e) => e.journey || e.destination || "—", className: "text-muted" },
          { label: "Received", render: (e) => fmtDateTime(e.createdAt), className: "text-muted whitespace-nowrap" },
          { label: "Status", render: (e) => <EnquiryStatus status={e.status} /> },
        ]}
      />
    </>
  );
}
