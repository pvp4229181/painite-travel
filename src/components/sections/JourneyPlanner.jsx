import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, Phone, MessageCircle, Check } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { site } from "@/data/site";

export default function JourneyPlanner({ destinations, experiences, defaultDestination, defaultExperience, journey }) {
  return <div className="journey-planner">
    <section className="planner-hero">
      <Image src="/images/ai/island.webp" alt="A peaceful island resort at sunset" fill priority sizes="100vw" className="object-cover" />
      <div className="planner-hero-shade" aria-hidden="true" />
      <div className="container-luxe"><Link href="/" className="planner-breadcrumb">PAINITE TRAVELS <span>/</span> PLAN YOUR JOURNEY</Link><p className="eyebrow">LET YOUR NEXT CHAPTER BEGIN</p><h1>A little inspiration.<br /><em>A journey entirely yours.</em></h1><p>Tell us what you are dreaming of. We will take care of the details.</p></div>
    </section>
    <div className="container-luxe planner-main">
      <aside className="planner-sidebar">
        <p className="eyebrow text-terracotta">TRAVEL STARTS WITH A CONVERSATION</p><h2>Real people.<br />Remarkable journeys.</h2>
        <p className="planner-sidebar-intro">Your enquiry goes to a dedicated curator who knows our destinations first-hand. Share a few ideas, and we will shape the possibilities together.</p>
        <div className="planner-curator-photo"><Image src="/images/ai/customer-enquiry.png" alt="A Painite-style travel consultation with guests" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" /></div>
        <ol className="planner-next-steps">{[{title:"We listen",text:"Your curator replies personally within 24 hours."},{title:"We create",text:"A considered proposal, shaped around your interests."},{title:"We refine",text:"Together, we make the details feel right."}].map((step,i)=><li key={step.title}><span>{String(i+1).padStart(2,"0")}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}</ol>
        <div className="planner-direct"><p className="eyebrow">PREFER TO SPEAK DIRECTLY?</p><a href={site.phoneHref}><Phone size={17} />{site.phone}<ArrowUpRight size={15} /></a><a href={`mailto:${site.email}`}><Mail size={17} />{site.email}<ArrowUpRight size={15} /></a><a href={`https://wa.me/${site.phoneHref.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"><MessageCircle size={17} />Chat on WhatsApp<ArrowUpRight size={15} /></a></div>
      </aside>
      <section id="enquire" className="planner-form-panel" aria-labelledby="planner-form-title">
        <div className="planner-form-heading"><div className="planner-form-eyebrow"><p className="eyebrow text-terracotta">YOUR PRIVATE ENQUIRY</p><span><Clock3 size={14} />24-hour personal reply</span></div><h2 id="planner-form-title">Where would you love to go?</h2><p>A few details are enough to begin. Your name and email are the only essentials.</p></div>
        <div className="planner-form-body">{journey && <p className="enquiry-selected">Your inspiration: <strong>{journey.title}</strong></p>}<EnquiryForm destinations={destinations} experiences={experiences} defaultDestination={defaultDestination} defaultExperience={defaultExperience} defaultJourney={journey?.slug ?? ""} /></div>
        <div className="planner-form-footnote"><Check size={16} />Personally reviewed by your travel curator.</div>
      </section>
    </div>
    <section className="planner-visit"><div className="container-luxe"><div><p className="eyebrow text-terracotta">COME SAY HELLO</p><h2>Find us in Agra.</h2></div><address>{site.streetAddress}, Agra, Uttar Pradesh {site.postalCode}, India<br /><span>{site.hours}</span></address><a href={site.mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={18} /></a></div></section>
  </div>;
}
