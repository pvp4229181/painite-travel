// Server-side definition of everything the admin can edit: which model backs
// it, how incoming form data is cleaned and validated, and any side effects.
import mongoose from "mongoose";
import Article from "@models/Article";
import Destination from "@models/Destination";
import Enquiry, { ENQUIRY_STATUSES } from "@models/Enquiry";
import Region from "@models/Region";
import Service from "@models/Service";
import Tour from "@models/Tour";
import { toPlain } from "@/lib/content";
import { normalizeScene } from "@/lib/scenes";
import { slugify } from "@/lib/starter";

export class ValidationError extends Error {
  constructor(errors) {
    super("Please check the highlighted fields.");
    this.errors = errors;
  }
}

// ---- small sanitizers -------------------------------------------------------
const str = (v, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" ? String(v) : "");
const text = (v, max = 5000) => str(v, max).replace(/\r\n/g, "\n");
const bool = (v) => v === true || v === "true" || v === "on";
const int = (v, min, max) => {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : null;
};
const list = (v) => (Array.isArray(v) ? v : []);
const strList = (v, max = 300) => list(v).map((s) => str(s, max)).filter(Boolean);
const scene = (v) => normalizeScene(str(v, 40));
const paragraphs = (v) =>
  (Array.isArray(v) ? v.join("\n\n") : text(v, 50000))
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

function requireFields(doc, fields) {
  const errors = {};
  for (const [key, label] of Object.entries(fields)) {
    if (doc[key] === "" || doc[key] === null || doc[key] === undefined) errors[key] = `${label} is required.`;
  }
  if (Object.keys(errors).length) throw new ValidationError(errors);
}

const revalidateSite = async () => {
  const { revalidatePath } = await import("next/cache");
  revalidatePath("/", "layout");
};

// ---- resources --------------------------------------------------------------
export const resources = {
  journeys: {
    model: Tour,
    label: "Journey",
    sort: { order: 1, title: 1 },
    publicPath: (d) => `/journeys/${d.slug}`,
    defaults: () => ({
      title: "",
      slug: "",
      region: "",
      destinations: [],
      days: 7,
      nights: 6,
      scene: "himalaya",
      featured: false,
      order: 0,
      published: false,
      summary: "",
      glance: { destinations: "", style: "", season: "", idealFor: "", accommodation: "" },
      introTitle: "",
      intro: "",
      itinerary: [],
    }),
    sanitize(b) {
      const days = int(b.days, 1, 120);
      const g = b.glance || {};
      const doc = {
        title: str(b.title, 120),
        slug: slugify(b.slug || b.title),
        region: str(b.region, 120),
        destinations: strList(b.destinations, 60).map(slugify),
        days,
        nights: int(b.nights, 0, 120) ?? (days ? days - 1 : null),
        scene: scene(b.scene),
        featured: bool(b.featured),
        order: int(b.order, 0, 999) ?? 0,
        published: bool(b.published),
        summary: str(b.summary, 300),
        glance: {
          destinations: str(g.destinations, 200),
          style: str(g.style, 200),
          season: str(g.season, 200),
          idealFor: str(g.idealFor, 200),
          accommodation: str(g.accommodation, 200),
        },
        introTitle: str(b.introTitle, 200),
        intro: text(b.intro, 4000),
        itinerary: list(b.itinerary)
          .map((d, i) => ({
            day: str(d?.day, 20) || String(i + 1),
            title: str(d?.title, 160),
            text: text(d?.text, 4000),
            stay: str(d?.stay, 200),
            scene: scene(d?.scene),
          }))
          .filter((d) => d.title),
      };
      requireFields(doc, { title: "Title", slug: "Slug", days: "Days" });
      return doc;
    },
    afterSave: revalidateSite,
    afterDelete: revalidateSite,
  },

  destinations: {
    model: Destination,
    label: "Destination",
    sort: { order: 1, name: 1 },
    publicPath: (d) => `/destinations/${d.slug}`,
    defaults: () => ({
      name: "",
      slug: "",
      tagline: "",
      heroLine: "",
      homeLine: "",
      scene: "himalaya",
      cardScene: "himalaya",
      homeScene: "",
      introTitle: "",
      introText: "",
      quote: "",
      bestTime: "",
      experiences: [],
      order: 0,
      published: false,
      regions: [],
    }),
    sanitize(b) {
      const doc = {
        name: str(b.name, 80),
        slug: slugify(b.slug || b.name),
        tagline: str(b.tagline, 200),
        heroLine: str(b.heroLine, 200),
        homeLine: str(b.homeLine, 200),
        scene: scene(b.scene),
        cardScene: scene(b.cardScene || b.scene),
        homeScene: b.homeScene ? scene(b.homeScene) : "",
        introTitle: str(b.introTitle, 200),
        introText: text(b.introText, 3000),
        quote: str(b.quote, 300),
        bestTime: str(b.bestTime, 200),
        experiences: strList(b.experiences, 60).map(slugify),
        order: int(b.order, 0, 999) ?? 0,
        published: bool(b.published),
      };
      requireFields(doc, { name: "Name", slug: "Slug" });
      return doc;
    },
    async load(doc) {
      const regions = await Region.find({ destination: doc.slug }).sort({ order: 1 }).lean();
      return { ...doc, regions: regions.map(toPlain) };
    },
    async afterSave({ doc, before, body }) {
      // Regions are edited inline with their destination and stored in Region.
      if (before && before.slug !== doc.slug) {
        await Region.deleteMany({ destination: before.slug });
        await Tour.updateMany({ destinations: before.slug }, { $set: { "destinations.$": doc.slug } });
      }
      const regions = list(body.regions)
        .map((r, i) => ({
          name: str(r?.name, 100),
          slug: slugify(r?.name),
          line: str(r?.line, 200),
          scene: scene(r?.scene),
          destination: doc.slug,
          order: i,
        }))
        .filter((r) => r.name)
        // two regions with the same name would collide on the unique index
        .filter((r, i, all) => all.findIndex((x) => x.slug === r.slug) === i);
      await Region.deleteMany({ destination: doc.slug });
      if (regions.length) await Region.insertMany(regions);
      await revalidateSite();
    },
    async afterDelete({ doc }) {
      await Region.deleteMany({ destination: doc.slug });
      await revalidateSite();
    },
  },

  experiences: {
    model: Service,
    label: "Experience",
    sort: { order: 1, name: 1 },
    publicPath: (d) => `/experiences/${d.slug}`,
    defaults: () => ({ name: "", slug: "", line: "", scene: "heritage", body: "", moments: [], order: 0, published: false }),
    sanitize(b) {
      const doc = {
        name: str(b.name, 80),
        slug: slugify(b.slug || b.name),
        line: str(b.line, 200),
        scene: scene(b.scene),
        body: text(b.body, 4000),
        moments: strList(b.moments, 200),
        order: int(b.order, 0, 999) ?? 0,
        published: bool(b.published),
      };
      requireFields(doc, { name: "Name", slug: "Slug" });
      return doc;
    },
    afterSave: revalidateSite,
    afterDelete: revalidateSite,
  },

  journal: {
    model: Article,
    label: "Article",
    sort: { date: -1 },
    publicPath: (d) => `/journal/${d.slug}`,
    defaults: () => ({
      title: "",
      slug: "",
      category: "",
      date: new Date().toISOString().slice(0, 10),
      readTime: "",
      scene: "heritage",
      excerpt: "",
      body: "",
      published: false,
    }),
    sanitize(b) {
      const date = str(b.date, 10);
      const doc = {
        title: str(b.title, 160),
        slug: slugify(b.slug || b.title),
        category: str(b.category, 60),
        date: /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(Date.parse(date)) ? date : "",
        readTime: str(b.readTime, 40),
        scene: scene(b.scene),
        excerpt: str(b.excerpt, 400),
        body: paragraphs(b.body),
        published: bool(b.published),
      };
      requireFields(doc, { title: "Title", slug: "Slug", date: "A valid date" });
      return doc;
    },
    // The editor works with paragraphs separated by blank lines.
    load: (doc) => ({ ...doc, body: (doc.body || []).join("\n\n") }),
    afterSave: revalidateSite,
    afterDelete: revalidateSite,
  },

  enquiries: {
    model: Enquiry,
    label: "Enquiry",
    sort: { createdAt: -1 },
    canCreate: false,
    sanitize(b) {
      const status = str(b.status, 20);
      if (!ENQUIRY_STATUSES.includes(status)) throw new ValidationError({ status: "Choose a status." });
      return { status, notes: text(b.notes, 10000) };
    },
  },
};

export function getResource(name) {
  return Object.hasOwn(resources, name) ? resources[name] : null;
}

/** Loads one document for an edit screen, or defaults for "new". Null if missing. */
export async function loadForEdit(name, id) {
  const res = getResource(name);
  if (!res) return null;
  if (id === "new") return res.canCreate === false ? null : res.defaults();
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await res.model.findById(id).lean();
  if (!doc) return null;
  const plain = toPlain(doc);
  return res.load ? toPlain(await res.load(plain)) : plain;
}

/** Turns thrown errors into an HTTP status and a message for the editor. */
export function describeError(err) {
  if (err instanceof ValidationError) return { status: 422, body: { error: err.message, errors: err.errors } };
  if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern || { slug: 1 })[0];
    return {
      status: 409,
      body: { error: "Something with that address already exists.", errors: { [field]: "This is already in use. Choose another." } },
    };
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.fromEntries(Object.entries(err.errors).map(([k, e]) => [k, e.message]));
    return { status: 422, body: { error: "Please check the highlighted fields.", errors } };
  }
  console.error("[admin]", err);
  return { status: 500, body: { error: "Something went wrong saving this. Please try again." } };
}
