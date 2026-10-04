export const journal = [
  {
    slug: "best-time-to-visit-india", title: "Best Time to Visit India", category: "India", date: "2026-10-05", readTime: "3 min read", scene: "heritage",
    excerpt: "Choose the season around your route, from Rajasthan's cooler months to summer in the mountains.",
    body: ["India's landscapes call for different travel calendars. Start with the regions you want to explore, then choose dates that suit your pace and the experiences you value.", "For a route through Delhi, Agra and Rajasthan, cooler months make long days outdoors more comfortable. Mountain journeys require a separate approach, with altitude and access shaping the itinerary.", "Tell your curator which places matter most to you. We will help balance seasonal conditions, hotel availability and time on the road before confirming your plans."]
  },
  {
    slug: "best-time-to-visit-rajasthan", title: "Best Time to Visit Rajasthan", category: "India", date: "2026-10-05", readTime: "3 min read", scene: "desert",
    excerpt: "Plan palace stays, desert evenings and walks through the old cities around the cooler season.",
    body: ["Rajasthan is best approached with enough time to enjoy its cities and the distances between them. Cooler weather makes fort visits, market walks and time in the desert more comfortable.", "Build your days around early starts and quiet breaks. Jaipur, Jodhpur and Udaipur each deserve time beyond their headline sights, while a heritage stay can be a reason to slow the itinerary further.", "Popular palace hotels and special celebrations can shape availability. Share your preferred dates early so the route can be built around the stays that suit you."]
  },
  {
    slug: "best-luxury-hotels-in-rajasthan", title: "Best Luxury Hotels in Rajasthan", category: "India", date: "2026-10-05", readTime: "3 min read", scene: "lake",
    excerpt: "Palace, restored haveli or intimate boutique: choosing a stay that suits your journey.",
    body: ["The best hotel for your journey depends on what you want from the stay. A grand palace offers a different experience from a small restored haveli or a contemporary retreat.", "Consider location alongside atmosphere. Staying near an old city makes guided walks easier; a rural property offers quieter evenings but requires more time for transfers.", "We select accommodation as part of the whole itinerary, considering your interests, room preferences, family needs and the time you have to enjoy each property. Ask your curator for a shortlist tailored to your route."]
  },
  {
    slug: "the-taj-at-first-light",
    title: "The Taj at first light",
    category: "Heritage",
    date: "2026-08-14",
    readTime: "5 min read",
    scene: "desert",
    excerpt: "Agra is our home. Here is why we always suggest seeing the Taj Mahal twice, and from which side of the river.",
    body: [
      "We are based in Agra, so we have seen the Taj Mahal in every season and at every hour. Our advice is always the same: see it twice.",
      "First, at sunrise. The gates open before the sun comes up, and if you are early the marble is pale grey and the gardens are almost empty. As the light comes, the dome turns faintly pink, then gold, then white.",
      "Second, at sunset, from the other side of the Yamuna. Mehtab Bagh is a Mughal garden aligned with the Taj. There are no crowds, only the river and the monument changing colour across the water.",
      "Between the two, we suggest lunch in a family home in the old city, where Mughlai cooking has been passed down for generations.",
    ],
  },
  {
    slug: "why-bhutan-asks-you-to-slow-down",
    title: "Why Bhutan asks you to slow down",
    category: "Bhutan",
    date: "2026-07-02",
    readTime: "6 min read",
    scene: "bhutan",
    excerpt: "A country that limits visitor numbers on purpose, and what that means for the way you travel there.",
    body: [
      "Bhutan has chosen a different model of tourism. A sustainable development fee keeps numbers low, and visitors travel with a licensed guide.",
      "The result is a country where the dzongs still feel like working monasteries, where walking trails are quiet and where your guide becomes, by the end, a friend.",
      "We build Bhutan itineraries with fewer stops and more time: a full day in each valley, walks that end in farmhouse kitchens, and space for the unplanned conversations that are the real reason to come.",
    ],
  },
  {
    slug: "choosing-the-right-maldives-island",
    title: "Choosing the right Maldivian island",
    category: "Maldives",
    date: "2026-05-20",
    readTime: "4 min read",
    scene: "lagoon",
    excerpt: "There are over a thousand islands. Here is how we narrow it down to the one that is right for you.",
    body: [
      "The question we ask first is not which island, but how you like to rest. Some travellers want a reef they can swim to from the villa. Others want a kids' club, a long lagoon, or a transfer short enough to arrive before lunch.",
      "Atolls matter too. Baa is known for manta rays in the southwest monsoon months. The southern atolls are remote and wild. North Malé is close enough to the airport for a speedboat transfer.",
      "Once we know you, the choice usually becomes obvious.",
    ],
  },
  {
    slug: "leopards-of-yala",
    title: "Waiting for leopards in Yala",
    category: "Wildlife",
    date: "2026-03-11",
    readTime: "5 min read",
    scene: "mist",
    excerpt: "Patience, a good naturalist and the right block of the park. Notes from the dry zone of southern Sri Lanka.",
    body: [
      "Yala is known for its leopards, but the busiest blocks can feel crowded at a sighting. We prefer the quieter zones, longer drives and a naturalist who knows when to wait.",
      "The best hours are early morning and late afternoon. In between, there is the coast, a long lunch and the sound of the sea.",
    ],
  },
];

export function getArticle(slug) {
  return journal.find((a) => a.slug === slug);
}

export function formatDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
