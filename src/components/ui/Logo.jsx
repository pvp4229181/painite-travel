import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// The Painite Travels logo (white lettering, for dark backgrounds), from painitetravels.com.
export function LogoMark({ className, priority = false }) {
  return (
    <Image
      src="/brand/logo-header.png"
      alt="Painite Travels, Curator of Exceptional Journeys"
      width={320}
      height={114}
      priority={priority}
      className={cn("h-9 w-auto sm:h-11", className)}
    />
  );
}

export default function Logo({ className, imageClassName, priority = false, href = "/" }) {
  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)}>
      <LogoMark className={imageClassName} priority={priority} />
    </Link>
  );
}
