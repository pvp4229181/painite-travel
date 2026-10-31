import assert from "node:assert/strict";
import fs from "node:fs/promises";
import sharp from "sharp";
import { journeys } from "../src/data/journeys.js";
import { journal } from "../src/data/journal.js";
import { contentScene, itineraryScene, withJourneyImages } from "../src/lib/content-images.js";
import { imageSrc } from "../src/lib/scenes.js";
import cities from "../src/data/city-images.json" with { type: "json" };

const expected = {
  "himalayan-kingdoms": ["kathmandu", "kathmandu", "bhaktapur", "dhulikhel", "pokhara", "chitwan", "kathmandu", "paro", "thimphu", "punakha", "gangtey", "tigers-nest", "paro"],
  "india-golden-triangle": ["delhi", "old-delhi", "agra", "taj-mahal", "fatehpur-sikri", "jaipur", "jaipur"],
  "rajasthan-luxury": ["jaipur", "shekhawati", "thar-desert", "jodhpur", "udaipur", "udaipur"],
  "sri-lanka-in-style": ["sigiriya", "kandy", "tea-country", "yala", "galle", "colombo"],
  "kerala-slow-waters": ["kochi", "munnar", "kerala", "kovalam", "thiruvananthapuram"],
  "nepal-in-private": ["kathmandu", "pokhara", "chitwan", "kathmandu"],
  "bhutan-quiet-kingdom": ["paro", "thimphu", "punakha", "tigers-nest", "paro"],
  "maldives-private-escape": ["male", "maldives", "male"],
};

const audit = [];
for (const journey of journeys) {
  const corrected = withJourneyImages(journey);
  assert.deepEqual(corrected.itinerary.map(day => day.scene), expected[journey.slug], journey.slug);
  for (const day of corrected.itinerary) {
    const src = imageSrc(day.scene);
    await fs.access(`public${src}`);
    audit.push({ journey: journey.slug, day: day.day, title: day.title, scene: day.scene, src });
  }
}
const taj = journal.find(article => article.slug === "the-taj-at-first-light");
assert.equal(contentScene(taj), "taj-mahal");
assert.equal(imageSrc(contentScene(taj)), "/images/themed-2k/destinations/india.webp");
assert.equal(contentScene({ title: "Best Safari Experiences in Sri Lanka", category: "Sri Lanka", scene: "wildlife" }), "yala");
assert.equal(contentScene({ title: "A quiet escape", scene: "wellness" }), "wellness");
assert.equal(itineraryScene({ title: "The Taj Mahal", stay: "Hotel in Jaipur", scene: "heritage" }, {}), "taj-mahal");
const custom = "https://res.cloudinary.com/example/image/upload/custom.jpg";
assert.equal(contentScene({ title: "Delhi", scene: custom }), custom);
assert.equal(new Set(["delhi", "agra", "jaipur", "udaipur"].map(imageSrc)).size, 4);
assert.equal(Object.keys(cities).length, 20);
for (const city of Object.values(cities)) {
  const metadata = await sharp(`public${city.src}`).metadata();
  assert.equal(Math.max(metadata.width, metadata.height), 2048, city.label);
}
await fs.writeFile("output/city-images/itinerary-audit.json", `${JSON.stringify(audit, null, 2)}\n`);
console.log(`Verified ${audit.length} itinerary entries across ${journeys.length} journeys, 20 city images, and the Taj journal correction.`);
