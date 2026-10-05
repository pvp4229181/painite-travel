import Image from "next/image";
import { videoSrc } from "@/lib/media";
import { imageSrc } from "@/lib/scenes";
import { cn } from "@/lib/utils";
// `video` (optional) plays over the image and under the shade; the image stays for reduced motion.
export default function Landscape({scene="himalaya",video,className,shade=false,children,priority=false}) {
 return <div aria-hidden="true" className={cn("landscape-root absolute inset-0 overflow-hidden",className)}><Image src={imageSrc(scene)} alt="" fill sizes="(max-width: 768px) 100vw, 80vw" priority={priority} className="object-cover" />{video && <video src={videoSrc(video)} autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden" />}{shade && <div className="absolute inset-0" style={{background:typeof shade === "string" ? shade : "linear-gradient(180deg,transparent 25%,rgba(5,20,16,.7) 100%)"}} />}{children}</div>;
}
