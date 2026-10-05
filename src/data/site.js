export const site = {
  name: "Painite Travels",
  shortName: "Painite",
  legalName: "Painite Travels Private Limited",
  tagline: "Rare by nature. Bespoke by design.",
  description:
    "Private journeys across India, Nepal, Bhutan, Sri Lanka and the Maldives, each one shaped around you.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://painitetravels.com",
  email: "info@painitetravels.com",
  altEmail: "painitetravels@hotmail.com",
  phone: "+91 97189 75554",
  phoneHref: "tel:+919718975554",
  address: "Agra, Uttar Pradesh, India",
  streetAddress: "Nai Abadi, Nagla Dheem, Post Dhandhupura, Tajganj, Kalal Kheria",
  postalCode: "282006",
  hours: "Monday to Friday, 9am to 6pm IST",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Nai+Abadi+Nagla+Dheem+Post+Dhandhupura+Tajganj+Agra+282006",
  year: 2026,
};

// Matches the menu of the previous painitetravels.com: four sections with dropdowns, then the journal.
export const mainNav = [
  {
    label: "Journeys",
    href: "/journeys",
    children: [
      { label: "India", href: "/destinations/india" },
      { label: "Nepal", href: "/destinations/nepal" },
      { label: "Bhutan", href: "/destinations/bhutan" },
      { label: "Sri Lanka", href: "/destinations/sri-lanka" },
      { label: "Maldives", href: "/destinations/maldives" },
      { label: "Multi-country journeys", href: "/journeys/multi-country" },
    ],
  },
  {
    label: "Experiences",
    href: "/experiences",
    children: [
      { label: "Culture & Heritage", href: "/experiences/culture" },
      { label: "Wildlife & Safaris", href: "/experiences/wildlife" },
      { label: "Wellness & Ayurveda", href: "/experiences/wellness" },
      { label: "Food & Wine", href: "/experiences/gastronomy" },
      { label: "Adventure", href: "/experiences/adventure" },
      { label: "Romantic Journeys", href: "/experiences/romantic" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Bespoke Itinerary Design", href: "/services/bespoke-travel" },
      { label: "Luxury Hotels & Resorts", href: "/services/luxury-hotels" },
      { label: "Private Guides", href: "/services/private-guides" },
      { label: "Airport Meet & Assist", href: "/services/airport-assistance" },
      { label: "Yoga & Retreats", href: "/services/yoga-retreats" },
    ],
  },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Our Story", href: "/our-story" },
      { label: "Our Expertise", href: "/our-expertise" },
      { label: "Responsible Travel", href: "/responsible-travel" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  { label: "Journal", href: "/journal" },
];

export const footerNav = {
  painite: [
    { label: "About Painite", href: "/about" },
    { label: "Our story", href: "/our-story" },
    { label: "Our expertise", href: "/our-expertise" },
    { label: "Our philosophy", href: "/heart-of-our-business" },
    { label: "Responsible travel", href: "/responsible-travel" },
    { label: "Journal", href: "/journal" },
    { label: "Questions, answered", href: "/faq" },
  ],
  legal: [
    { label: "Privacy policy", href: "/privacy" },
    { label: "Terms and conditions", href: "/terms" },
    { label: "Booking promise", href: "/our-booking-promise" },
  ],
  // Professional memberships shown in the footer, as published on the previous site.
  affiliations: [
    { short: "IATO", name: "Indian Association of Tour Operators" },
    { short: "MOT", name: "Ministry of Tourism, Govt. of India" },
    { short: "IITFC", name: "India Inbound Tourism & Travel Council" },
    { short: "IITG", name: "Indian Inbound Tourism Guild" },
  ],
};
