import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Check, PlaneLanding, PlaneTakeoff, Luggage, Compass, Leaf, BookOpen, Languages } from "lucide-react";
import Landscape from "@/components/ui/Landscape";
import { Button } from "@/components/ui/Button";

const directions = {
  "bespoke-travel": { eyebrow: "CREATED FROM A CONVERSATION", heading: "A journey with your name on it.", line: "Your interests. Your rhythm. Every detail considered.", image: "/images/ai/customer-enquiry.png", alt: "Guests discussing their journey with a travel curator", section: "From an idea to an extraordinary journey." },
  "luxury-hotels": { eyebrow: "THE ART OF A BEAUTIFUL STAY", heading: "Stay somewhere that stays with you.", line: "Heritage palaces, intimate lodges and island hideaways.", image: "/images/ai/island.webp", alt: "Luxury overwater villas beside a tropical island", section: "A collection of possibilities." },
  "private-guides": { eyebrow: "MEET THE PEOPLE WHO KNOW", heading: "A place comes alive through its people.", line: "Local knowledge. Personal connections. A deeper perspective.", image: "/images/ai/service-guides-hero.png", alt: "A private guide exploring palace architecture with guests", section: "Follow your curiosity." },
  "airport-assistance": { eyebrow: "FROM TOUCHDOWN TO TAKE-OFF", heading: "Arrive with ease. Leave with memories.", line: "A warm welcome and a well-coordinated onward journey.", image: "/images/ai/service-airport-hero.png", alt: "An airport host welcoming travellers with their luggage", section: "Every connection, considered." },
  "yoga-retreats": { eyebrow: "SPACE TO SLOW DOWN", heading: "You hold the space. We handle the details.", line: "Thoughtful retreat planning for teachers, studios and communities.", image: "/images/ai/service-yoga-hero.png", alt: "A small yoga retreat group meditating beside tropical gardens", section: "The foundations of a meaningful retreat." },
};

function Item({ item, number }) {
  return <><span className="service-detail-number">{String(number).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p></>;
}

export default function ServiceEditorial({ service, allServices }) {
  const d = directions[service.slug];
  return <div className={`service-editorial service-${service.slug}`}>
    <section className="service-screen-hero">
      <Image src={d.image} alt={d.alt} fill priority sizes="100vw" className="service-screen-image" />
      <div className="service-screen-shade" aria-hidden="true" />
      <div className="container-luxe service-screen-content">
        <Link href="/services" className="service-screen-back">OUR SERVICES <span>/</span> {service.navLabel}</Link>
        <div className="service-screen-copy">
          <p className="eyebrow">{d.eyebrow}</p>
          <h1>{d.heading}</h1>
          <p className="service-screen-line">{d.line}</p>
          <Button href="#enquire" variant="gold">{service.cta}</Button>
        </div>
        <div className="service-screen-footer"><span>PRIVATE TRAVEL. PERSONAL ATTENTION.</span><Link href="#service-details">Explore {service.navLabel.toLowerCase()} <ArrowUpRight size={15} /></Link></div>
      </div>
    </section>
    <nav className="service-page-nav" aria-label="Explore services"><div className="container-luxe">{allServices.map(s => <Link href={`/services/${s.slug}`} key={s.slug} aria-current={s.slug === service.slug ? "page" : undefined}>{s.navLabel}</Link>)}</div></nav>
    <section id="service-details" className="service-editorial-intro container-luxe"><p className="eyebrow text-terracotta">THE PAINITE APPROACH</p><p>{service.intro}</p></section>

    {service.slug === "bespoke-travel" && <section className="service-bespoke-content"><div className="container-luxe service-content-split"><div className="service-section-heading"><p className="eyebrow text-terracotta">DESIGNED WITH YOU</p><h2>{d.section}</h2><p>There is room to explore, refine and change your mind. We build the details around what matters to you.</p><div className="service-small-photo"><Landscape scene="heritage" /></div></div><ol className="service-design-timeline">{service.items.map((item,i) => <li key={item.title}><Item item={item} number={i+1} /></li>)}</ol></div></section>}

    {service.slug === "luxury-hotels" && <section className="service-stays-content"><div className="container-luxe"><div className="service-section-heading"><p className="eyebrow text-terracotta">CHARACTER IN EVERY CHECK-IN</p><h2>{d.section}</h2></div><div className="service-stay-grid">{service.items.map((item,i) => <article key={item.title} className={i===0 ? "service-stay-featured" : ""}><div className="service-stay-photo"><Landscape scene={["heritage","wildlife","hero","himalaya","island","island","wellness"][i]} /></div><div className="service-stay-copy"><Item item={item} number={i+1} /></div></article>)}</div><p className="service-editorial-note">Every stay is selected around your preferences, your route and the way you like to travel.</p></div></section>}

    {service.slug === "private-guides" && <section className="service-guides-content"><div className="container-luxe"><div className="service-section-heading"><p className="eyebrow text-gold-soft">KNOWLEDGE THAT OPENS DOORS</p><h2>{d.section}</h2></div><div className="service-guide-specialists">{[2,3,4].map((n,i) => { const Icon=[BookOpen,Leaf,Compass][i]; return <article key={n}><div className="service-guide-photo"><Landscape scene={["heritage","wildlife","gastronomy"][i]} /></div><div><Icon size={25} strokeWidth={1.2} aria-hidden="true" /><h3>{service.items[n].title}</h3><p>{service.items[n].text}</p></div></article>; })}</div><div className="service-guide-assurance">{[0,1,5].map(n => <article key={n}>{n===5 ? <Languages size={22} aria-hidden="true" /> : <Check size={22} aria-hidden="true" />}<h3>{service.items[n].title}</h3><p>{service.items[n].text}</p></article>)}</div></div></section>}

    {service.slug === "airport-assistance" && <section className="service-airport-content"><div className="container-luxe"><div className="service-section-heading"><p className="eyebrow text-terracotta">A SMOOTHER WAY THROUGH</p><h2>{d.section}</h2></div><div className="airport-service-columns">{[{title:"On arrival",icon:PlaneLanding,indices:[0,1,2,3]},{title:"On departure & beyond",icon:PlaneTakeoff,indices:[4,5,6]}].map(group => <article key={group.title}><div className="airport-column-heading"><group.icon size={30} strokeWidth={1.2} aria-hidden="true" /><h3>{group.title}</h3></div><ul>{group.indices.map(n => <li key={n}><Check size={17} aria-hidden="true" /><div><h4>{service.items[n].title}</h4><p>{service.items[n].text}</p></div></li>)}</ul></article>)}</div><div className="airport-planning-note"><Luggage size={28} strokeWidth={1.2} aria-hidden="true" /><div><h3>Let us connect the details.</h3><p>Share your airport, flight times, number of travellers and any assistance you need when you enquire.</p></div><Link href="#enquire">Arrange your welcome <ArrowUpRight size={17} /></Link></div></div></section>}

    {service.slug === "yoga-retreats" && <section className="service-retreat-content"><div className="container-luxe"><div className="service-retreat-intro"><div className="service-retreat-photo"><Landscape scene="wellness" /></div><div className="service-section-heading"><p className="eyebrow text-terracotta">ROOM TO BE PRESENT</p><h2>{d.section}</h2><p>Focus on your practice and the people in front of you. We coordinate the practical details around your retreat.</p><p className="eyebrow mt-8 text-terracotta">DESIGNED FOR</p><ul className="service-retreat-audience">{service.audience.map(a => <li key={a}>{a}</li>)}</ul></div></div><div className="service-retreat-grid">{service.items.map((item,i) => <article key={item.title}><Item item={item} number={i+1} /></article>)}</div></div></section>}
  </div>;
}
