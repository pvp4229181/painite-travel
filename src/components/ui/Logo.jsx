import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className, priority = false }) {
  return (
    <span className="inline-flex flex-col items-center px-3 py-2">
      <span className="relative -mb-2 block">
      <Image quality={90}
      src="/brand/painite-travels.png"
      alt="Painite Travels"
      width={400}
      height={189}
      sizes="220px"
      priority={priority}
      className={cn("h-14 w-auto brightness-0 invert [clip-path:inset(0_0_14%_0)] sm:h-16", className)}
    />
        <Image
          src="/brand/painite-travels.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="220px"
          quality={90}
          priority={priority}
          className="object-contain [clip-path:inset(0_0_36%_0)]"
        />
      </span>
      <span className="whitespace-nowrap text-[9px] leading-4 font-medium tracking-[0.12em] text-white">THE RAREST WAY TO TRAVEL</span>
    </span>
  );
}

export default function Logo({ className, imageClassName, priority = false, href = "/" }) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      <LogoMark className={imageClassName} priority={priority} />
    </Link>
  );
}
