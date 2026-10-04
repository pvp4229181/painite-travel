"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ChevronLeft, CircleAlert, ExternalLink, LoaderCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared chrome for every edit screen: back link, title, save state and actions. */
export default function EditorFrame({ form, title, subtitle, backHref, backLabel, publicHref, canDelete = true, children }) {
  const { status, dirty, isNew, save, remove } = form;
  const created = useSearchParams().get("created");
  const busy = status.state === "saving" || status.state === "deleting";

  let note = null;
  if (status.state === "saving") note = "Saving…";
  else if (status.state === "deleting") note = "Deleting…";
  else if (dirty) note = "Unsaved changes";
  else if (status.state === "saved") note = status.message;
  else if (created && !isNew) note = "Created";

  return (
    <form onSubmit={save} noValidate>
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-line bg-cream-soft/95 px-4 py-3 backdrop-blur md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link href={backHref} className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-text">
              <ChevronLeft className="size-3.5" strokeWidth={1.5} /> {backLabel}
            </Link>
            <h1 className="truncate font-serif text-[1.9rem] leading-tight">{title}</h1>
            {subtitle && <p className="text-[12.5px] text-muted">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            {note && (
              <span
                className={cn(
                  "mr-1 inline-flex items-center gap-1.5 text-[12.5px]",
                  dirty ? "text-terracotta" : "text-muted",
                )}
                aria-live="polite"
              >
                {busy ? (
                  <LoaderCircle className="size-3.5 animate-spin" />
                ) : (
                  !dirty && <Check className="size-3.5 text-[#4f6f3f]" strokeWidth={2} />
                )}
                {note}
              </span>
            )}
            {publicHref && !isNew && (
              <a
                href={publicHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-[13px] hover:border-text/40"
              >
                <ExternalLink className="size-3.5" strokeWidth={1.5} /> View
              </a>
            )}
            {canDelete && !isNew && (
              <button
                type="button"
                onClick={remove}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white px-3 py-2 text-[13px] text-terracotta hover:border-terracotta disabled:opacity-50"
              >
                <Trash2 className="size-3.5" strokeWidth={1.5} /> Delete
              </button>
            )}
            <button
              type="submit"
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-[13px] text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60"
            >
              {status.state === "saving" && <LoaderCircle className="size-3.5 animate-spin" />}
              {isNew ? "Create" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      {status.state === "error" && (
        <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-terracotta/40 bg-terracotta/5 px-4 py-3 text-[13.5px] text-terracotta">
          <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
          {status.message}
        </div>
      )}

      {children}
    </form>
  );
}
