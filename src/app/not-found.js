import Landscape from "@/components/ui/Landscape";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-dvh items-center overflow-hidden text-ivory">
      <Landscape scene="night" className="-z-10" />
      <div className="container-luxe">
        <p className="font-script text-3xl text-gold-soft">A path less travelled</p>
        <h1 className="display-xl mt-2 max-w-3xl text-[clamp(3rem,8vw,6rem)]">This page has wandered off.</h1>
        <Button href="/" className="mt-10">
          Return home
        </Button>
      </div>
    </section>
  );
}
