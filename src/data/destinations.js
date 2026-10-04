export const destinations = [
  {
    slug: "india",
    name: "India",
    tagline: "Not one journey, but thousands of them.",
    heroLine: "The extraordinary, in all its contradictions.",
    homeLine: "The extraordinary, in all its contradictions.",
    scene: "desert",
    cardScene: "desert",
    homeScene: "hero",
    introTitle: "A land of timeless stories",
    introText:
      "From royal palaces and ancient temples to bustling markets, serene backwaters and extraordinary wildlife, India is a journey of contrasts and connections.",
    quote: "India is not one journey. It is thousands of them.",
    regions: [
      { name: "Rajasthan", line: "Royal heritage and vibrant culture", scene: "desert" },
      { name: "Kerala", line: "Backwaters and lush landscapes", scene: "tea", sun: false },
      { name: "Varanasi", line: "Spiritual heart of India", scene: "lake" },
      { name: "Madhya Pradesh", line: "Wildlife and ancient wonders", scene: "mist" },
    ],
    experiences: ["heritage", "wildlife", "gastronomy", "wellness"],
    journeys: ["golden-triangle", "rajasthan-in-depth", "kerala-slow-waters"],
    bestTime: "October to March",
  },
  {
    slug: "nepal",
    name: "Nepal",
    tagline: "The Himalaya, experienced privately.",
    heroLine: "The Himalaya, experienced privately.",
    homeLine: "The Himalaya, experienced privately.",
    scene: "himalaya",
    cardScene: "himalaya",
    introTitle: "Where the mountains keep time",
    introText:
      "Medieval squares in the Kathmandu Valley, prayer flags above Himalayan ridgelines and quiet lodges with the world's highest peaks at the window. Nepal rewards those who travel slowly.",
    quote: "Some places you visit. Nepal, you return to.",
    regions: [
      { name: "Kathmandu Valley", line: "Temples, courtyards and living craft", scene: "golden" },
      { name: "Pokhara", line: "Lakeside calm beneath the Annapurnas", scene: "lake" },
      { name: "Everest region", line: "Mountain flights and high valleys", scene: "himalaya" },
      { name: "Chitwan", line: "Rhino, tiger and jungle rivers", scene: "mist" },
    ],
    experiences: ["heritage", "wildlife", "wellness", "romance"],
    journeys: ["himalayan-kingdoms", "nepal-in-private"],
    bestTime: "March to May, October to November",
  },
  {
    slug: "bhutan",
    name: "Bhutan",
    tagline: "A quieter way to travel.",
    heroLine: "A quieter way to travel.",
    homeLine: "A quieter way to travel.",
    scene: "bhutan",
    cardScene: "bhutan",
    introTitle: "The last Himalayan kingdom",
    introText:
      "Fortress monasteries above glacial rivers, forests strung with prayer flags and a country that measures its success in happiness. Bhutan asks you to slow down, and makes it easy.",
    quote: "Nothing here is hurried, least of all you.",
    regions: [
      { name: "Paro", line: "Valleys, dzongs and the Tiger's Nest", scene: "bhutan" },
      { name: "Thimphu", line: "A capital without traffic lights", scene: "golden" },
      { name: "Punakha", line: "Rice terraces and river confluences", scene: "tea", sun: false },
      { name: "Bumthang", line: "The spiritual heartland", scene: "mist" },
    ],
    experiences: ["heritage", "wellness", "gastronomy", "romance"],
    journeys: ["himalayan-kingdoms", "bhutan-quiet-kingdom"],
    bestTime: "March to May, September to November",
  },
  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    tagline: "An island of remarkable contrasts.",
    heroLine: "An island of remarkable contrasts.",
    homeLine: "An island of remarkable contrasts.",
    scene: "tea",
    cardScene: "tea",
    introTitle: "So much, so close together",
    introText:
      "Ancient rock citadels, misted tea country, leopards in the dry-zone forests and a southern coast of colonial forts and quiet bays, all within a few hours of each other.",
    quote: "An island small enough to cross, deep enough to never finish.",
    regions: [
      { name: "Cultural Triangle", line: "Rock fortresses and sacred cities", scene: "golden" },
      { name: "Hill Country", line: "Tea estates in the clouds", scene: "tea" },
      { name: "Yala", line: "Leopards and wild coastline", scene: "mist" },
      { name: "Galle", line: "Forts, villas and the southern sea", scene: "lagoon" },
    ],
    experiences: ["wildlife", "wellness", "heritage", "island-time"],
    journeys: ["sri-lanka-revealed"],
    bestTime: "December to April (west and south), May to September (east)",
  },
  {
    slug: "maldives",
    name: "Maldives",
    tagline: "The Indian Ocean, privately.",
    heroLine: "The Indian Ocean, privately.",
    homeLine: "The Indian Ocean, privately.",
    scene: "ocean",
    cardScene: "ocean",
    introTitle: "Barefoot, and nowhere to be",
    introText:
      "Twelve hundred coral islands scattered across the equator. We match you to the right atoll and the right island for the way you like to rest, dive, celebrate or simply disappear.",
    quote: "The only schedule is the tide.",
    regions: [
      { name: "North Malé Atoll", line: "Easy to reach, effortless to love", scene: "lagoon" },
      { name: "Baa Atoll", line: "Manta season and UNESCO reefs", scene: "ocean" },
      { name: "Raa Atoll", line: "Remote islands, wide lagoons", scene: "dusk" },
      { name: "Southern atolls", line: "Whale sharks and true seclusion", scene: "lagoon", sun: false },
    ],
    experiences: ["island-time", "romance", "wellness", "gastronomy"],
    journeys: ["maldives-private-island"],
    bestTime: "November to April",
  },
];

export const destinationOrder = ["india", "nepal", "bhutan", "sri-lanka", "maldives"];

export function getDestination(slug) {
  return destinations.find((d) => d.slug === slug);
}
