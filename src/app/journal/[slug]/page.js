import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/sections/PageHero";
import CtaBand from "@/components/sections/CtaBand";
import { ArrowLink } from "@/components/ui/Button";
import { formatDate } from "@/data/journal";
import { getArticle, getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) return {};
  return buildMetadata({ title: a.title, description: a.excerpt, path: `/journal/${a.slug}`, type: "article" });
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const a = await getArticle(slug);
  if (!a) notFound();
  const more = (await getArticles()).filter((x) => x.slug !== a.slug).slice(0, 2);

  return (
    <>
      <PageHero
        scene={a.scene}
        eyebrow={`${a.category} · ${formatDate(a.date)} · ${a.readTime}`}
        title={a.title}
        titleClass="text-[clamp(2.75rem,6vw,4.75rem)] max-w-4xl"
      />
      <article className="bg-cream text-text">
        <div className="container-luxe py-20">
          <div className="mx-auto max-w-2xl">
            <p className="font-serif text-[1.6rem] leading-snug italic text-terracotta">{a.excerpt}</p>
            <div className="mt-10 space-y-6 text-[15.5px] leading-[1.85] text-text/85">
              {a.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-14 border-t border-line pt-8">
              <ArrowLink href="/journal">Back to the journal</ArrowLink>
            </div>
          </div>
        </div>
      </article>
      <section className="bg-ink text-ivory">
        <div className="container-luxe grid gap-8 py-16 md:grid-cols-2">
          {more.map((m) => (
            <Link key={m.slug} href={`/journal/${m.slug}`} className="group border-t border-line-dark pt-6">
              <p className="eyebrow text-gold">{m.category}</p>
              <h2 className="mt-2 font-serif text-3xl transition-colors group-hover:text-gold">{m.title}</h2>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
