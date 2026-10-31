import fs from "node:fs/promises";

const jobs = [
  ["ai/hero", "Lake Pichola sunset", "Lake Pichola at sunset in Udaipur"],
  ["ai/himalaya", "Paro Taktsang", "Tiger’s Nest monastery in Bhutan"],
  ["ai/heritage", "Udaipur City Palace lake", "Udaipur’s lakeside palace architecture"],
  ["ai/wellness", "Kerala backwaters houseboat", "A houseboat on Kerala’s palm-lined backwaters"],
  ["ai/wildlife", "Bengal tiger forest", "Bengal tiger in its natural habitat"],
  ["ai/gastronomy", "Indian thali food", "Traditional Indian cuisine served as a thali"],
  ["ai/island", "Maldives water villas", "Overwater villas in the Maldives"],
  ["ai/customer-enquiry", "travel map notebook", "Travel planning with maps and notes"],
  ["ai/services-curator", "Rajasthan hotel courtyard", "An intimate Rajasthan heritage courtyard"],
  ["ai/services-hospitality", "Samode Haveli courtyard", "A heritage hotel courtyard in Rajasthan"],
  ["ai/service-airport-hero", "Mumbai airport terminal interior", "The interior of Mumbai’s international airport"],
  ["ai/service-guides-hero", "Jaipur palace courtyard", "Intricate palace architecture in Jaipur"],
  ["ai/service-yoga-hero", "Varkala sunset", "A peaceful sunset on Kerala’s coast"],
  ["destinations/india-photoreal-20261005", "Taj Mahal sunrise", "The Taj Mahal in Agra, India"],
  ["destinations/nepal-photoreal-20261005", "Annapurna panorama Nepal", "The Annapurna mountains in Nepal"],
  ["destinations/bhutan-photoreal-20261005", "Punakha Dzong Bhutan", "Punakha Dzong and its Himalayan surroundings"],
  ["destinations/sri-lanka-photoreal-20261005", "Sri Lanka tea plantation", "Sri Lanka’s green tea country"],
  ["destinations/maldives-photoreal-20261005", "Maldives atoll", "A coral island in the Maldives"],
  ["regions/rajasthan-20261005", "Amber Fort Jaipur", "Amber Fort in Rajasthan"],
  ["regions/kerala-20261005", "Alleppey houseboat", "A houseboat on Kerala’s backwaters"],
  ["regions/varanasi-20261005", "Varanasi ghats sunrise", "Varanasi’s riverside ghats"],
  ["regions/madhya-pradesh-20261005", "Kanha tiger", "A tiger in Kanha National Park"],
  ["regions/kathmandu-valley-20261005", "Kathmandu temple", "Traditional temples in the Kathmandu Valley"],
  ["regions/pokhara-20261005", "Phewa lake Annapurna", "Phewa Lake beneath the Annapurna mountains"],
  ["regions/everest-region-20261005", "Namche Bazaar mountains", "Namche Bazaar in Nepal’s Everest region"],
  ["regions/chitwan-20261005", "Chitwan rhinoceros", "A rhinoceros in Chitwan National Park"],
  ["regions/paro-20261005", "Paro Taktsang", "Tiger’s Nest monastery in Paro"],
  ["regions/thimphu-20261005", "Tashichho Dzong", "Tashichho Dzong in Thimphu"],
  ["regions/punakha-20261005", "Punakha Dzong river", "Punakha Dzong beside the river"],
  ["regions/bumthang-20261005", "Jakar Dzong Bumthang", "Jakar Dzong in Bumthang"],
  ["regions/cultural-triangle-20261005", "Sigiriya rock fortress", "Sigiriya rock fortress in Sri Lanka"],
  ["regions/hill-country-20261005", "Nuwara Eliya tea plantation", "Tea plantations in Sri Lanka’s hill country"],
  ["regions/yala-20261005", "Yala leopard", "A leopard in Yala National Park"],
  ["regions/galle-20261005", "Galle lighthouse fort", "Galle’s coastal fort and lighthouse"],
  ["regions/north-male-atoll-20261005", "North Male Atoll island", "An island in North Malé Atoll"],
  ["regions/baa-atoll-20261005", "Baa Atoll manta", "Marine life in Baa Atoll"],
  ["regions/raa-atoll-20261005", "Raa Atoll island", "An island in Raa Atoll"],
  ["regions/southern-atolls-20261005", "whale shark", "A whale shark swimming in open water"],
  ["travel-film-poster", "Maldives aerial lagoon", "A Maldivian island and its turquoise lagoon"],
];

const headers = { "User-Agent": "PainitePhotoCuration/1.0 (travel website; image attribution retained)" };
const clean = (s = "") => String(s).replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
const results = JSON.parse(await fs.readFile("output/photo-refresh/candidates.json", "utf8").catch(() => "[]"));
let next = 0;
await fs.mkdir("output/photo-refresh", { recursive: true });
await Promise.all(Array.from({ length: 1 }, async () => {
  while (next < jobs.length) {
    const [key, query, alt] = jobs[next++];
    const existing = results.findIndex(r => r.key === key);
    if (existing >= 0 && results[existing].candidates.length) continue;
    if (existing >= 0) results.splice(existing, 1);
    const params = new URLSearchParams({ action: "query", generator: "search", gsrsearch: `${query} filetype:bitmap`, gsrnamespace: "6", gsrlimit: "24", prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "480", format: "json" });
    try {
      await new Promise(resolve => setTimeout(resolve, 6500));
      let response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers });
      if (response.status === 429) {
        const seconds = Math.max(60, Number(response.headers.get("retry-after")) || 60);
        console.log(`Rate limit: waiting ${seconds}s before retrying ${key}`);
        await new Promise(resolve => setTimeout(resolve, seconds * 1000));
        response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers });
      }
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const candidates = Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index).flatMap((page) => {
        const i = page.imageinfo?.[0];
        if (!i) return [];
        const m = i.extmetadata ?? {};
        const license = clean(m.LicenseShortName?.value);
        if (!/^(CC BY(?:-SA)? [1-4]\.0|CC0|Public domain)$/i.test(license)) return [];
        if (i.width < 2000 || i.height < 1200 || i.size > 60_000_000 || !/\.(jpe?g|png)(\?|$)/i.test(i.url)) return [];
        if (/AI-generated|AI generated|synthetic media|generative AI|map of|locator map|drawing|painting|collage|stamp|poster|coat of arms/i.test(`${page.title} ${m.Categories?.value} ${m.ImageDescription?.value}`)) return [];
        return [{ title: page.title.replace(/^File:/, ""), width: i.width, height: i.height, bytes: i.size, download: i.url.split("?")[0], preview: i.thumburl, source: i.descriptionurl, author: clean(m.Artist?.value), credit: clean(m.Credit?.value), license, licenseUrl: m.LicenseUrl?.value || "https://creativecommons.org/publicdomain/mark/1.0/", description: clean(m.ImageDescription?.value), assessment: m.Assessments?.value || "" }];
      });
      results.push({ key, query, alt, candidates: candidates.slice(0, 8) });
      await fs.writeFile("output/photo-refresh/candidates.json", `${JSON.stringify(results, null, 2)}\n`);
      console.log(`${key}: ${candidates.length} licensed candidates`);
    } catch (error) { results.push({ key, query, alt, candidates: [], error: String(error) }); console.error(key, error.message); }
  }
}));
results.sort((a, b) => jobs.findIndex(([key]) => key === a.key) - jobs.findIndex(([key]) => key === b.key));
await fs.writeFile("output/photo-refresh/candidates.json", `${JSON.stringify(results, null, 2)}\n`);
console.log(`Finished: ${results.filter(r => r.candidates.length).length}/${jobs.length} subjects found.`);
