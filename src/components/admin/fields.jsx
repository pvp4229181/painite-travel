"use client";

import { useId } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Check, Plus, Trash2 } from "lucide-react";
import { imageOptions, imageFor, imageSrc } from "@/lib/scenes";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-[14px] text-text outline-none transition-colors placeholder:text-muted/50 focus:border-ink focus:ring-2 focus:ring-gold/30 aria-[invalid=true]:border-terracotta";

export function Section({ title, description, children, className, actions }) {
  return (
    <section className={cn("rounded-xl border border-line bg-white/70 p-5 md:p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="font-serif text-[1.4rem] leading-tight">{title}</h2>}
            {description && <p className="mt-1 text-[13px] text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className="space-y-5">{children}</div>
    </section>
  );
}

export function Field({ label, hint, error, htmlFor, children, className }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-text">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 text-[12.5px] text-terracotta" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-[12.5px] text-muted">{hint}</p>
      )}
    </div>
  );
}

export function TextInput({ label, hint, error, value, onChange, className, prefix, ...props }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <div className={cn(prefix && "flex items-stretch")}>
        {prefix && (
          <span className="flex items-center rounded-l-md border border-r-0 border-line bg-sand/50 px-3 text-[13px] text-muted">
            {prefix}
          </span>
        )}
        <input
          id={id}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={Boolean(error)}
          className={cn(inputCls, prefix && "rounded-l-none")}
          {...props}
        />
      </div>
    </Field>
  );
}

export function TextArea({ label, hint, error, value, onChange, rows = 4, className, ...props }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <textarea
        id={id}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(inputCls, "resize-y leading-relaxed")}
        {...props}
      />
    </Field>
  );
}

export function Select({ label, hint, error, value, onChange, options, className }) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <select id={id} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, description, checked, onChange }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block text-[13.5px] font-medium">{label}</span>
        {description && <span className="mt-0.5 block text-[12.5px] text-muted">{description}</span>}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
          checked ? "bg-[#4f6f3f]" : "bg-line",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-[22px]" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export function CheckboxGroup({ label, hint, options, value = [], onChange }) {
  const toggle = (v) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <fieldset>
      {label && <legend className="mb-2 text-[13px] font-medium">{label}</legend>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <label
              key={o.value}
              className={cn(
                "inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors",
                on ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-text/40",
              )}
            >
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(o.value)} />
              {on && <Check className="size-3.5" strokeWidth={2} />}
              {o.label}
            </label>
          );
        })}
      </div>
      {hint && <p className="mt-2 text-[12.5px] text-muted">{hint}</p>}
    </fieldset>
  );
}

/** Choose one of the site's artwork images. `allowNone` adds a "default" choice. */
export function ImagePicker({ label, hint, value, onChange, allowNone, noneLabel = "Default", compact }) {
  const selected = value ? imageFor(value) : "";
  const choices = allowNone ? [{ key: "", label: noneLabel }, ...imageOptions] : imageOptions;
  return (
    <fieldset>
      {label && <legend className="mb-2 text-[13px] font-medium">{label}</legend>}
      <div className={cn("grid gap-2", compact ? "grid-cols-4 sm:grid-cols-8" : "grid-cols-3 sm:grid-cols-4")}>
        {choices.map((o) => {
          const on = selected === o.key;
          return (
            <button
              key={o.key || "none"}
              type="button"
              onClick={() => onChange(o.key)}
              aria-pressed={on}
              title={o.label}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-md border-2 text-left transition-all",
                on ? "border-ink ring-2 ring-gold/50" : "border-transparent opacity-80 hover:opacity-100",
              )}
            >
              {o.key ? (
                <Image src={imageSrc(o.key)} alt="" fill sizes="160px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 bg-sand" />
              )}
              {!compact && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-4 pb-1.5 text-[11px] text-white">
                  {o.label}
                </span>
              )}
              {on && (
                <span className="absolute top-1.5 right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-ink text-ivory">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-2 text-[12.5px] text-muted">{hint}</p>}
    </fieldset>
  );
}

const iconBtn =
  "inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-sand hover:text-text disabled:pointer-events-none disabled:opacity-30";

/** An editable, reorderable list of objects. */
export function Repeater({ items = [], onChange, newItem, renderItem, itemTitle, addLabel = "Add", emptyText }) {
  const update = (i, patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const move = (i, dir) => {
    const next = [...items];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.length === 0 && emptyText && (
        <p className="rounded-md border border-dashed border-line px-4 py-6 text-center text-[13px] text-muted">{emptyText}</p>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-line bg-cream-soft/60">
          <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
            <span className="truncate text-[13px] font-medium">{itemTitle(item, i)}</span>
            <div className="flex shrink-0 items-center">
              <button type="button" className={iconBtn} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">
                <ArrowUp className="size-4" strokeWidth={1.5} />
              </button>
              <button type="button" className={iconBtn} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down">
                <ArrowDown className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className={cn(iconBtn, "hover:text-terracotta")}
                onClick={() => onChange(items.filter((_, k) => k !== i))}
                aria-label="Remove"
              >
                <Trash2 className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="space-y-4 p-4">{renderItem(item, (patch) => update(i, patch), i)}</div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, newItem(items.length)])}
        className="inline-flex items-center gap-2 rounded-md border border-dashed border-text/30 px-4 py-2.5 text-[13px] text-text transition-colors hover:border-ink hover:bg-white"
      >
        <Plus className="size-4" strokeWidth={1.5} /> {addLabel}
      </button>
    </div>
  );
}

/** A simple list of single-line strings. */
export function StringList({ label, hint, items = [], onChange, placeholder, addLabel = "Add" }) {
  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        {items.map((s, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={s}
              placeholder={placeholder}
              onChange={(e) => onChange(items.map((x, k) => (k === i ? e.target.value : x)))}
              className={inputCls}
              aria-label={`${label} ${i + 1}`}
            />
            <button
              type="button"
              className={cn(iconBtn, "size-10 shrink-0 hover:text-terracotta")}
              onClick={() => onChange(items.filter((_, k) => k !== i))}
              aria-label="Remove"
            >
              <Trash2 className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, ""])}
          className="inline-flex items-center gap-2 text-[13px] text-text underline-offset-4 hover:underline"
        >
          <Plus className="size-4" strokeWidth={1.5} /> {addLabel}
        </button>
      </div>
    </Field>
  );
}
