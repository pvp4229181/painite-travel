import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { getDestinations, getExperiences } from "@/lib/content";
import { footerNav, site } from "@/data/site";

function Column({ title, children }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-ivory">{title}</h2>
      <ul className="mt-5 space-y-4 text-[13px] text-ivory/75">{children}</ul>
    </div>
  );
}

const linkCls = "transition-colors hover:text-gold";

export default async function Footer() {
  const [destinations, experiences] = await Promise.all([getDestinations(), getExperiences()]);
  return (
    <footer className="bg-ink-deep text-ivory">
      <div className="container-luxe grid gap-12 pt-16 pb-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
        <div>
          <Logo imageClassName="h-12 sm:h-14" />
          <p className="mt-5 font-serif text-lg text-gold">{site.tagline}</p>
          <p className="mt-5 max-w-[16rem] text-[13px] leading-relaxed text-ivory/75">{site.description}</p>
        </div>

        <Column title="Destinations">
          {destinations.map((d) => (
            <li key={d.slug}>
              <Link href={`/destinations/${d.slug}`} className={linkCls}>
                {d.name}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Experiences">
          {experiences.filter(e => e.slug !== "island-time").map(e => <li key={e.slug}><Link href={`/experiences/${e.slug}`} className={linkCls}>{e.name}</Link></li>)}
        </Column>

        <Column title="Services">
          <li><Link href="/services#bespoke-itineraries" className={linkCls}>Bespoke travel</Link></li>
          <li><Link href="/services#luxury-hotels" className={linkCls}>Luxury hotels</Link></li>
          <li><Link href="/services#private-guides" className={linkCls}>Private guides</Link></li>
          <li><Link href="/services#airport-assistance" className={linkCls}>Airport assistance</Link></li>
          <li><Link href="/services#wellness-retreats" className={linkCls}>Yoga & retreats</Link></li>
        </Column>

        <Column title="Painite">
          {footerNav.painite.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={linkCls}>
                {l.label}
              </Link>
            </li>
          ))}
        </Column>

        <Column title="Contact">
          <li>
            <a href={`mailto:${site.email}`} className={linkCls}>
              {site.email}
            </a>
          </li>
          <li>
            <a href={site.phoneHref} className={linkCls}>
              {site.phone}
            </a>
          </li>
          <li>{site.address}</li>
        </Column>
      </div>

      <div className="container-luxe">
        <div className="flex flex-col gap-4 border-t border-ivory/10 py-7 text-[12px] text-ivory/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {site.year} {site.legalName}
          </p>
          <div className="flex gap-6">
            {footerNav.legal.map((l) => (
              <Link key={l.href} href={l.href} className={linkCls}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
