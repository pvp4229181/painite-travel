import cities from "../data/city-images.json" with { type: "json" };
import { isUploadedMedia } from "./media.js";

const region = (key, label) => ({ src: `/images/themed-2k/regions/${key}.webp`, label });
export const placeImages = {
  "taj-mahal": { src: "/images/themed-2k/destinations/india.webp", label: "Taj Mahal, Agra" },
  udaipur: { src: "/images/themed-2k/scenes/heritage.webp", label: "Udaipur" },
  rajasthan: region("rajasthan", "Rajasthan"),
  kerala: region("kerala", "Kerala backwaters"),
  varanasi: region("varanasi", "Varanasi"),
  patan: region("kathmandu-valley", "Patan"),
  pokhara: region("pokhara", "Pokhara"),
  everest: region("everest-region", "Everest region"),
  chitwan: region("chitwan", "Chitwan"),
  "tigers-nest": region("paro", "Tiger’s Nest monastery"),
  thimphu: region("thimphu", "Thimphu"),
  punakha: region("punakha", "Punakha"),
  bumthang: region("bumthang", "Bumthang"),
  sigiriya: region("cultural-triangle", "Sigiriya and the Cultural Triangle"),
  "tea-country": region("hill-country", "Sri Lanka tea country"),
  yala: region("yala", "Yala"),
  galle: region("galle", "Galle"),
  "baa-atoll": region("baa-atoll", "Baa Atoll"),
  "raa-atoll": region("raa-atoll", "Raa Atoll"),
  ...cities,
};

const places = [
  [/\b(?:taj(?: mahal)?|mehtab bagh|golden triangle)\b/i, "taj-mahal"],
  [/\bold(?: and new)? delhi\b|\bchandni chowk\b|\bjama masjid\b/i, "old-delhi"],
  [/\b(?:new )?delhi\b/i, "delhi"],
  [/\bagra\b/i, "agra"],
  [/\b(?:fatehpur sikri|panch mahal)\b/i, "fatehpur-sikri"],
  [/\b(?:jaipur|amber fort|hawa mahal|pink city)\b/i, "jaipur"],
  [/\b(?:shekhawati|mandawa)\b/i, "shekhawati"],
  [/\b(?:thar(?: desert)?|jaisalmer|sam dunes)\b/i, "thar-desert"],
  [/\b(?:jodhpur|mehrangarh|blue city)\b/i, "jodhpur"],
  [/\b(?:udaipur|lake pichola)\b/i, "udaipur"],
  [/\brajasthan\b/i, "rajasthan"],
  [/\b(?:fort kochi|kochi|cochin)\b/i, "kochi"],
  [/\bmunnar\b/i, "munnar"],
  [/\bkovalam\b/i, "kovalam"],
  [/\b(?:thiruvananthapuram|trivandrum)\b/i, "thiruvananthapuram"],
  [/\b(?:kerala|backwaters)\b/i, "kerala"],
  [/\bvaranasi\b/i, "varanasi"],
  [/\b(?:kathmandu|katmandu|boudhanath)\b/i, "kathmandu"],
  [/\bbhaktapur\b/i, "bhaktapur"],
  [/\bpatan\b/i, "patan"],
  [/\bdhulikhel\b/i, "dhulikhel"],
  [/\b(?:pokhara|phewa|annapurnas?|machhapuchhre|sarangkot)\b/i, "pokhara"],
  [/\b(?:everest|namche)\b/i, "everest"],
  [/\bchitwan\b/i, "chitwan"],
  [/\btiger['’]?s nest\b|\btaktsang\b/i, "tigers-nest"],
  [/\b(?:paro|rinpung)\b/i, "paro"],
  [/\bthimphu\b/i, "thimphu"],
  [/\bpunakha\b/i, "punakha"],
  [/\b(?:gangtey|gangteng|phobjikha)\b/i, "gangtey"],
  [/\b(?:bumthang|jakar)\b/i, "bumthang"],
  [/\b(?:sigiriya|cultural triangle|dambulla|polonnaruwa)\b/i, "sigiriya"],
  [/\bkandy\b/i, "kandy"],
  [/\b(?:tea country|nuwara eliya)\b/i, "tea-country"],
  [/\byala\b/i, "yala"],
  [/\bgalle\b/i, "galle"],
  [/\bcolombo\b/i, "colombo"],
  [/\bmale\b/i, "male"],
  [/\bbaa(?: atoll)?\b/i, "baa-atoll"],
  [/\braa(?: atoll)?\b/i, "raa-atoll"],
];

const text = value => String(value || "").normalize("NFD").replace(/\p{Diacritic}/gu, "");

export function namedPlaceScene(value) {
  const input = text(value);
  let selected, first = Infinity;
  for (const [pattern, scene] of places) {
    const match = pattern.exec(input);
    if (match && match.index < first && placeImages[scene]) {
      selected = scene;
      first = match.index;
    }
  }
  return selected;
}

function countryScene(value) {
  const match = text(value).match(/\b(india|nepal|bhutan|sri[ -]lanka|maldives|himalay\w*)\b/i);
  if (!match) return;
  return /^himalay/i.test(match[0]) ? "nepal" : match[0].toLowerCase().replace(" ", "-");
}

export function contentScene(item) {
  if (isUploadedMedia(item.scene)) return item.scene;
  const title = item.title || item.name || "";
  const safariInSriLanka = /safari|leopard/i.test(title) && /sri lanka/i.test(`${title} ${item.category}`);
  return namedPlaceScene(title) || (safariInSriLanka ? "yala" : undefined) || countryScene(title) || namedPlaceScene(item.excerpt) || item.scene;
}

export function itineraryScene(day, journey) {
  if (isUploadedMedia(day.scene)) return day.scene;
  return namedPlaceScene(day.title) || namedPlaceScene(day.stay) || namedPlaceScene(day.text)
    || countryScene(day.title) || countryScene(`${journey.title} ${(journey.destinations || []).join(" ")}`)
    || day.scene;
}

export function withJourneyImages(journey) {
  return { ...journey, scene: contentScene(journey), itinerary: (journey.itinerary || []).map(day => ({ ...day, scene: itineraryScene(day, journey) })) };
}
