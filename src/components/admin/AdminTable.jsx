import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({ title, description, newHref, newLabel, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-[2.2rem] leading-tight">{title}</h1>
        {description && <p className="mt-1 text-[13.5px] text-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {children}
        {newHref && (
          <Link
            href={newHref}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[13px] text-ivory hover:bg-ink-soft"
          >
            <Plus className="size-4" strokeWidth={1.5} /> {newLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * columns: [{ label, render(row), className, primary }]. The `primary` column
 * holds the row's link, so each row is keyboard reachable.
 */
export default function AdminTable({ rows, columns, href, empty }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-white/50 px-6 py-14 text-center text-[14px] text-muted">{empty}</div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white/70">
      <table className="w-full min-w-[640px] text-left text-[13.5px]">
        <thead>
          <tr className="border-b border-line text-[11.5px] tracking-wide text-muted uppercase">
            {columns.map((c) => (
              <th key={c.label} scope="col" className={cn("px-4 py-3 font-medium", c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="relative border-b border-line/70 transition-colors last:border-0 hover:bg-cream/60">
              {columns.map((c) => (
                <td key={c.label} className={cn("px-4 py-3.5 align-middle", c.className)}>
                  {c.primary ? (
                    <Link href={href(row)} className="font-medium after:absolute after:inset-0 hover:underline focus-visible:underline">
                      {c.render(row)}
                    </Link>
                  ) : (
                    c.render(row)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Flash({ children }) {
  return (
    <div role="status" className="mb-5 rounded-lg border border-[#4f6f3f]/30 bg-[#4f6f3f]/8 px-4 py-2.5 text-[13px] text-[#3d5a30]">
      {children}
    </div>
  );
}

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Kolkata",
});

export const fmtDate = (d) => (d ? dateFmt.format(new Date(d)) : "—");
export const fmtDateTime = (d) => (d ? dateTimeFmt.format(new Date(d)) : "—");
