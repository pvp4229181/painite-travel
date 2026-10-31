import fs from "node:fs/promises";
import sharp from "sharp";

const jobs = JSON.parse(await fs.readFile("output/city-images/jobs.json", "utf8"));
const cities = {};
for (const job of jobs) {
  const file = `output/city-images/results/${job.outputPath.replaceAll("/", "--")}.json`;
  let result;
  try { result = JSON.parse(await fs.readFile(file, "utf8")); }
  catch (error) { if (error.code === "ENOENT" && process.argv.includes("--partial")) continue; throw error; }
  const dimensions = await sharp(`public${result.src}`).metadata();
  if (Math.max(dimensions.width, dimensions.height) !== 2048) throw new Error(`${job.key}: expected a 2K image`);
  cities[job.key] = { label: job.label, src: result.src, alt: job.alt, width: dimensions.width, height: dimensions.height, generator: "ImageGen" };
}
await fs.writeFile("src/data/city-images.json", `${JSON.stringify(cities, null, 2)}\n`);
console.log(`Registered ${Object.keys(cities).length} city-specific images.`);
