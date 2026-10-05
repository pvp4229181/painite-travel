export const experiences = [
  {
    slug: "culture",
    name: "Culture & Heritage",
    line: "Living history, beyond the guidebooks.",
    scene: "desert",
    body: "Private access to forts, monasteries and old cities, with historians, architects and the families who still live inside the stories. We open doors that usually stay closed, and leave time for you to linger.",
    moments: [
      "Sunrise at the Taj Mahal with a conservation architect",
      "A monastery puja in Bhutan's Bumthang valley",
      "The medieval squares of Bhaktapur with a Newari craftsman",
    ],
  },
  {
    slug: "wildlife",
    name: "Wildlife & Safaris",
    line: "Extraordinary encounters, responsibly.",
    scene: "wildlife",
    body: "Tiger in the sal forests of central India, rhino in Chitwan, leopard in Yala and manta rays in Baa Atoll. Small lodges, expert naturalists and a quiet respect for the animals and the communities who live alongside them.",
    moments: ["Tiger tracking in Madhya Pradesh", "River safaris in Chitwan", "Leopards of Yala with a private naturalist"],
  },
  {
    slug: "wellness",
    name: "Wellness & Ayurveda",
    line: "Time, space and a slower rhythm.",
    scene: "tea",
    sun: { x: 82, y: 32, r: 5, color: "#f6e8b6" },
    body: "Ayurveda in Kerala and Sri Lanka, meditation with monks in the Himalaya, hot-stone baths in Bhutan and island spas over the water. Rest that is built into the journey, not squeezed in around it.",
    moments: [
      "A week of Ayurveda guided by a physician",
      "Meditation retreats in the Kathmandu Valley",
      "Hot-stone baths in a Bhutanese farmhouse",
    ],
  },
  {
    slug: "gastronomy",
    name: "Food & Wine",
    line: "Flavours, people and places.",
    scene: "gastronomy",
    body: "Cook with families in Rajasthan, walk Old Delhi's lanes with a food writer, learn the art of momos in Kathmandu and taste curries in a Galle kitchen garden. Food is how we meet people.",
    moments: ["Old Delhi food walks at dusk", "A Rajasthani royal kitchen", "Spice gardens of Kerala"],
  },
  {
    slug: "romantic",
    name: "Romantic Journeys",
    line: "Journeys for two, and what comes next.",
    scene: "night",
    body: "Honeymoons, anniversaries and proposals, planned discreetly. Palace suites in Udaipur, private dinners on a sandbank, a candlelit courtyard in Kathmandu. We take care of the details so you can take care of each other.",
    moments: ["A private boat on Lake Pichola", "Dinner on a Maldivian sandbank", "A Himalayan sunrise, just for two"],
  },
  {
    slug: "adventure",
    name: "Adventure",
    line: "Explore further, at your own pace.",
    scene: "himalaya",
    body: "Himalayan trails, guided walks and outdoor experiences designed around your interests and ability. Private guides and considered logistics leave you free to enjoy the landscape.",
    moments: ["Guided walks in Nepal's mountain foothills", "Valley hikes in Bhutan", "Exploring Sri Lanka's hill country"],
  },
  {
    slug: "island-time",
    name: "Island time",
    line: "Turquoise waters and barefoot luxury.",
    scene: "lagoon",
    body: "The Maldives and Sri Lanka's quiet south coast. We know each island individually, so the one we suggest suits how you like to rest.",
    moments: ["Snorkelling with manta rays in Baa Atoll", "Whale-watching off Mirissa", "Villa stays on Sri Lanka's south coast"],
  },
];

export function getExperience(slug) {
  return experiences.find((e) => e.slug === slug);
}
