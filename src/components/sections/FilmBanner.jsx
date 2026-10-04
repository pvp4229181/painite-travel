import Landscape from "@/components/ui/Landscape";
import FilmButton from "@/components/ui/FilmButton";
import { Reveal } from "@/lib/motion";

export default function FilmBanner() {
  return (
    <section className="relative isolate overflow-hidden text-ivory">
      <Landscape scene="night" className="-z-10" />
      <div className="container-luxe flex min-h-[380px] flex-col justify-center py-24 md:min-h-[420px]">
        <Reveal as="h2" className="display-lg max-w-xl">
          This is how we believe travel should feel.
        </Reveal>
        <Reveal delay={0.15} className="mt-9">
          <FilmButton size="lg" note="90 seconds" />
        </Reveal>
      </div>
    </section>
  );
}
