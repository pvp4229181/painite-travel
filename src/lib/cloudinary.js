// Server-only access to Cloudinary, where images and videos uploaded in the admin live.
// Configure with CLOUDINARY_URL (cloudinary://<key>:<secret>@<cloud>), or the three
// CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET variables.
import { createHash } from "node:crypto";

// Every upload is tagged, so the library lists only this site's media.
const TAG = "painite";
const FOLDER = "painite";

function config() {
  const fromUrl = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  const cloud = fromUrl?.[3] || process.env.CLOUDINARY_CLOUD_NAME;
  const key = fromUrl?.[1] || process.env.CLOUDINARY_API_KEY;
  const secret = fromUrl?.[2] || process.env.CLOUDINARY_API_SECRET;
  return cloud && key && secret ? { cloud, key, secret } : null;
}

export function isMediaConfigured() {
  return Boolean(config());
}

function sign(params, secret) {
  const payload = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(payload + secret).digest("hex");
}

/** Everything the browser needs to upload one file straight to Cloudinary. */
export function signedUpload(type) {
  const { cloud, key, secret } = config();
  const params = { folder: FOLDER, tags: TAG, timestamp: Math.floor(Date.now() / 1000) };
  return {
    url: `https://api.cloudinary.com/v1_1/${cloud}/${type}/upload`,
    fields: { ...params, api_key: key, signature: sign(params, secret) },
  };
}

async function adminApi(path, init = {}) {
  const { cloud, key, secret } = config();
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}${path}`, {
    ...init,
    headers: { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}` },
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message || `Cloudinary responded ${res.status}`);
  return body;
}

/** The site's uploaded images or videos, newest first. */
export async function listMedia(type) {
  try {
    const body = await adminApi(`/resources/${type}/tags/${TAG}?max_results=500`);
    return (body.resources ?? [])
      .map((r) => ({
        id: r.public_id,
        type,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        format: r.format,
        createdAt: r.created_at,
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch (err) {
    // A brand-new account has no tag yet, which Cloudinary reports as "not found".
    if (/not found/i.test(err.message)) return [];
    throw err;
  }
}

export async function deleteMedia(type, id) {
  const qs = new URLSearchParams({ "public_ids[]": id });
  await adminApi(`/resources/${type}/upload?${qs}`, { method: "DELETE" });
}
