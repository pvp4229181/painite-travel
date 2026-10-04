import { formatDate } from "@/data/journal";

export default function LegalPage({ doc }) {
  return (
    <section className="border-t-[72px] border-ink bg-cream text-text">
      <div className="container-luxe py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="display-lg">{doc.title}</h1>
          <p className="eyebrow mt-4 text-muted">Last updated {formatDate(doc.updated)}</p>
          <div className="mt-12 space-y-10">
            {doc.sections.map((s) => (
              <div key={s.heading}>
                <h2 className="font-serif text-2xl">{s.heading}</h2>
                <p className="mt-3 text-[14.5px] leading-[1.8] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
