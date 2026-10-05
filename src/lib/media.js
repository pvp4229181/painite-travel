// Helpers for media uploaded through the admin (stored on Cloudinary).
// Safe to import from both server and client code.

const CLOUDINARY = /^https:\/\/res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\//;

/** True for an image or video URL uploaded through the admin. */
export function isUploadedMedia(value) {
  return typeof value === "string" && CLOUDINARY.test(value);
}

/** Inserts a Cloudinary transformation into an upload URL, e.g. "q_auto". */
function transform(url, t) {
  return url.replace(/\/upload\//, `/upload/${t}/`);
}

/** Video URL for playback: Cloudinary picks a quality that keeps the file small. */
export function videoSrc(url) {
  return isUploadedMedia(url) ? transform(url, "q_auto") : url;
}

/** A small cropped preview, for the admin. Video URLs become a still frame. */
export function mediaThumb(url, width = 320, height = 240) {
  if (!isUploadedMedia(url)) return url;
  const t = `c_fill,w_${width},h_${height},f_auto,q_auto`;
  return url.includes("/video/upload/")
    ? transform(url, `so_1,${t}`).replace(/\.[a-z0-9]+$/i, ".jpg")
    : transform(url, t);
}

/** "image" or "video", from an uploaded media URL. */
export function mediaType(url) {
  return typeof url === "string" && url.includes("/video/upload/") ? "video" : "image";
}

/** An uploaded image scaled down to at most `width` pixels wide, keeping its shape. */
export function mediaImage(url, width = 1600) {
  return isUploadedMedia(url) ? transform(url, `c_limit,w_${width},f_auto,q_auto`) : url;
}

// Cloudinary's free-plan limits, checked before uploading so errors are friendly.
export const MAX_BYTES = { image: 10 * 1024 * 1024, video: 100 * 1024 * 1024 };
