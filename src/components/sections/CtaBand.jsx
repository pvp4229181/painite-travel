import { Button } from "@/components/ui/Button";
import { Reveal } from "@/lib/motion";
import Landscape from "@/components/ui/Landscape";

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
    <section className="journey-invitation">
      <div className="container-luxe">
        <div className="journey-invitation-card">
          <div className="journey-invitation-image">
            <Landscape scene="island" shade="linear-gradient(180deg, transparent 45%, rgba(7,23,17,.65))" />
            <p>Somewhere extraordinary.<br /><em>Entirely yours.</em></p>
          </div>
          <div className="journey-invitation-copy">
            <p className="eyebrow text-gold-soft">YOUR NEXT CHAPTER STARTS HERE</p>
            <Reveal as="h2">{title}</Reveal>
            <p className="journey-invitation-description">Tell us what you have in mind. We will bring the places, people and thoughtful details together in a journey made for you.</p>
            <div className="journey-invitation-actions">
              <Button href={href} variant="gold">{cta}</Button>
              <span>Personally planned.<br />A reply within 24 hours.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
