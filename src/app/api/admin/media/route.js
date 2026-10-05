import { NextResponse } from "next/server";
import Article from "@models/Article";
import Destination from "@models/Destination";
import Region from "@models/Region";
import Service from "@models/Service";
import Tour from "@models/Tour";
import { guardAdminApi } from "@/lib/auth/session";
import { deleteMedia, isMediaConfigured, listMedia, signedUpload } from "@/lib/cloudinary";
import { isUploadedMedia } from "@/lib/media";
import connectDB from "@/utils/db";

export const runtime = "nodejs";

const TYPES = ["image", "video"];
const notConfigured = () =>
  NextResponse.json(
    { error: "Uploads are not set up yet. Add your Cloudinary keys to the environment variables.", configured: false },
    { status: 503 },
  );

// GET /api/admin/media?type=image|video  -> the media library
export async function GET(request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const type = new URL(request.url).searchParams.get("type");
  if (!TYPES.includes(type)) return NextResponse.json({ error: "Unknown media type." }, { status: 400 });
  if (!isMediaConfigured()) return NextResponse.json({ configured: false, items: [] });
  try {
    return NextResponse.json({ configured: true, items: await listMedia(type) });
  } catch (err) {
    console.error("[admin] media list failed:", err.message);
    return NextResponse.json({ error: "Could not load the media library. Check the Cloudinary keys." }, { status: 502 });
  }
}

// POST { type } -> a signed upload the browser sends straight to Cloudinary
export async function POST(request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const { type } = await request.json().catch(() => ({}));
  if (!TYPES.includes(type)) return NextResponse.json({ error: "Unknown media type." }, { status: 400 });
  if (!isMediaConfigured()) return notConfigured();
  return NextResponse.json(signedUpload(type));
}

// Where an uploaded file can be used, so it is never deleted while still on the site.
async function findUsage(url) {
  await connectDB();
  const [destinations, regions, tours, services, articles] = await Promise.all([
    Destination.find({ $or: ["scene", "cardScene", "homeScene", "video", "gallery.url"].map((f) => ({ [f]: url })) }, "name").lean(),
    Region.find({ scene: url }, "name destination").lean(),
    Tour.find({ $or: [{ scene: url }, { video: url }, { "itinerary.scene": url }, { "gallery.url": url }] }, "title").lean(),
    Service.find({ $or: [{ scene: url }, { video: url }, { "gallery.url": url }] }, "name").lean(),
    Article.find({ $or: [{ scene: url }, { "gallery.url": url }] }, "title").lean(),
  ]);
  return [
    ...destinations.map((d) => `Destination: ${d.name}`),
    ...regions.map((r) => `Region: ${r.name} (${r.destination})`),
    ...tours.map((t) => `Journey: ${t.title}`),
    ...services.map((s) => `Experience: ${s.name}`),
    ...articles.map((a) => `Journal: ${a.title}`),
  ];
}

// DELETE { type, id, url }
export async function DELETE(request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  if (!isMediaConfigured()) return notConfigured();
  const { type, id, url } = await request.json().catch(() => ({}));
  if (!TYPES.includes(type) || typeof id !== "string" || !isUploadedMedia(url)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  try {
    const usedBy = await findUsage(url);
    if (usedBy.length) {
      return NextResponse.json({ error: "This file is still used on the website. Replace it there first.", usedBy }, { status: 409 });
    }
    await deleteMedia(type, id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin] media delete failed:", err.message);
    return NextResponse.json({ error: "Could not delete the file. Please try again." }, { status: 502 });
  }
}
