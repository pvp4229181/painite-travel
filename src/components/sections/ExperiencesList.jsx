import ExperiencesCarousel from "@/components/sections/ExperiencesCarousel";
import { getExperiences } from "@/lib/content";
export default async function ExperiencesList({showHeading=true}) {
 const experiences = await getExperiences();
 return <section className="bg-ink text-ivory"><div className="container-luxe py-20 md:py-24">
 {showHeading && <div className="mb-10"><p className="eyebrow mb-4 text-gold">SIGNATURE EXPERIENCES</p><h2 className="display-lg">Experiences you will remember.</h2><p className="mt-4 text-sm text-ivory/75">Personal encounters, local expertise and time to enjoy each moment.</p></div>}
 <ExperiencesCarousel experiences={experiences} />
 </div></section>;
}
