import Link from "next/link";
import Landscape from "@/components/ui/Landscape";
import { CircleArrow } from "@/components/ui/Button";
import { getExperiences } from "@/lib/content";
export default async function ExperiencesList({showHeading=true}) {
 const experiences = await getExperiences();
 return <section className="bg-ink text-ivory"><div className="container-luxe py-20 md:py-24">
 {showHeading && <div className="mb-10"><p className="eyebrow mb-4 text-gold">SIGNATURE EXPERIENCES</p><h2 className="display-lg">Experiences you will remember.</h2><p className="mt-4 text-sm text-ivory/75">Personal encounters, local expertise and time to enjoy each moment.</p></div>}
 <div className="grid gap-3 md:grid-cols-2">{experiences.map(e => <Link key={e.slug} href={`/experiences/${e.slug}`} className="group relative isolate flex min-h-[230px] items-end overflow-hidden border border-ivory/15 p-7 md:min-h-[280px]"><Landscape scene={e.scene} shade className="-z-10 transition-transform duration-700 group-hover:scale-105" /><div className="flex w-full items-end justify-between gap-4"><div><h3 className="font-serif text-4xl">{e.name}</h3><p className="mt-2 text-sm text-ivory/90">{e.line}</p></div><CircleArrow /></div></Link>)}</div>
 </div></section>;
}
