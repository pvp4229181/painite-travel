"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { mediaImage, mediaThumb, videoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Photos and videos added in the admin, with a full-screen viewer. Hidden when empty. */
export default function Gallery({ items = [], title = "Gallery", eyebrow = "In pictures", className }) {
  const [open, setOpen] = useState(null);
  const closeBtn = useRef(null);
  const opener = useRef(null);
  const touchX = useRef(null);
  const count = items.length;

  const go = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + count) % count)), [count]);
  const close = useCallback(() => {
    setOpen(null);
    opener.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, close]);

  if (!count) return null;
  const current = open === null ? null : items[open];

  return (
    <section className={cn("bg-cream text-text", className)}>
      <div className="container-luxe py-24">
        <p className="eyebrow text-terracotta">{eyebrow}</p>
        <h2 className="display-md mt-4">{title}</h2>
        <ul className="mt-12 grid auto-rows-[minmax(0,1fr)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((item, i) => (
            <li key={item.url} className={cn(i === 0 && count >= 3 && "col-span-2 row-span-2")}>
              <button
                type="button"
                onClick={(e) => {
                  opener.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group relative block aspect-[4/3] h-full w-full overflow-hidden bg-ink text-left"
                aria-label={`Open ${item.type === "video" ? "video" : "photo"} ${i + 1} of ${count}${item.caption ? `: ${item.caption}` : ""}`}
              >
                <Image
                  src={mediaThumb(item.url, i === 0 && count >= 3 ? 1200 : 800, i === 0 && count >= 3 ? 900 : 600)}
                  alt={item.caption || ""}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.type === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="inline-flex size-14 items-center justify-center rounded-full bg-ink/60 text-ivory backdrop-blur-sm transition-colors group-hover:bg-terracotta">
                      <Play className="ml-0.5 size-5" strokeWidth={1.5} fill="currentColor" />
                    </span>
                  </span>
                )}
                {item.caption && (
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pt-8 pb-3 text-[12.5px] text-ivory opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    {item.caption}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: ${current.type === "video" ? "video" : "photo"} ${open + 1} of ${count}`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 text-ivory"
          onClick={(e) => e.target === e.currentTarget && close()}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-[13px] text-ivory/75 sm:px-6">
            <span>
              {open + 1} / {count}
            </span>
            <button ref={closeBtn} type="button" onClick={close} aria-label="Close" className="rounded-full p-2 hover:bg-ivory/10">
              <X className="size-5" strokeWidth={1.5} />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && close()}>
            {current.type === "video" ? (
              <video key={current.url} src={videoSrc(current.url)} controls autoPlay playsInline className="max-h-full max-w-full" />
            ) : (
              <div className="relative h-full w-full">
                <Image key={current.url} src={mediaImage(current.url, 2000)} alt={current.caption || ""} fill unoptimized sizes="100vw" className="object-contain" />
              </div>
            )}
            {count > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} aria-label="Previous" className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-ink/60 p-2.5 hover:bg-ivory/15 sm:left-5">
                  <ChevronLeft className="size-6" strokeWidth={1.5} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-ink/60 p-2.5 hover:bg-ivory/15 sm:right-5">
                  <ChevronRight className="size-6" strokeWidth={1.5} />
                </button>
              </>
            )}
          </div>
          <p className="min-h-14 px-6 py-4 text-center font-serif text-lg italic text-ivory/90">{current.caption}</p>
        </div>
      )}
    </section>
  );
}
