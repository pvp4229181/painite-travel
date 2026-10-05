import Link from "next/link";
import { ArrowUpRight, ArrowDown, Compass } from "lucide-react";
import Landscape from "@/components/ui/Landscape";
import { Button } from "@/components/ui/Button";

const themes = {
  culture: { eyebrow: "STORIES BEHIND THE STONES", title: "Step into a living story.", moments: "History, made personal.", label: "CULTURAL ENCOUNTERS", scenes: ["heritage", "himalaya", "heritage"] },
  wildlife: { eyebrow: "IN THE COMPANY OF THE WILD", title: "Let nature set the pace.", moments: "Out there, extraordinary awaits.", label: "IN THE FIELD", scenes: ["wildlife", "wellness", "wildlife"] },
  wellness: { eyebrow: "A LITTLE SPACE FOR YOURSELF", title: "Return to a slower rhythm.", moments: "Make room to feel restored.", label: "MOMENTS OF STILLNESS", scenes: ["wellness", "himalaya", "heritage"] },
  gastronomy: { eyebrow: "A TASTE OF SOMEWHERE NEW", title: "Every flavour tells a story.", moments: "A journey, served with stories.", label: "AT THE TABLE", scenes: ["gastronomy", "heritage", "wellness"] },
  romantic: { eyebrow: "FOR THE TWO OF YOU", title: "Time together. Memories forever.", moments: "Just you, and somewhere wonderful.", label: "OCCASIONS TO REMEMBER", scenes: ["heritage", "island", "himalaya"] },
  adventure: { eyebrow: "TAKE THE SCENIC WAY", title: "Go a little further.", moments: "Find your own path.", label: "BEYOND THE EVERYDAY", scenes: ["himalaya", "himalaya", "wellness"] },
  "island-time": { eyebrow: "FOLLOW THE TIDE", title: "Nowhere to rush. Everything to savour.", moments: "Your days, beautifully unhurried.", label: "BAREFOOT POSSIBILITIES", scenes: ["island", "island", "wellness"] },
};

export default function ExperienceEditorial({ experience: e, destinations, others }) {
  const theme = themes[e.slug] || { eyebrow: "A PAINITE EXPERIENCE", title: e.name, moments: "Moments to make your own.", label: "THE POSSIBILITIES", scenes: [e.scene] };
  const enquiry = `/plan-your-journey?experience=${encodeURIComponent(e.slug)}`;
  return <div className={`experience-editorial experience-theme-${e.slug}`}>
    <section className="experience-page-hero">
      <Landscape scene={e.scene} video={e.video} priority />
      <div className="experience-hero-shade" aria-hidden="true" />
      <div className="container-luxe experience-hero-content">
        <Link className="experience-breadcrumb" href="/experiences">SIGNATURE EXPERIENCES <span>/</span> {e.name}</Link>
        <div className="experience-hero-copy"><p className="eyebrow">{theme.eyebrow}</p><h1>{e.name}</h1><p>{e.line}</p><Button href={enquiry}>Create your experience</Button></div>
        <div className="experience-hero-footer"><span>PERSONAL ENCOUNTERS. LASTING MEMORIES.</span><a href="#experience-story">Discover more <ArrowDown size={15} /></a></div>
      </div>
    </section>
    <section id="experience-story" className="experience-story container-luxe"><div><p className="eyebrow text-terracotta">{theme.label}</p><h2>{theme.title}</h2></div><div><p className="experience-story-body">{e.body}</p><p className="experience-story-note">Privately arranged around your interests, with the time and space to enjoy each moment.</p></div></section>

    <section className="experience-moments"><div className="container-luxe">
      <div className="experience-moments-heading"><p className="eyebrow">MOMENTS WE LOVE</p><h2>{theme.moments}</h2><p>A little inspiration for the journey we will create together.</p></div>
      <ol className="experience-moment-list">{e.moments.map((moment,i) => <li key={moment}>
        <div className="experience-moment-photo"><Landscape scene={theme.scenes[i % theme.scenes.length]} /><span>{String(i+1).padStart(2,"0")}</span></div>
        <div className="experience-moment-copy"><span className="eyebrow">{theme.label} / {String(i+1).padStart(2,"0")}</span><h3>{moment}</h3><Link href={enquiry}>Make it part of your journey <ArrowUpRight size={16} /></Link></div>
      </li>)}</ol>
    </div></section>

    {destinations.length > 0 && <section className="experience-places container-luxe"><div className="experience-places-heading"><div><p className="eyebrow text-terracotta">FIND YOUR SOMEWHERE</p><h2>Where this could take you.</h2></div><Compass size={36} strokeWidth={1} aria-hidden="true" /></div><div className="experience-destination-list">{destinations.map(d => <Link key={d.slug} href={`/destinations/${d.slug}`}><div className="experience-destination-photo"><Landscape scene={d.cardScene || d.scene} /></div><span>{d.name}</span><ArrowUpRight size={20} /></Link>)}</div></section>}

    <section className="experience-more"><div className="container-luxe"><div className="experience-more-heading"><p className="eyebrow">KEEP EXPLORING</p><h2>What else moves you?</h2></div><div className="experience-related-grid">{others.map(x => <Link href={`/experiences/${x.slug}`} key={x.slug}><span>{x.name}</span><ArrowUpRight size={18} /></Link>)}</div></div></section>
  </div>;
}
