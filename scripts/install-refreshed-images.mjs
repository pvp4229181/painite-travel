import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const manifestPath = "output/image-refresh/complete-manifest.json";
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
for (const asset of manifest) {
  const destination = path.join("public/images/hd", `${asset.key}.webp`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  // Keep the generated pixels intact; responsive delivery handles smaller screens.
  await sharp(asset.source).webp({ lossless: true, effort: 6 }).toFile(destination);
  const { width, height } = await sharp(destination).metadata();
  const { size } = await fs.stat(destination);
  asset.file = destination.replaceAll("\\", "/");
  asset.width = width;
  asset.height = height;
  asset.bytes = size;
  console.log(`${asset.key}: ${width} × ${height}`);
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
