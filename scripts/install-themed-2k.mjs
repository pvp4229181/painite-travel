import fs from "node:fs/promises";
import sharp from "sharp";

const jobs = JSON.parse(await fs.readFile("output/themed-2k/jobs.json", "utf8"));
const photos = [];
for (const job of jobs) {
  const relative = job.referenceSrc.replace("/images/photos/", "").replace(/\.webp$/, "");
  const result = JSON.parse(await fs.readFile(`output/themed-2k/results/${relative.replaceAll("/", "--")}.json`, "utf8"));
  const actual = await sharp(`public${result.src}`).metadata();
  if (Math.max(actual.width, actual.height) !== 2048) throw new Error(`${job.key}: export is not 2K`);
  photos.push({ key: result.key, src: result.src, alt: result.alt, title: result.alt, author: result.author, credit: result.credit, license: result.license, licenseUrl: result.licenseUrl, source: result.source, original: result.original, referenceSrc: result.referenceSrc, referenceTitle: result.title, sourceWidth: result.sourceWidth, sourceHeight: result.sourceHeight, nativeWidth: result.nativeWidth, nativeHeight: result.nativeHeight, width: actual.width, height: actual.height, upscaled: result.upscaled, kind: result.kind, generator: "ImageGen", changes: result.changes });
}
if (photos.length !== 39) throw new Error("The complete 39-image collection is required before installation");
await fs.writeFile("src/data/photography.json", `${JSON.stringify(photos, null, 2)}\n`);
const files = [
  "src/lib/scenes.js",
  "src/app/destinations/[slug]/page.js",
  "src/components/home/TravelDetails.jsx",
  "src/components/sections/EnquirySection.jsx",
  "src/components/sections/JourneyPlanner.jsx",
  "src/components/sections/ServiceEditorial.jsx",
  "src/components/sections/FilmBanner.jsx",
];
for (const file of files) {
  const source = await fs.readFile(file, "utf8");
  await fs.writeFile(file, source.replaceAll("/images/photos/", "/images/themed-2k/"));
}
let credits = "# AI-created travel imagery and reference credits\n\nThis collection was created with ImageGen using the credited photographs as visual references. These are new artistic compositions. Exports have a 2048-pixel long edge; the recorded native dimensions identify any upscaling. Reference-based adaptations retain the applicable source licenses.\n\n";
for (const photo of photos) credits += `## ${photo.alt}\n\n- Image: ${photo.src}\n- Reference photographer: ${photo.author}\n- Reference: ${photo.source}\n- Reference license: ${photo.license} — ${photo.licenseUrl}\n- Native generation: ${photo.nativeWidth} × ${photo.nativeHeight}\n- 2K export: ${photo.width} × ${photo.height}\n- Upscaled: ${photo.upscaled ? "yes" : "no"}\n\n`;
await fs.writeFile("public/images/themed-2k/CREDITS.md", credits);
await fs.writeFile("output/themed-2k/installed.json", `${JSON.stringify(photos, null, 2)}\n`);
console.log(`Installed ${photos.length} themed 2K images. Existing video sources are unchanged.`);
