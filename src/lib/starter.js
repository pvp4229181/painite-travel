// Copies the starter content in src/data into MongoDB.
// Relative imports only, so this runs from both Next.js and scripts/seed.mjs.
import { destinations } from "../data/destinations.js";
import { experiences } from "../data/experiences.js";
import { journal } from "../data/journal.js";
import { journeys } from "../data/journeys.js";
import { normalizeScene } from "./scenes.js";
import Article from "../../models/Article.js";
import Destination from "../../models/Destination.js";
import Region from "../../models/Region.js";
import Service from "../../models/Service.js";
import Tour from "../../models/Tour.js";

export const slugify = (s = "") =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function starterDocs() {
  return {
    destinations: destinations.map((d, i) => ({
      slug: d.slug,
      name: d.name,
      tagline: d.tagline,
      heroLine: d.heroLine,
      homeLine: d.homeLine,
      scene: normalizeScene(d.scene),
      cardScene: normalizeScene(d.cardScene || d.scene),
      homeScene: d.homeScene ? normalizeScene(d.homeScene) : "",
      introTitle: d.introTitle,
      introText: d.introText,
      quote: d.quote,
      bestTime: d.bestTime,
      whenToTravel: d.whenToTravel,
      places: d.places ?? [],
      experiences: d.experiences,
      order: i,
      published: true,
    })),
    regions: destinations.flatMap((d) =>
      d.regions.map((r, k) => ({
        name: r.name,
        slug: slugify(r.name),
        destination: d.slug,
        line: r.line,
        scene: normalizeScene(r.scene),
        order: k,
      })),
    ),
    services: experiences.map((e, i) => ({
      slug: e.slug,
      name: e.name,
      line: e.line,
      body: e.body,
      moments: e.moments,
      scene: normalizeScene(e.scene),
      order: i,
      published: true,
    })),
    tours: journeys.map((j, i) => ({
      ...j,
      order: i,
      scene: normalizeScene(j.scene),
      itinerary: j.itinerary.map((d) => ({ ...d, scene: normalizeScene(d.scene), stay: d.stay || "" })),
      featured: Boolean(j.featured),
      published: true,
    })),
    articles: journal.map((a) => ({ ...a, scene: normalizeScene(a.scene), published: true })),
  };
}

/**
 * Inserts starter content. Existing documents (matched by slug) are left alone
 * unless `overwrite` is true, so running it twice never clobbers admin edits.
 */
export async function importStarterContent({ overwrite = false } = {}) {
  const docs = starterDocs();
  const op = overwrite ? "$set" : "$setOnInsert";
  const upserts = (list, key = (d) => ({ slug: d.slug })) =>
    list.map((d) => ({ updateOne: { filter: key(d), update: { [op]: d }, upsert: true } }));

  const [dest, regions, services, tours, articles] = await Promise.all([
    Destination.bulkWrite(upserts(docs.destinations)),
    Region.bulkWrite(upserts(docs.regions, (r) => ({ destination: r.destination, slug: r.slug }))),
    Service.bulkWrite(upserts(docs.services)),
    Tour.bulkWrite(upserts(docs.tours)),
    Article.bulkWrite(upserts(docs.articles)),
  ]);

  const count = (r) => r.upsertedCount + (overwrite ? r.modifiedCount : 0);
  return {
    destinations: count(dest),
    regions: count(regions),
    experiences: count(services),
    journeys: count(tours),
    journal: count(articles),
  };
}
