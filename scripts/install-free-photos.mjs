import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const candidates = JSON.parse(await fs.readFile("output/photo-refresh/candidates.json", "utf8"));
const choices = JSON.parse(await fs.readFile("output/photo-refresh/choices.json", "utf8").catch(() => "{}"));
const pexels = JSON.parse(await fs.readFile("output/photo-refresh/pexels-selections.json", "utf8").catch(() => "[]"));
const cooldown = JSON.parse(await fs.readFile("output/photo-refresh/commons-cooldown.json", "utf8").catch(() => "{}"));
const headers = { "User-Agent": "PainitePhotoCuration/1.0 (travel website; image attribution retained)" };
const photos = [];
await fs.mkdir("output/photo-refresh/originals", { recursive: true });
for (const item of candidates) {
  if (!item.candidates.length) continue;
  const override = pexels.find(photo => photo.key === item.key);
  const selected = override ? { ...override, title: override.alt, credit: "Pexels", license: "Pexels License", licenseUrl: "https://www.pexels.com/license/", download: `https://images.pexels.com/photos/${override.id}/pexels-photo-${override.id}.jpeg?auto=compress&cs=tinysrgb&w=3840&fit=max&q=95` } : item.candidates[choices[item.key] ?? 0];
  if (!selected) throw new Error(`Missing selection: ${item.key}`);
  const key = item.key.replace(/^ai\//, "scenes/").replace(/-photoreal-20261005|-20261005/g, "");
  const original = `output/photo-refresh/originals/${key.replaceAll("/", "-")}.jpg`;
  const destination = `public/images/photos/${key}.webp`;
  // Commons supplies a 4K derivative, avoiding enormous originals for the web.
  const downloadUrl = selected.width > 3840
    ? selected.preview.replace(/\/\d+px-/, "/3840px-").split("?")[0]
    : selected.download;
  const isCommons = new URL(selected.download).hostname === "upload.wikimedia.org";
  if (!["upload.wikimedia.org", "images.pexels.com"].includes(new URL(selected.download).hostname)) throw new Error("Unexpected image host");
  const record = `${original}.source`;
  const previous = await fs.readFile(record, "utf8").catch(() => "");
  const cached = [selected.download, downloadUrl].includes(previous);
  if (isCommons && !cached && Date.now() < (cooldown.notBefore || 0)) {
    console.log(`Deferred until Commons cooldown ends: ${item.key}`);
    continue;
  }
  if (!cached) {
    let response = await fetch(downloadUrl, { headers });
    if (response.status === 429) {
      const seconds = Math.max(60, Number(response.headers.get("retry-after")) || 60);
      console.log(`Image download rate limit: waiting ${seconds}s`);
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
      response = await fetch(downloadUrl, { headers });
    }
    if (!response.ok) throw new Error(`${item.key}: HTTP ${response.status}`);
    await fs.writeFile(original, Buffer.from(await response.arrayBuffer()));
    await fs.writeFile(record, downloadUrl);
  }
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (!cached || !(await fs.stat(destination).catch(() => null))) {
    await sharp(original).rotate().resize({ width: 3840, withoutEnlargement: true }).webp({ quality: 95, effort: 5 }).toFile(destination);
  }
  const { width, height } = await sharp(destination).metadata();
  const inputSize = await sharp(original).metadata();
  photos.push({ key: item.key, src: `/${destination.replace(/^public\//, "")}`, alt: override?.alt || item.alt, title: selected.title, author: selected.author, credit: selected.credit, license: selected.license, licenseUrl: selected.licenseUrl.startsWith("//") ? `https:${selected.licenseUrl}` : selected.licenseUrl, source: selected.source, original: selected.download, downloadedFrom: cached ? previous : downloadUrl, sourceWidth: selected.width || inputSize.width, sourceHeight: selected.height || inputSize.height, width, height, changes: "Re-encoded as WebP and resized where necessary; displayed with responsive crops. Image adaptations remain available under the original license." });
  console.log(`${item.key}: ${width} × ${height} — ${selected.license}`);
  await fs.writeFile("output/photo-refresh/selected.json", `${JSON.stringify(photos, null, 2)}\n`);
  if (!cached) await new Promise(resolve => setTimeout(resolve, isCommons ? 7500 : 1000));
}
await fs.writeFile("output/photo-refresh/selected.json", `${JSON.stringify(photos, null, 2)}\n`);
console.log(`Installed ${photos.length} freely licensed photographs.`);
