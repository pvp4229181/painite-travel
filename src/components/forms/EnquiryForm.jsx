"use client";

import { useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { destinations as starterDestinations } from "@/data/destinations";
import { experiences as starterExperiences } from "@/data/experiences";
import { cn } from "@/lib/utils";

const travelStyles = ["Not sure yet", "Culture and heritage", "Nature and wildlife", "Wellness and slow travel", "Celebration or honeymoon", "Family journey", "Adventure"];

const fieldCls =
  "w-full border border-[#cbbfa9] bg-cream-soft px-4 py-3 text-[14px] text-text outline-none transition-colors placeholder:text-muted/50 focus:border-terracotta";
const labelCls = "mb-2 block text-[12.5px] text-muted";

function Field({ label, id, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-[12px] text-terracotta" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm({
  defaultDestination = "",
  defaultJourney = "",
  destinations = starterDestinations,
  experiences = starterExperiences,
}) {
  const [interests, setInterests] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const toggle = (slug) => setInterests((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.interests = interests;

    const nextErrors = {};
    if (!payload.name?.trim()) nextErrors.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(payload.email || "")) nextErrors.email = "Please enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setStatus("sending");
    try {
      await axios.post("/api/contact", payload);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.error || "Something went wrong. Please try again, or email us directly.");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "sent" ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-line pt-10"
        >
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-terracotta text-ivory">
            <Check className="size-5" strokeWidth={1.5} />
          </span>
          <h2 className="mt-6 font-serif text-4xl">Thank you.</h2>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-muted">
            Your enquiry is with us. A Painite curator will read it personally and reply within 24 hours.
          </p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} noValidate className="space-y-5" exit={{ opacity: 0 }}>
          {/* Honeypot: hidden from people, tempting to bots. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {defaultJourney && <input type="hidden" name="journey" value={defaultJourney} />}

          <Field label="Full name" id="name" error={errors.name}>
            <input id="name" name="name" autoComplete="name" className={fieldCls} aria-invalid={!!errors.name} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email address" id="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" className={fieldCls} aria-invalid={!!errors.email} />
            </Field>
            <Field label="Phone number (optional)" id="phone">
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={fieldCls} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Destination" id="destination">
              <select id="destination" name="destination" defaultValue={defaultDestination} className={cn(fieldCls, "appearance-auto")}>
                <option value="">Not sure yet</option>
                {destinations.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
                <option value="multiple">More than one</option>
              </select>
            </Field>
            <Field label="Preferred travel dates" id="dates">
              <input id="dates" name="dates" placeholder="e.g. late March, 2 weeks" className={fieldCls} />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Number of travellers" id="travellers">
              <input id="travellers" name="travellers" inputMode="numeric" className={fieldCls} />
            </Field>
            <Field label="Travel style" id="style">
              <select id="style" name="style" className={cn(fieldCls, "appearance-auto")}>
                {travelStyles.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <fieldset>
            <legend className={labelCls}>What draws you? Choose any.</legend>
            <div className="flex flex-wrap gap-2">
              {experiences.map((x) => {
                const on = interests.includes(x.slug);
                return (
                  <label
                    key={x.slug}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-2 text-[12.5px] transition-colors",
                      on ? "border-terracotta bg-terracotta/10 text-text" : "border-[#cbbfa9] bg-cream-soft text-text hover:border-text/50",
                    )}
                  >
                    <input type="checkbox" checked={on} onChange={() => toggle(x.slug)} className="size-3.5 accent-terracotta" />
                    {x.name}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <Field label="Tell us about your journey" id="message">
            <textarea id="message" name="message" rows={5} className={cn(fieldCls, "resize-y")} />
          </Field>

          {status === "error" && (
            <p className="text-[13px] text-terracotta" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="group mt-4 inline-flex items-center gap-3 bg-ink px-7 py-4 text-[13px] tracking-wide text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send enquiry"}
            {status === "sending" ? (
              <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.5} />
            ) : (
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
