// Content for the public site. Reads published documents from MongoDB when it
// is configured and has been populated; otherwise serves the starter content in
// src/data, so the site always renders.
import { cache } from "react";
import Article from "@models/Article";
import Destination from "@models/Destination";
import Region from "@models/Region";
import Service from "@models/Service";
import Tour from "@models/Tour";
import { destinations as starterDestinations } from "@/data/destinations";
import { experiences as starterExperiences } from "@/data/experiences";
import { journal as starterArticles } from "@/data/journal";
import { journeys as starterJourneys } from "@/data/journeys";
import connectDB, { isDbConfigured } from "@/utils/db";

// After a failed connection, skip the database briefly instead of waiting on
// a timeout for every page (matters during builds with an unreachable DB).
const RETRY_AFTER_MS = 30_000;
let lastFailure = 0;

// Compatibility loader for content API routes, including single-document queries.
export async function fromDbOr(fallback, query) {
  if (!isDbConfigured() || Date.now() - lastFailure < RETRY_AFTER_MS) return { source: "static", data: fallback() };
  try {
    await connectDB();
    const data = await query();
    if (Array.isArray(data) ? data.length > 0 : Boolean(data)) {
      return { source: "mongodb", data: Array.isArray(data) ? data.map(toPlain) : toPlain(data) };
    }
  } catch (err) {
    lastFailure = Date.now();
    console.error("[content] MongoDB unavailable, using starter content.", err.message);
  }
  return { source: "static", data: fallback() };
}

/** Converts a lean Mongoose document into plain JSON with a string `id`. */
export function toPlain(doc) {
  if (!doc) return doc;
  const { _id, __v, ...rest } = doc;
  return JSON.parse(JSON.stringify({ id: String(_id), ...rest }));
}

async function fromDb(Model, load, fallback) {
  if (!isDbConfigured() || Date.now() - lastFailure < RETRY_AFTER_MS) return { source: "static", data: fallback };
  try {
    await connectDB();
    // An empty collection means starter content hasn't been imported yet.
    if (!(await Model.estimatedDocumentCount())) return { source: "static", data: fallback };
    return { source: "mongodb", data: (await load()).map(toPlain) };
  } catch (err) {
    lastFailure = Date.now();
    console.error(`[content] ${Model.modelName}: MongoDB unavailable, using starter content.`, err.message);
    return { source: "static", data: fallback };
  }
}

export const getDestinations = cache(async () => {
  const { source, data } = await fromDb(
    Destination,
    () => Destination.find({ published: true }).sort({ order: 1, name: 1 }).lean(),
    starterDestinations,
  );
  if (source === "static") return data;

  const regions = await Region.find({ destination: { $in: data.map((d) => d.slug) } })
    .sort({ order: 1 })
    .lean();
  return data.map((d) => ({
    ...d,
    experiences: d.experiences ?? [],
    regions: regions.filter((r) => r.destination === d.slug).map(toPlain),
  }));
});

export async function getDestination(slug) {
  return (await getDestinations()).find((d) => d.slug === slug);
}

export const getJourneys = cache(async () => {
  const { data } = await fromDb(
    Tour,
    () => Tour.find({ published: true }).sort({ order: 1, title: 1 }).lean(),
    starterJourneys,
  );
  return data;
});

export async function getJourney(slug) {
  return (await getJourneys()).find((j) => j.slug === slug);
}

export async function getJourneysFor(destinationSlug) {
  return (await getJourneys()).filter((j) => j.destinations?.includes(destinationSlug));
}

export const getExperiences = cache(async () => {
  const { data } = await fromDb(
    Service,
    () => Service.find({ published: true }).sort({ order: 1, name: 1 }).lean(),
    starterExperiences,
  );
  return data;
});

export async function getExperience(slug) {
  return (await getExperiences()).find((e) => e.slug === slug);
}

export const getArticles = cache(async () => {
  const { data } = await fromDb(
    Article,
    () => Article.find({ published: true }).sort({ date: -1 }).lean(),
    [...starterArticles].sort((a, b) => b.date.localeCompare(a.date)),
  );
  return data;
});

export async function getArticle(slug) {
  return (await getArticles()).find((a) => a.slug === slug);
}
