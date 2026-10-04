export const site = {
  name: "Painite Travels",
  shortName: "Painite",
  legalName: "Painite Travels Private Limited",
  tagline: "Rare by nature. Bespoke by design.",
  description:
    "Private journeys across India, Nepal, Bhutan, Sri Lanka and the Maldives, each one shaped around you.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://painitetravels.com",
  email: "info@painitetravels.com",
  phone: "+91 97189 75554",
  phoneHref: "tel:+919718975554",
  address: "Agra, Uttar Pradesh, India",
  year: 2026,
};

export const mainNav = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Journeys", href: "/journeys" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Journal", href: "/journal" },
];

export const footerNav = {
  painite: [
    { label: "Our story", href: "/about" },
    { label: "Responsible travel", href: "/responsible-travel" },
    { label: "Journal", href: "/journal" },
    { label: "Questions, answered", href: "/faq" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms and conditions", href: "/terms" },
  ],
};
