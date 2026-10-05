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
  "enquiry-input w-full border border-line bg-cream px-4 py-3 text-[14px] text-text outline-none transition-colors placeholder:text-muted/50 focus:border-terracotta";
const labelCls = "mb-2 block text-[12.5px] text-muted";

function Field({ label, id, error, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className={labelCls}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[12px] text-terracotta" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function EnquiryForm({
  defaultDestination = "",
  defaultJourney = "",
  defaultExperience = "",
  destinations = starterDestinations,
  experiences = starterExperiences,
}) {
  const [interests, setInterests] = useState(() => defaultExperience ? [defaultExperience] : []);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggle = (slug) => setInterests((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug]));

  async function onSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    payload.interests = interests;
    payload.dates = [startDate, endDate].filter(Boolean).join(" to ");

    const nextErrors = {};
    if (!payload.name?.trim()) nextErrors.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(payload.email || "")) nextErrors.email = "Please enter a valid email address.";
    if (startDate && endDate && endDate < startDate) nextErrors.endDate = "Please choose an end date on or after your start date.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      e.currentTarget.elements.namedItem(Object.keys(nextErrors)[0])?.focus();
      return;
    }

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
        <motion.form key="form" onSubmit={onSubmit} noValidate className="enquiry-form" exit={{ opacity: 0 }}>
          {/* Honeypot: hidden from people, tempting to bots. */}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          {defaultJourney && <input type="hidden" name="journey" value={defaultJourney} />}

          <fieldset className="enquiry-field-group"><legend className="enquiry-group-title"><span>01</span> Your details</legend><p className="enquiry-group-hint">Let us know how to reach you. * Required</p><div className="enquiry-fields">
          <Field label="Full name *" id="name" error={errors.name}>
            <input id="name" name="name" autoComplete="name" placeholder="Your full name" required className={fieldCls} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Email address *" id="email" error={errors.email}>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required className={fieldCls} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} />
            </Field>
            <Field label="Phone number (optional)" id="phone">
              <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Include country code" className={fieldCls} />
            </Field>
          </div>

          </div></fieldset><fieldset className="enquiry-field-group"><legend className="enquiry-group-title"><span>02</span> Your journey</legend><p className="enquiry-group-hint">Still exploring? Leave these details open.</p><div className="enquiry-fields">
          <div>
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
          </div>

          <fieldset>
            <legend className={labelCls}>Preferred travel dates (optional)</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Vacation start" id="startDate">
                <input id="startDate" name="startDate" type="date" value={startDate} onChange={event => {
                  const value = event.target.value;
                  setStartDate(value);
                  if (endDate && value && endDate < value) setEndDate("");
                }} className={fieldCls} />
              </Field>
              <Field label="Vacation end" id="endDate" error={errors.endDate}>
                <input id="endDate" name="endDate" type="date" min={startDate || undefined} value={endDate} onChange={event => setEndDate(event.target.value)} aria-invalid={!!errors.endDate} aria-describedby={errors.endDate ? "endDate-error" : undefined} className={fieldCls} />
              </Field>
            </div>
          </fieldset>

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

          </div></fieldset>
          <fieldset className="enquiry-field-group"><legend className="enquiry-group-title"><span>03</span> Make it personal</legend><p className="enquiry-group-hint">Choose the experiences you love.</p><div className="enquiry-fields">
          <fieldset>
            <legend className="sr-only">What draws you? Choose any.</legend>
            <div className="flex flex-wrap gap-2">
              {experiences.map((x) => {
                const on = interests.includes(x.slug);
                return (
                  <label
                    key={x.slug}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-2 text-[12.5px] transition-colors",
                      on ? "border-terracotta bg-terracotta/10 text-text" : "border-line bg-cream text-text hover:border-text/50",
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
            <textarea id="message" name="message" rows={4} placeholder="A special occasion, a favourite place, or something you have always wanted to do..." className={cn(fieldCls, "resize-y")} />
          </Field>

          </div></fieldset>
          {status === "error" && (
            <p className="text-[13px] text-terracotta" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="enquiry-submit group mt-4 inline-flex w-full items-center justify-between gap-3 bg-ink px-7 py-4 text-[13px] tracking-wide text-ivory transition-colors hover:bg-ink-soft disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send enquiry"}
            {status === "sending" ? (
              <LoaderCircle className="size-3.5 animate-spin" strokeWidth={1.5} />
            ) : (
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
            )}
          </button>
          <p className="enquiry-privacy">We use your details to respond to your enquiry. <a href="/privacy">Privacy policy</a></p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
