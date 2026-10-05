import Image from "next/image";
import { Clock3, Mail, Phone, ArrowUpRight } from "lucide-react";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { site } from "@/data/site";

export default function EnquirySection({ destinations, experiences, defaultDestination = "", defaultExperience = "", journey, standalone = false }) {
  const Heading = standalone ? "h1" : "h2";
  return <section id="enquire" className={`enquiry-section ${standalone ? "enquiry-standalone" : ""}`}>
    <div className="container-luxe enquiry-layout">
      <div className="enquiry-introduction">
        <p className="eyebrow text-terracotta">ENQUIRE PRIVATELY</p>
        <Heading>Every great journey<br />starts with <em>you.</em></Heading>
        <p className="enquiry-intro-copy">A place you have always dreamed of. A special occasion. Or simply a feeling. Tell us what you have in mind, and we will take it from there.</p>
        <div className="enquiry-photo"><Image src="/images/ai/customer-enquiry.png" alt="A travel consultant listening to guests as they discuss their private journey" fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" /><span>PERSONAL FROM THE VERY FIRST HELLO.</span></div>
        <div className="enquiry-response"><Clock3 size={20} strokeWidth={1.4} /><div><h3>A personal reply within 24 hours</h3><p>Your enquiry goes directly to a Painite travel curator.</p></div></div>
        <div className="enquiry-contact"><p className="eyebrow">PREFER A CONVERSATION?</p><a href={`mailto:${site.email}`}><Mail size={16} />{site.email}<ArrowUpRight size={14} /></a><a href={site.phoneHref}><Phone size={16} />{site.phone}<ArrowUpRight size={14} /></a><a href={`https://wa.me/${site.phoneHref.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">Chat on WhatsApp<ArrowUpRight size={14} /></a></div>
        {standalone && <address className="enquiry-office"><p>{site.streetAddress}, Agra, Uttar Pradesh {site.postalCode}, India</p><p>{site.hours}</p><a href={site.mapsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={13} /></a></address>}
      </div>
      <div className="enquiry-form-card">
        <div className="enquiry-card-header"><div className="enquiry-card-topline"><p className="eyebrow">A JOURNEY MADE FOR YOU</p><span><Clock3 size={14} aria-hidden="true" /> Reply within 24 hours</span></div><h2>Where shall we take you?</h2><p>Share a little about yourself. We will take care of the possibilities.</p></div>
        <div className="enquiry-card-body">
        {journey && <p className="enquiry-selected">Enquiring about <strong>{journey.title}</strong></p>}
        <EnquiryForm destinations={destinations} experiences={experiences} defaultDestination={defaultDestination} defaultJourney={journey?.slug ?? ""} defaultExperience={defaultExperience} />
        </div>
      </div>
    </div>
  </section>;
}

