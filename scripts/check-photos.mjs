import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";

const photos = JSON.parse(await fs.readFile("src/data/photography.json", "utf8"));
assert.equal(photos.length, 39, "Every built-in photograph needs a credit");
assert.equal(new Set(photos.map(p => p.source)).size, photos.length, "Use distinct source photographs");
const checks = [];
for (const photo of photos) {
  assert.match(photo.src, /^\/images\/(?:photos|themed-2k)\/[\w/-]+\.webp$/);
  assert.ok(photo.author.trim(), `${photo.key}: photographer credit is required`);
  assert.match(photo.license, /^(Pexels License|CC BY(?:-SA)? [1-4]\.0|CC0|Public domain)$/);
  assert.ok(["www.pexels.com", "commons.wikimedia.org"].includes(new URL(photo.source).hostname));
  assert.ok(["www.pexels.com", "creativecommons.org"].includes(new URL(photo.licenseUrl).hostname));
  const metadata = await sharp(`public${photo.src}`).metadata();
  assert.equal(metadata.width, photo.width, `${photo.key}: width does not match the credit record`);
  assert.equal(metadata.height, photo.height, `${photo.key}: height does not match the credit record`);
  if (photo.kind === "ai-recreation") {
    assert.equal(Math.max(metadata.width, metadata.height), 2048, `${photo.key}: expected a 2K export`);
    assert.ok(photo.nativeWidth > 0 && photo.nativeHeight > 0, `${photo.key}: native dimensions are required`);
    assert.equal(photo.upscaled, Math.max(photo.nativeWidth, photo.nativeHeight) < 2048, `${photo.key}: upscaling must be recorded accurately`);
  } else {
    assert.ok(metadata.width >= 2000 && metadata.width <= 3840, `${photo.key}: unexpected resolution`);
    assert.ok(metadata.width <= photo.sourceWidth, `${photo.key}: do not enlarge the source`);
  }
  checks.push({ key: photo.key, width: metadata.width, height: metadata.height, nativeWidth: photo.nativeWidth, nativeHeight: photo.nativeHeight, upscaled: photo.upscaled, license: photo.license, source: photo.source });
}
const reportDirectory = photos.every(photo => photo.kind === "ai-recreation") ? "output/themed-2k" : "output/photo-refresh";
await fs.writeFile(`${reportDirectory}/asset-checks.json`, `${JSON.stringify({ photos: photos.length, uniqueSources: photos.length, pexels: photos.filter(p => p.license === "Pexels License").length, commons: photos.filter(p => p.license !== "Pexels License").length, allAuthorsPresent: true, allDimensionsMatch: true, checks }, null, 2)}\n`);
console.log(`Verified ${photos.length} distinct, credited website images.`);
