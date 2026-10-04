import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  gold: "bg-gold text-ink hover:bg-gold-soft",
  outline: "border border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/5",
  dark: "bg-ink text-ivory hover:bg-ink-soft",
  "outline-dark": "border border-text/30 text-text hover:border-text",
};

export function Button({ href, variant = "gold", arrow = true, className, children, ...rest }) {
  const classes = cn(
    "group inline-flex items-center justify-center gap-3 px-6 py-3.5 text-[13px] font-normal tracking-wide transition-colors duration-300",
    variants[variant],
    className,
  );
  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}

export function ArrowLink({ href, children, className, tone = "dark" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 border-b pb-2 text-[13px] tracking-wide transition-colors",
        tone === "dark" ? "border-text/40 text-text hover:border-text" : "border-ivory/40 text-ivory hover:border-ivory",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={1.5} />
    </Link>
  );
}

export function CircleArrow({ className }) {
  return (
    <span
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-ivory/50 text-ivory transition-all duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink",
        className,
      )}
    >
      <ArrowRight className="size-3.5" strokeWidth={1.5} />
    </span>
  );
}
