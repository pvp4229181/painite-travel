import Link from "next/link";
import { ArrowLink } from "@/components/ui/Button";
import Landscape from "@/components/ui/Landscape";
import ServicesList from "@/components/sections/ServicesList";
import Faq from "@/components/sections/Faq";
import EnquiryForm from "@/components/forms/EnquiryForm";
import { planningSteps } from "@/data/services";
import { getArticles, getDestinations, getExperiences } from "@/lib/content";
import { faqs } from "@/data/faq";

export function PlanningProcess() {
  return (
    <section className="bg-cream text-text">
      <div className="container-luxe py-24">
        <p className="eyebrow text-terracotta">THE BESPOKE PROCESS</p>
        <h2 className="display-lg mt-4 max-w-2xl">From the first conversation to your return.</h2>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {planningSteps.map((step, i) => <li key={step.title} className="border-t border-line pt-6">
            <p className="eyebrow text-terracotta">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-4 font-serif text-2xl">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
          </li>)}
        </ol>
      </div>
    </section>
  );
}

export function ServicesPreview() {
  return (
    <section className="bg-cream-soft text-text">
      <div className="container-luxe py-24">
        <p className="eyebrow text-terracotta">OUR SERVICES</p>
        <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div><h2 className="display-lg max-w-2xl">Every detail, thoughtfully arranged.</h2><p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">Enjoy the places you came to see. We coordinate the planning, people and practical details behind your journey.</p></div>
          <ArrowLink href="/services">Explore our services</ArrowLink>
        </div>
        <ServicesList />
      </div>
    </section>
  );
}

export function ResponsiblePreview() {
  return (
    <section className="bg-ink text-ivory">
      <div className="container-luxe grid items-center gap-12 py-24 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden"><Landscape scene="wellness" /></div>
        <div><p className="eyebrow text-gold">RESPONSIBLE TRAVEL</p><h2 className="display-lg mt-4">A thoughtful guest, wherever you go.</h2><p className="mt-6 max-w-lg text-sm leading-relaxed text-ivory/80">Local guides, community businesses and respect for wildlife and cultural traditions are part of how we plan. Meaningful travel should support the people who make a destination special.</p><div className="mt-8"><ArrowLink href="/responsible-travel" tone="light">Our approach</ArrowLink></div></div>
      </div>
    </section>
  );
}

export async function JournalPreview() {
  const journal = await getArticles();
  return (
    <section className="bg-cream text-text">
      <div className="container-luxe py-24">
        <p className="eyebrow text-terracotta">THE JOURNAL</p>
        <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><h2 className="display-lg">Travel inspiration & guides</h2><ArrowLink href="/journal">Read the journal</ArrowLink></div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {journal.slice(0, 3).map(article => <Link key={article.slug} href={`/journal/${article.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden"><Landscape scene={article.scene} className="transition-transform duration-700 group-hover:scale-105" /></div>
            <p className="eyebrow mt-5 text-terracotta">{article.category}</p><h3 className="mt-3 font-serif text-3xl group-hover:text-terracotta">{article.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>
          </Link>)}
        </div>
      </div>
    </section>
  );
}

export function QuestionsPreview() {
  return (
    <section className="bg-cream-soft text-text"><div className="container-luxe grid gap-12 py-24 lg:grid-cols-[1fr_1.5fr]">
      <div><p className="eyebrow text-terracotta">BEFORE YOU TRAVEL</p><h2 className="display-lg mt-4">Questions, answered</h2><div className="mt-8"><ArrowLink href="/faq">All questions</ArrowLink></div></div>
      <Faq items={faqs.slice(0, 8)} />
    </div></section>
  );
}

export async function EnquiryPreview() {
  const [destinations, experiences] = await Promise.all([getDestinations(), getExperiences()]);
  return (
    <section id="enquire" className="bg-cream text-text"><div className="container-luxe grid gap-12 py-24 lg:grid-cols-[1fr_1.25fr]">
      <div><p className="eyebrow text-terracotta">ENQUIRE PRIVATELY</p><h2 className="display-lg mt-4">Start a conversation</h2><p className="mt-6 max-w-md text-sm leading-relaxed text-muted">Share your ideas, dates and the places you want to discover. Your enquiry is personally reviewed by a Painite curator, with a response within 24 hours.</p></div>
      <EnquiryForm destinations={destinations} experiences={experiences} />
    </div></section>
  );
}
