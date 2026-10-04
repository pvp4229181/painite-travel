import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Mail, Phone } from "lucide-react";
import { fmtDateTime } from "@/components/admin/AdminTable";
import { Badge, EnquiryStatus } from "@/components/admin/Badge";
import EnquiryPanel from "@/components/admin/EnquiryPanel";
import { Section } from "@/components/admin/fields";
import { loadForEdit } from "@/lib/admin/resources";
import { adminDb } from "@/lib/admin/data";

export const metadata = { title: "Enquiry" };

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-4 border-b border-line/70 py-2.5 text-[14px] last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default async function EnquiryPage({ params }) {
  await adminDb();
  const { id } = await params;
  const e = await loadForEdit("enquiries", id);
  if (!e) notFound();

  const subject = encodeURIComponent(`Your Painite journey${e.journey ? `: ${e.journey}` : ""}`);

  return (
    <>
      <Link href="/admin/enquiries" className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-text">
        <ChevronLeft className="size-3.5" strokeWidth={1.5} /> Enquiries
      </Link>
      <div className="mt-1 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.2rem] leading-tight">{e.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-muted">
            Received {fmtDateTime(e.createdAt)} <EnquiryStatus status={e.status} />
            {!e.emailDelivered && <Badge tone="gold">Not emailed</Badge>}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`mailto:${e.email}?subject=${subject}`}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[13px] text-ivory hover:bg-ink-soft"
          >
            <Mail className="size-4" strokeWidth={1.5} /> Reply by email
          </a>
          {e.phone && (
            <a
              href={`tel:${e.phone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-4 py-2.5 text-[13px] hover:border-text/40"
            >
              <Phone className="size-4" strokeWidth={1.5} /> Call
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Section title="Their journey">
            {e.message ? (
              <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap">{e.message}</p>
            ) : (
              <p className="text-[14px] text-muted">No message was included.</p>
            )}
          </Section>
          <Section title="Details">
            <dl>
              <Row label="Email" value={e.email} />
              <Row label="Phone" value={e.phone} />
              <Row label="Journey" value={e.journey} />
              <Row label="Destination" value={e.destination} />
              <Row label="Travel dates" value={e.dates} />
              <Row label="Travellers" value={e.travellers} />
              <Row label="Travel style" value={e.style} />
              <Row label="Interests" value={e.interests?.join(", ")} />
            </dl>
          </Section>
        </div>
        <aside>
          <EnquiryPanel id={e.id} initialStatus={e.status} initialNotes={e.notes} />
        </aside>
      </div>
    </>
  );
}
