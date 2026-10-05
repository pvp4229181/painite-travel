import Link from "next/link";
import { ArrowUpRight, Route, Hotel, Compass, Car, Plane, Sparkles, ConciergeBell, Leaf, Users, FileCheck, TicketsPlane, Headphones } from "lucide-react";
import { serviceDetails, services } from "@/data/services";

const icons = [Route, Hotel, Compass, Car, Plane, Sparkles, ConciergeBell, Leaf, Users, FileCheck, TicketsPlane, Headphones];

export default function ServicesList({ detailed = false, limit }) {
  return (
    <ol className={`services-cards ${detailed ? "services-cards-detailed" : ""}`}>
      {services.slice(0, limit).map((service, index) => {
        const page = serviceDetails.find((d) => d.listSlug === service.slug);
        const Icon = icons[index];
        return (
          <li key={service.slug} id={service.slug} className="scroll-mt-28">
            <Link href={page ? `/services/${page.slug}` : `/plan-your-journey?service=${service.slug}`} className="service-card group">
              <div className="service-card-top"><span className="service-icon"><Icon size={22} strokeWidth={1.3} aria-hidden="true" /></span><span className="eyebrow text-muted">{String(index + 1).padStart(2, "0")}</span></div>
              <h3 className="font-serif">{service.name}</h3>
              <p>{service.description}</p>
              <span className="service-card-link">{page ? "Discover more" : "Discuss with us"}<ArrowUpRight size={16} aria-hidden="true" /></span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
