import { cn } from "@/lib/utils";

const tones = {
  green: "bg-[#4f6f3f]/12 text-[#3d5a30]",
  gray: "bg-text/8 text-muted",
  terracotta: "bg-terracotta/12 text-terracotta-deep",
  gold: "bg-gold/20 text-[#7a5a22]",
  blue: "bg-[#2f5a73]/12 text-[#2f5a73]",
};

export function Badge({ tone = "gray", children, className }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11.5px] font-medium whitespace-nowrap", tones[tone], className)}>
      {children}
    </span>
  );
}

export const ENQUIRY_STATUS = {
  new: { label: "New", tone: "terracotta" },
  contacted: { label: "Contacted", tone: "gold" },
  proposal: { label: "Proposal sent", tone: "blue" },
  booked: { label: "Booked", tone: "green" },
  closed: { label: "Closed", tone: "gray" },
};

export const ENQUIRY_STATUS_OPTIONS = Object.entries(ENQUIRY_STATUS).map(([value, s]) => ({ value, label: s.label }));

export function EnquiryStatus({ status }) {
  const s = ENQUIRY_STATUS[status] ?? ENQUIRY_STATUS.new;
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function PublishedBadge({ published }) {
  return <Badge tone={published ? "green" : "gray"}>{published ? "Published" : "Draft"}</Badge>;
}
