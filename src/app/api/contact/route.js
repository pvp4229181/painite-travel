import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Enquiry from "@models/Enquiry";
import { site } from "@/data/site";
import { getDestination, getExperience, getJourney } from "@/lib/content";
import connectDB, { isDbConfigured } from "@/utils/db";

export const runtime = "nodejs";

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const clip = (v, n = 200) => (typeof v === "string" ? v.trim().slice(0, n) : "");

function getTransport() {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_SECURE, EMAIL_USER, EMAIL_PASSWORD } = process.env;
  if (!EMAIL_USER || !EMAIL_PASSWORD) return null;
  const port = Number(EMAIL_PORT || 465);
  return nodemailer.createTransport({
    host: EMAIL_HOST || "smtp.gmail.com",
    port,
    secure: EMAIL_SECURE ? EMAIL_SECURE === "true" : port === 465,
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this in.
  if (body.company) return NextResponse.json({ ok: true });

  const [destination, journey, experienceNames] = await Promise.all([
    getDestination(body.destination),
    getJourney(body.journey),
    Promise.all((Array.isArray(body.interests) ? body.interests.slice(0, 20) : []).map(async (s) => (await getExperience(s))?.name)),
  ]);

  const data = {
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    phone: clip(body.phone, 40),
    destination: destination?.name || (body.destination === "multiple" ? "More than one" : "Not sure yet"),
    journey: journey?.title || "",
    dates: clip(body.dates, 120),
    travellers: clip(body.travellers, 20),
    style: clip(body.style, 60),
    interests: experienceNames.filter(Boolean),
    message: clip(body.message, 5000),
  };

  if (!data.name) return NextResponse.json({ error: "Please tell us your name." }, { status: 422 });
  if (!/^\S+@\S+\.\S+$/.test(data.email))
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 422 });

  const rows = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Destination", data.destination],
    ["Journey", data.journey],
    ["Travel dates", data.dates],
    ["Travellers", data.travellers],
    ["Travel style", data.style],
    ["Interests", data.interests.join(", ")],
  ].filter(([, v]) => v);

  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${data.message}`;
  const html = `
    <div style="font-family:Georgia,serif;color:#1d2520;max-width:560px">
      <h2 style="font-weight:400;margin:0 0 16px">New journey enquiry</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#545a52">${esc(k)}</td><td style="padding:4px 0">${esc(v)}</td></tr>`,
          )
          .join("")}
      </table>
      ${data.message ? `<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;white-space:pre-wrap;margin-top:20px">${esc(data.message)}</p>` : ""}
    </div>`;

  // Save first, so the enquiry reaches the admin even if email fails.
  let saved = null;
  if (isDbConfigured()) {
    try {
      await connectDB();
      saved = await Enquiry.create(data);
    } catch (err) {
      console.error("[contact] could not save enquiry:", err);
    }
  }

  const failed = () =>
    NextResponse.json({ error: `We could not send your enquiry just now. Please email us at ${site.email}.` }, { status: 502 });

  const transport = getTransport();
  if (!transport) {
    if (saved) return NextResponse.json({ ok: true, delivered: false });
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email not configured; enquiry received:\n" + text);
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] Neither email (EMAIL_USER / EMAIL_PASSWORD) nor MongoDB is configured.");
    return failed();
  }

  try {
    await transport.sendMail({
      from: process.env.EMAIL_FROM || `"${site.name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || site.email,
      replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`,
      subject: `Journey enquiry: ${data.name}${data.journey ? `, ${data.journey}` : ` (${data.destination})`}`,
      text,
      html,
    });
    if (saved) await Enquiry.updateOne({ _id: saved._id }, { emailDelivered: true }).catch(() => {});
    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return saved ? NextResponse.json({ ok: true, delivered: false }) : failed();
  }
}
