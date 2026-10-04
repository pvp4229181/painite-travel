import { Button } from "@/components/ui/Button";
import { Reveal } from "@/lib/motion";

export default function CtaBand({
  title = (
    <>
      Don&apos;t see your journey?
      <br />
      That&apos;s the point.
    </>
  ),
  cta = "Tell us what you're imagining",
  href = "/plan-your-journey",
}) {
  return (
    <section className="bg-terracotta text-ivory">
      <div className="container-luxe flex flex-col gap-10 py-20 md:flex-row md:items-center md:justify-between md:py-24">
        <Reveal as="h2" className="display-lg max-w-xl">
          {title}
        </Reveal>
        <Reveal delay={0.15}>
          <Button href={href} variant="dark" className="px-6 py-4">
            {cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
