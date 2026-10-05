"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Copy, Film, Loader2, Trash2, Upload } from "lucide-react";
import { removeMedia, uploadMedia, useMediaLibrary } from "@/components/admin/useMedia";
import { mediaThumb, videoSrc } from "@/lib/media";
import { cn } from "@/lib/utils";

const size = (bytes) => (bytes > 1048576 ? `${(bytes / 1048576).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

function Card({ item }) {
  const [state, setState] = useState({ busy: false, error: "", usedBy: [], copied: false });

  async function onDelete() {
    if (!window.confirm("Delete this file permanently?")) return;
    setState((s) => ({ ...s, busy: true, error: "", usedBy: [] }));
    try {
      await removeMedia(item);
    } catch (err) {
      setState((s) => ({ ...s, busy: false, error: err.message, usedBy: err.usedBy }));
    }
  }

  async function onCopy() {
    await navigator.clipboard.writeText(item.url).catch(() => {});
    setState((s) => ({ ...s, copied: true }));
    setTimeout(() => setState((s) => ({ ...s, copied: false })), 1500);
  }

  return (
    <li className={cn("overflow-hidden rounded-lg border border-line bg-white", state.busy && "opacity-50")}>
      <div className="relative aspect-video bg-ink">
        {item.type === "video" ? (
          <video src={videoSrc(item.url)} poster={mediaThumb(item.url, 640, 360)} controls preload="none" className="h-full w-full object-cover" />
        ) : (
          <Image src={mediaThumb(item.url, 640, 360)} alt="" fill unoptimized sizes="320px" className="object-cover" />
        )}
      </div>
      <div className="flex items-center gap-2 px-3 py-2.5 text-[12px] text-muted">
        {item.type === "video" && <Film className="size-3.5 shrink-0" strokeWidth={1.5} />}
        <span className="flex-1 truncate">
          {item.width}×{item.height} · {item.format?.toUpperCase()} · {size(item.bytes)}
        </span>
        <button type="button" onClick={onCopy} title="Copy link" className="rounded p-1 hover:bg-sand hover:text-text">
          {state.copied ? <span className="text-[11px]">Copied</span> : <Copy className="size-3.5" strokeWidth={1.5} />}
        </button>
        <button type="button" onClick={onDelete} disabled={state.busy} title="Delete" className="rounded p-1 hover:bg-sand hover:text-terracotta">
          <Trash2 className="size-3.5" strokeWidth={1.5} />
        </button>
      </div>
      {state.error && (
        <div className="border-t border-line px-3 py-2 text-[12px] text-terracotta">
          {state.error}
          {state.usedBy.length > 0 && (
            <ul className="mt-1 list-disc pl-4 text-text">
              {state.usedBy.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}

/** Uploads one or more files, one after another. */
function UploadButton({ type }) {
  const input = useRef(null);
  const [status, setStatus] = useState({ text: "", error: "" });
  const busy = Boolean(status.text);

  async function onChange(e) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    const errors = [];
    for (const [i, file] of files.entries()) {
      const label = files.length > 1 ? `${i + 1} of ${files.length}` : file.name;
      try {
        await uploadMedia(file, type, (pct) => setStatus({ text: `Uploading ${label}: ${pct}%`, error: "" }));
      } catch (err) {
        errors.push(`${file.name}: ${err.message}`);
      }
    }
    setStatus({ text: "", error: errors.join(" ") });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => input.current?.click()}
        className="inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2.5 text-[13px] text-ivory hover:bg-ink-soft disabled:opacity-60"
      >
        {busy ? <Loader2 className="size-4 animate-spin" strokeWidth={1.5} /> : <Upload className="size-4" strokeWidth={1.5} />}
        Upload {type === "image" ? "images" : "videos"}
      </button>
      <input ref={input} type="file" accept={`${type}/*`} multiple className="hidden" onChange={onChange} />
      <span className="text-[12.5px] text-muted">
        {status.text || (type === "image" ? "JPG, PNG or WebP, up to 10 MB each." : "MP4 or MOV, up to 100 MB each.")}
      </span>
      {status.error && <p className="w-full text-[12.5px] text-terracotta">{status.error}</p>}
    </div>
  );
}

function Library({ type, title }) {
  const library = useMediaLibrary(type);
  return (
    <section className="mt-10 first:mt-0">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-2xl">
          {title} <span className="text-base text-muted">({library.items.length})</span>
        </h2>
      </div>
      <div className="mt-4">
        <UploadButton type={type} />
      </div>
      {library.status === "loading" && <p className="mt-4 text-[13px] text-muted">Loading…</p>}
      {library.status === "error" && <p className="mt-4 text-[13px] text-terracotta">{library.error}</p>}
      {library.status === "ready" && !library.items.length && (
        <p className="mt-4 text-[13px] text-muted">Nothing uploaded yet.</p>
      )}
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {library.items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

export default function MediaLibrary({ configured }) {
  if (!configured) {
    return (
      <div className="rounded-lg border border-line bg-white p-6 text-[14px] leading-relaxed">
        <h2 className="font-serif text-2xl">Uploads are not set up yet</h2>
        <p className="mt-2 text-muted">
          Images and videos are stored on Cloudinary. Create a free account at cloudinary.com, then add your keys to the
          environment variables (in <code>.env.local</code> locally, and in your hosting settings for the live site):
        </p>
        <pre className="mt-4 overflow-x-auto rounded-md bg-sand px-4 py-3 text-[12.5px]">
          CLOUDINARY_URL=cloudinary://&lt;api_key&gt;:&lt;api_secret&gt;@&lt;cloud_name&gt;
        </pre>
        <p className="mt-3 text-muted">You can copy this value from the Cloudinary dashboard. Restart the site after adding it.</p>
      </div>
    );
  }
  return (
    <>
      <Library type="image" title="Images" />
      <Library type="video" title="Videos" />
    </>
  );
}
