import Landscape from "@/components/ui/Landscape";
import { cn } from "@/lib/utils";

const defaultShade =
  "linear-gradient(180deg, rgba(10,15,13,0.45) 0%, rgba(10,15,13,0) 28%, rgba(10,15,13,0) 55%, rgba(10,15,13,0.6) 100%), linear-gradient(90deg, rgba(10,15,13,0.35) 0%, rgba(10,15,13,0) 60%)";

/** Full-bleed illustrated hero used on inner pages. */
export default function PageHero({ scene, video, sun, eyebrow, title, subtitle, children, footer, className, titleClass }) {
  return (
    <section
      className={cn("relative isolate flex min-h-[560px] flex-col overflow-hidden text-ivory md:min-h-[620px]", className)}
    >
      <Landscape scene={scene} video={video} sun={sun} shade={defaultShade} className="-z-10" />
      <div className="container-luxe flex flex-1 flex-col justify-end pt-32 pb-12 md:pb-14">
        {eyebrow && (
          <p className="eyebrow rise mb-3 text-ivory/75">
            {eyebrow}
          </p>
        )}
        <h1 className={cn("display-xl rise [animation-delay:80ms]", titleClass)}>
          {title}
        </h1>
        {subtitle && (
          <p className="rise [animation-delay:180ms] mt-5 font-serif text-2xl italic text-ivory/95 md:text-[1.75rem]">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="rise mt-8 [animation-delay:280ms]">
            {children}
          </div>
        )}
      </div>
      {footer}
    </section>
  );
}
