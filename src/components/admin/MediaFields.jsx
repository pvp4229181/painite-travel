"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Film, ImagePlus, Library, Loader2, Upload, X } from "lucide-react";
import { useMediaLibrary, uploadMedia } from "@/components/admin/useMedia";
import { isUploadedMedia, mediaThumb, mediaType, videoSrc } from "@/lib/media";
import { imageOptions, imageFor, imageSrc } from "@/lib/scenes";
import { cn } from "@/lib/utils";

const UPLOADS_SHOWN = 7;

const tileCls = (on) =>
  cn(
    "group relative aspect-[4/3] overflow-hidden rounded-md border-2 text-left transition-all",
    on ? "border-ink ring-2 ring-gold/50" : "border-transparent opacity-80 hover:opacity-100",
  );

function SelectedMark() {
  return (
    <span className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-ink text-ivory">
      <Check className="size-3" strokeWidth={2.5} />
    </span>
  );
}

/** A dashed tile that opens the file chooser and shows upload progress. */
function UploadTile({ type, disabled, onUploaded, onError, label }) {
  const input = useRef(null);
  const [progress, setProgress] = useState(null);
  const Icon = type === "video" ? Film : ImagePlus;

  async function onChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    onError("");
    setProgress(0);
    try {
      onUploaded(await uploadMedia(file, type, setProgress));
    } catch (err) {
      onError(err.message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled || progress !== null}
        onClick={() => input.current?.click()}
        className="relative flex aspect-[4/3] flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-line text-[11.5px] text-muted transition-colors hover:border-ink hover:text-text disabled:pointer-events-none disabled:opacity-50"
      >
        {progress === null ? (
          <>
            <Icon className="size-5" strokeWidth={1.5} />
            {label}
          </>
        ) : (
          <>
            <Loader2 className="size-5 animate-spin" strokeWidth={1.5} />
            {progress}%
            <span className="absolute inset-x-0 bottom-0 h-1 bg-gold" style={{ width: `${progress}%` }} />
          </>
        )}
      </button>
      <input ref={input} type="file" accept={`${type}/*`} className="hidden" onChange={onChange} />
    </>
  );
}

function LibraryNote({ library, error }) {
  if (error) return <p className="mt-2 text-[12.5px] text-terracotta">{error}</p>;
  if (library.status === "error") return <p className="mt-2 text-[12.5px] text-terracotta">{library.error}</p>;
  if (!library.configured)
    return (
      <p className="mt-2 text-[12.5px] text-muted">
        Uploading needs Cloudinary keys in the environment variables (see .env.example).
      </p>
    );
  return null;
}

/** Choose a built-in artwork image or an uploaded image, or upload a new one. */
export function ImagePicker({ label, hint, value, onChange, allowNone, noneLabel = "Default", compact }) {
  const library = useMediaLibrary("image");
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const selected = value ? imageFor(value) : "";
  const builtIn = allowNone ? [{ key: "", label: noneLabel }, ...imageOptions] : imageOptions;

  // The current upload stays visible even if it is not among the first few.
  let uploads = library.items.map((i) => i.url);
  if (isUploadedMedia(selected) && !uploads.includes(selected)) uploads = [selected, ...uploads];
  const visible = showAll ? uploads : uploads.slice(0, UPLOADS_SHOWN);
  if (!showAll && isUploadedMedia(selected) && !visible.includes(selected)) visible[visible.length - 1] = selected;

  return (
    <fieldset>
      {label && <legend className="mb-2 text-[13px] font-medium">{label}</legend>}
      <div className={cn("grid gap-2", compact ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-3 sm:grid-cols-4")}>
        {builtIn.map((o) => {
          const on = selected === o.key;
          return (
            <button key={o.key || "none"} type="button" onClick={() => onChange(o.key)} aria-pressed={on} title={o.label} className={tileCls(on)}>
              {o.key ? <Image src={imageSrc(o.key)} alt="" fill sizes="160px" className="object-cover" /> : <span className="absolute inset-0 bg-sand" />}
              {!compact && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-1.5 text-[11px] text-white">
                  {o.label}
                </span>
              )}
              {on && <SelectedMark />}
            </button>
          );
        })}
        {visible.map((url) => {
          const on = selected === url;
          return (
            <button key={url} type="button" onClick={() => onChange(url)} aria-pressed={on} title="Uploaded image" className={tileCls(on)}>
              <Image src={mediaThumb(url)} alt="" fill unoptimized sizes="160px" className="object-cover" />
              {on && <SelectedMark />}
            </button>
          );
        })}
        <UploadTile
          type="image"
          label={compact ? "Upload" : "Upload image"}
          disabled={!library.configured}
          onUploaded={(item) => onChange(item.url)}
          onError={setError}
        />
      </div>
      {uploads.length > UPLOADS_SHOWN && (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-2 text-[12.5px] text-text underline underline-offset-4">
          {showAll ? "Show fewer uploads" : `Show all ${uploads.length} uploads`}
        </button>
      )}
      <LibraryNote library={library} error={error} />
      {hint && <p className="mt-2 text-[12.5px] text-muted">{hint}</p>}
    </fieldset>
  );
}

/** Choose or upload a background video. Empty means no video (or the built-in one). */
export function VideoPicker({ label, hint, value, onChange, emptyText = "No video. The image is shown instead." }) {
  const library = useMediaLibrary("video");
  const [error, setError] = useState("");
  const uploads = library.items.map((i) => i.url);
  if (isUploadedMedia(value) && !uploads.includes(value)) uploads.unshift(value);

  return (
    <fieldset>
      {label && <legend className="mb-2 text-[13px] font-medium">{label}</legend>}
      {value ? (
        <div className="relative overflow-hidden rounded-md bg-ink">
          <video key={value} src={videoSrc(value)} className="aspect-video w-full object-cover" muted loop autoPlay playsInline preload="metadata" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-md bg-ink/80 px-2 py-1 text-[12px] text-ivory hover:bg-ink"
          >
            <X className="size-3.5" strokeWidth={2} /> Remove
          </button>
        </div>
      ) : (
        <p className="rounded-md border border-dashed border-line px-3 py-4 text-[12.5px] text-muted">{emptyText}</p>
      )}
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {uploads.map((url) => {
          const on = value === url;
          return (
            <button key={url} type="button" onClick={() => onChange(url)} aria-pressed={on} title="Uploaded video" className={tileCls(on)}>
              <Image src={mediaThumb(url)} alt="" fill unoptimized sizes="160px" className="object-cover" />
              <Film className="absolute bottom-1.5 left-1.5 size-4 text-white drop-shadow" strokeWidth={1.5} />
              {on && <SelectedMark />}
            </button>
          );
        })}
        <UploadTile type="video" label="Upload video" disabled={!library.configured} onUploaded={(item) => onChange(item.url)} onError={setError} />
      </div>
      <LibraryNote library={library} error={error} />
      {hint && <p className="mt-2 text-[12.5px] text-muted">{hint}</p>}
    </fieldset>
  );
}

/** A gallery of several uploaded photos and videos, each with an optional caption. */
export function GalleryField({ items = [], onChange, hint }) {
  const images = useMediaLibrary("image");
  const videos = useMediaLibrary("video");
  const configured = images.configured && videos.configured;
  const input = useRef(null);
  const latest = useRef(items);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [picking, setPicking] = useState(false);
  const [chosen, setChosen] = useState([]);

  // Uploads finish one by one; always append to the newest list, not the one from when they started.
  useEffect(() => {
    latest.current = items;
  }, [items]);
  const update = (next) => {
    latest.current = next;
    onChange(next);
  };
  const append = (urls) => update([...latest.current, ...urls.map((url) => ({ url, type: mediaType(url), caption: "" }))]);
  const move = (i, d) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    update(next);
  };

  async function onFiles(e) {
    const files = [...(e.target.files ?? [])];
    e.target.value = "";
    setError("");
    const failed = [];
    for (const [i, file] of files.entries()) {
      const type = file.type.startsWith("video/") ? "video" : "image";
      try {
        const item = await uploadMedia(file, type, (pct) => setStatus(`Uploading ${i + 1} of ${files.length}: ${pct}%`));
        append([item.url]);
      } catch (err) {
        failed.push(`${file.name}: ${err.message}`);
      }
    }
    setStatus("");
    setError(failed.join(" "));
  }

  const inGallery = new Set(items.map((i) => i.url));
  const library = [...images.items, ...videos.items].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const toggle = (url) => setChosen((c) => (c.includes(url) ? c.filter((u) => u !== url) : [...c, url]));

  return (
    <div>
      {items.length > 0 ? (
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.url} className="overflow-hidden rounded-md border border-line bg-white">
              <div className="relative aspect-[4/3] bg-ink">
                <Image src={mediaThumb(item.url, 480, 360)} alt="" fill unoptimized sizes="240px" className="object-cover" />
                {item.type === "video" && <Film className="absolute bottom-2 left-2 size-4 text-white drop-shadow" strokeWidth={1.5} />}
                <span className="absolute top-2 left-2 rounded bg-ink/70 px-1.5 text-[11px] text-ivory">{i + 1}</span>
                <div className="absolute top-1.5 right-1.5 flex gap-1">
                  <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move earlier" className="rounded bg-ink/70 p-1 text-ivory hover:bg-ink disabled:opacity-30">
                    <ArrowLeft className="size-3.5" strokeWidth={2} />
                  </button>
                  <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move later" className="rounded bg-ink/70 p-1 text-ivory hover:bg-ink disabled:opacity-30">
                    <ArrowRight className="size-3.5" strokeWidth={2} />
                  </button>
                  <button type="button" onClick={() => update(items.filter((_, k) => k !== i))} aria-label="Remove from gallery" className="rounded bg-ink/70 p-1 text-ivory hover:bg-terracotta">
                    <X className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <input
                value={item.caption ?? ""}
                onChange={(e) => update(items.map((x, k) => (k === i ? { ...x, caption: e.target.value } : x)))}
                placeholder="Caption (optional)"
                aria-label={`Caption for item ${i + 1}`}
                className="w-full border-t border-line px-3 py-2 text-[13px] outline-none placeholder:text-muted/50 focus:bg-cream-soft"
              />
            </li>
          ))}
        </ol>
      ) : (
        <p className="rounded-md border border-dashed border-line px-3 py-4 text-[12.5px] text-muted">
          No photos or videos yet. The gallery section is hidden on the website until you add some.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!configured || Boolean(status)}
          onClick={() => input.current?.click()}
          className="inline-flex items-center gap-2 rounded-md bg-ink px-3.5 py-2 text-[13px] text-ivory hover:bg-ink-soft disabled:opacity-50"
        >
          {status ? <Loader2 className="size-4 animate-spin" strokeWidth={1.5} /> : <Upload className="size-4" strokeWidth={1.5} />}
          Upload photos and videos
        </button>
        <button
          type="button"
          disabled={!configured || !library.length}
          onClick={() => {
            setChosen([]);
            setPicking((v) => !v);
          }}
          className="inline-flex items-center gap-2 rounded-md border border-line bg-white px-3.5 py-2 text-[13px] hover:border-ink disabled:opacity-50"
        >
          <Library className="size-4" strokeWidth={1.5} /> Choose from library
        </button>
        <input ref={input} type="file" accept="image/*,video/*" multiple className="hidden" onChange={onFiles} />
        {status && <span className="text-[12.5px] text-muted">{status}</span>}
      </div>

      {picking && (
        <div className="mt-3 rounded-md border border-line bg-white p-3">
          <div className="grid max-h-80 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-5">
            {library.map((m) => {
              const added = inGallery.has(m.url);
              const on = chosen.includes(m.url);
              return (
                <button
                  key={m.url}
                  type="button"
                  disabled={added}
                  onClick={() => toggle(m.url)}
                  aria-pressed={on}
                  title={added ? "Already in the gallery" : m.type === "video" ? "Video" : "Image"}
                  className={cn(tileCls(on), added && "pointer-events-none opacity-35")}
                >
                  <Image src={mediaThumb(m.url)} alt="" fill unoptimized sizes="140px" className="object-cover" />
                  {m.type === "video" && <Film className="absolute bottom-1.5 left-1.5 size-4 text-white drop-shadow" strokeWidth={1.5} />}
                  {on && <SelectedMark />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              disabled={!chosen.length}
              onClick={() => {
                append(chosen);
                setPicking(false);
              }}
              className="rounded-md bg-ink px-3.5 py-2 text-[13px] text-ivory hover:bg-ink-soft disabled:opacity-50"
            >
              Add {chosen.length || ""} selected
            </button>
            <button type="button" onClick={() => setPicking(false)} className="px-2 py-2 text-[13px] text-muted hover:text-text">
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-[12.5px] text-terracotta">{error}</p>}
      {!configured && <p className="mt-2 text-[12.5px] text-muted">Uploading needs Cloudinary keys in the environment variables.</p>}
      {hint && <p className="mt-2 text-[12.5px] text-muted">{hint}</p>}
    </div>
  );
}
