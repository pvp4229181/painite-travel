import Image from "next/image";
import photos from "@/data/photography.json";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Imagery & credits",
  description: "Explore the AI-generated travel artwork supplied for Painite Travels.",
  path: "/photo-credits",
});

export default function PhotoCreditsPage() {
  return (
    <section className="border-t-[88px] border-ink bg-cream text-text">
      <div className="container-luxe py-20">
        <div className="max-w-2xl">
          <p className="eyebrow text-terracotta">IMAGERY &amp; INSPIRATION</p>
          <h1 className="display-lg mt-5">Imagery &amp; inspiration.</h1>
          <p className="mt-6 text-base leading-relaxed text-muted">Our travel artwork was generated with Gemini and supplied by the site owner. Inspired by landscapes, architecture, and everyday journeys, the collection shares a warm, natural visual style.</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">Images have been resized, re-encoded, and cropped for our pages. These illustrations evoke destinations and experiences; they are not documentary photographs of specific stays or services.</p>
        </div>
        <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((photo) => (
            <li key={photo.key} className="min-w-0">
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Image src={photo.src} alt={photo.alt} fill quality={90} sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
              <h2 className="mt-5 font-serif text-2xl leading-tight">{photo.alt}</h2>
              <p className="mt-3 break-words text-sm leading-relaxed text-muted">{photo.kind === "user-provided-ai" ? "AI-generated with Gemini. Image supplied by the site owner." : <>{photo.kind === "ai-recreation" ? "Reference photograph by " : "Photograph by "}{photo.author || "the creator credited at the source"}.</>}</p>
              {photo.source && <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={photo.source} target="_blank" rel="noreferrer" className="underline decoration-line underline-offset-4 hover:text-terracotta">{photo.kind === "ai-recreation" ? "View reference photograph" : "Original photograph"}</a>
                <a href={photo.licenseUrl} target="_blank" rel="noreferrer license" className="underline decoration-line underline-offset-4 hover:text-terracotta">{photo.license}</a>
              </div>}
              {photo.credit && !/^(own work|self-photographed)$/i.test(photo.credit) && <p className="mt-3 break-words text-xs leading-relaxed text-muted">Source credit: {photo.credit}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
