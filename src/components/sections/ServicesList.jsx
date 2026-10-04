import { services } from "@/data/services";

export default function ServicesList({ detailed = false }) {
  return (
    <ol className="mt-12 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service, index) => (
        <li key={service.slug} id={service.slug} className="scroll-mt-28 border-t border-line py-6">
          <span className="eyebrow text-terracotta">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 font-serif text-2xl">{service.name}</h3>
          {detailed && <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>}
        </li>
      ))}
    </ol>
  );
}
