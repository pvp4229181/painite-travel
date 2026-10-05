import { site } from "@/data/site";

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

export function buildMetadata({ title, description = site.description, path = "/", type = "website" } = {}) {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  return {
    // absolute: the root layout's title template would otherwise append the site name a second time
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: "en_GB",
      type,
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.streetAddress,
      postalCode: site.postalCode,
      addressLocality: "Agra",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    areaServed: ["India", "Nepal", "Bhutan", "Sri Lanka", "Maldives"],
  };
}

export function tripJsonLd(journey) {
  return {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: journey.title,
    description: journey.summary,
    url: absoluteUrl(`/journeys/${journey.slug}`),
    itinerary: journey.days.map((d) => ({ "@type": "Place", name: d.title })),
    provider: { "@type": "TravelAgency", name: site.name, url: site.url },
  };
}

