import Link from "next/link";
import PageHero from "@/components/sections/PageHero";
import Landscape from "@/components/ui/Landscape";
import { notFound } from "next/navigation";
import { formatDate } from "@/data/journal";
import { getArticles } from "@/lib/content";
import { Stagger, StaggerItem } from "@/lib/motion";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Journal",
  description: "Notes from the road: stories, seasons and advice from the Painite team.",
  path: "/journal",
});

export default async function JournalPage() {
  const [lead, ...rest] = await getArticles();
  if (!lead) notFound();
  return (
    <>
      <PageHero scene="mist" eyebrow="Journal" title="Notes from the road." titleClass="text-[clamp(3rem,7vw,5.5rem)]" />
      <section className="bg-cream text-text">
        <div className="container-luxe py-24">
          <Link href={`/journal/${lead.slug}`} className="group grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]">
                <Landscape scene={lead.scene} />
              </div>
            </div>
            <div>
              <p className="eyebrow text-terracotta">{lead.category}</p>
              <h2 className="display-md mt-3 transition-colors group-hover:text-terracotta">{lead.title}</h2>
              <p className="mt-4 max-w-md text-[14px] leading-[1.75] text-muted">{lead.excerpt}</p>
              <p className="eyebrow mt-6 text-muted">
                {formatDate(lead.date)} · {lead.readTime}
              </p>
            </div>
          </Link>

          <Stagger className="mt-20 grid gap-x-5 gap-y-14 border-t border-line pt-14 md:grid-cols-3">
            {rest.map((a) => (
              <StaggerItem key={a.slug}>
                <Link href={`/journal/${a.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]">
                      <Landscape scene={a.scene} />
                    </div>
                  </div>
                  <p className="eyebrow mt-5 text-terracotta">{a.category}</p>
                  <h3 className="mt-2 font-serif text-[1.75rem] leading-tight transition-colors group-hover:text-terracotta">{a.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted">{a.excerpt}</p>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
