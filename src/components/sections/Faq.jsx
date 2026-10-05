"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

// Every answer stays in the HTML (collapsed with CSS) so search engines can read them all.
export default function Faq({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="border-t border-line">
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="border-b border-line">
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-serif text-[1.5rem] leading-snug transition-colors group-hover:text-terracotta md:text-[1.7rem]">
                  {f.q}
                </span>
                {isOpen ? <Minus className="size-4 shrink-0" strokeWidth={1.25} /> : <Plus className="size-4 shrink-0" strokeWidth={1.25} />}
              </button>
            </h3>
            <div
              id={`faq-${i}`}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-luxe",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-7 text-[14px] leading-[1.75] text-muted">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
