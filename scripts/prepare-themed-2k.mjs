import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [key, source, manifest = "output/themed-2k/jobs.json"] = process.argv.slice(2);
const outputDirectory = path.dirname(manifest);
const jobs = JSON.parse(await fs.readFile(manifest, "utf8"));
const job = jobs.find(item => item.key === key);
if (!job || !source) throw new Error("A known image key and generated source path are required");
const relative = job.outputPath || job.referenceSrc.replace("/images/photos/", "").replace(/\.webp$/, "");
const native = `${outputDirectory}/natives/${relative}.png`;
const destination = `public/images/themed-2k/${relative}.webp`;
for (const file of [native, destination]) await fs.mkdir(path.dirname(file), { recursive: true });
await fs.copyFile(source, native);
const nativeSize = await sharp(native).metadata();
// The user chose 2K exports; retain the native file and record any upscaling.
await sharp(native).resize({ width: 2048, height: 2048, fit: "inside" }).webp({ quality: 96, effort: 5 }).toFile(destination);
const exported = await sharp(destination).metadata();
const result = { ...job, src: `/${destination.replace(/^public\//, "")}`, native, nativeWidth: nativeSize.width, nativeHeight: nativeSize.height, width: exported.width, height: exported.height, upscaled: Math.max(nativeSize.width, nativeSize.height) < 2048, kind: "ai-recreation", changes: "AI recreation inspired by the credited reference, with a new composition and cohesive travel styling; resized to a 2048-pixel long edge for the requested 2K export." };
if (job.outputPath) result.changes = "City-specific AI-created travel image, exported with a 2048-pixel long edge. Native dimensions and upscaling are recorded.";
await fs.mkdir(`${outputDirectory}/results`, { recursive: true });
await fs.writeFile(`${outputDirectory}/results/${relative.replaceAll("/", "--")}.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ key, native: [nativeSize.width, nativeSize.height], exported: [exported.width, exported.height], upscaled: result.upscaled }));
