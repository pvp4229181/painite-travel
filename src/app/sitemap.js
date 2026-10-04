import { getArticles, getDestinations, getExperiences, getJourneys } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap() {
  const [destinations, journeys, experiences, journal] = await Promise.all([
    getDestinations(),
    getJourneys(),
    getExperiences(),
    getArticles(),
  ]);
  const now = new Date();
  const page = (path, priority = 0.7, changeFrequency = "monthly") => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/destinations", 0.9),
    page("/journeys", 0.9),
    page("/experiences", 0.8),
    page("/services", 0.8),
    page("/plan-your-journey", 0.9),
    page("/about", 0.6),
    page("/responsible-travel", 0.5),
    page("/faq", 0.5),
    page("/journal", 0.7, "weekly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
    ...destinations.map((d) => page(`/destinations/${d.slug}`, 0.9)),
    ...journeys.map((j) => page(`/journeys/${j.slug}`, 0.8)),
    ...experiences.map((e) => page(`/experiences/${e.slug}`, 0.6)),
    ...journal.map((a) => ({ ...page(`/journal/${a.slug}`, 0.6), lastModified: new Date(a.date) })),
  ];
}
