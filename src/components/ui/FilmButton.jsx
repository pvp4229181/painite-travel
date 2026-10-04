"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import Landscape from "@/components/ui/Landscape";
import { cn } from "@/lib/utils";

// Set this to an embeddable video URL (Vimeo/YouTube embed or an .mp4) once the film is ready.
const FILM_URL = process.env.NEXT_PUBLIC_FILM_URL || "";

const noopSubscribe = () => () => {};

export default function FilmButton({ label = "Watch the film", note, size = "md", className }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("group inline-flex items-center gap-4 text-left text-ivory", className)}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full border border-ivory/60 transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-ink",
            size === "lg" ? "size-14" : "size-10",
          )}
        >
          <Play className={size === "lg" ? "size-4 fill-current" : "size-3 fill-current"} strokeWidth={0} />
        </span>
        <span className="flex flex-col">
          <span className="text-[13px] tracking-wide">{label}</span>
          {note && <span className="mt-0.5 text-[11px] tracking-[0.08em] text-ivory/60">{note}</span>}
        </span>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-deep/90 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Painite film"
              >
                <motion.div
                  className="relative aspect-video w-full max-w-5xl overflow-hidden bg-ink"
                  initial={{ scale: 0.96, y: 12 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.96, y: 12 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {FILM_URL ? (
                    FILM_URL.endsWith(".mp4") ? (
                      <video src={FILM_URL} className="size-full" controls autoPlay playsInline />
                    ) : (
                      <iframe
                        src={FILM_URL}
                        className="size-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title="Painite film"
                      />
                    )
                  ) : (
                    <>
                      <Landscape scene="night" shade />
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ivory">
                        <p className="font-script text-3xl text-gold-soft md:text-4xl">Journeys beyond boundaries</p>
                        <p className="mt-4 font-serif text-3xl md:text-5xl">Our film is on its way.</p>
                        <p className="mt-3 max-w-md text-sm text-ivory/70">
                          A short film about how we believe travel should feel. Check back soon.
                        </p>
                      </div>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full border border-ivory/40 text-ivory hover:bg-ivory/10"
                    aria-label="Close film"
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
