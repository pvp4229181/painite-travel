"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import Landscape from "@/components/ui/Landscape";
import { EASE } from "@/lib/motion";

export default function Itinerary({ days }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="border-t border-line">
      {days.map((d, i) => {
        const isOpen = open === i;
        const panelId = `day-panel-${i}`;
        return (
          <li key={d.day} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="group grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-4 py-6 text-left md:grid-cols-[4.5rem_1fr_auto]"
              >
                <span className="eyebrow text-muted">Day {d.day}</span>
                <span className="font-serif text-[1.45rem] leading-tight text-text transition-colors group-hover:text-terracotta md:text-[1.6rem]">
                  {d.title}
                </span>
                <span className="text-text/70">
                  {isOpen ? <Minus className="size-4" strokeWidth={1.25} /> : <Plus className="size-4" strokeWidth={1.25} />}
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-5 pb-7 sm:grid-cols-[8.5rem_1fr] sm:pl-[5.5rem] md:gap-6">
                    <div className="relative aspect-[3/2] w-full max-w-[12rem] overflow-hidden sm:max-w-none">
                      <Landscape scene={d.scene} />
                    </div>
                    <div className="text-[13.5px] leading-[1.75] text-muted">
                      <p>{d.text}</p>
                      {d.stay && (
                        <p className="mt-3 text-[12px] tracking-wide text-text/80">
                          <span className="text-terracotta">Stay</span> &nbsp;{d.stay}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}
