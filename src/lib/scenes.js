// Maps a "scene" key stored on content to an artwork file in /public/images/ai.
// Older keys (desert, lagoon, ...) are kept as aliases so existing content keeps working.
export const sceneImages = {
  hero: "hero",
  himalaya: "himalaya",
  heritage: "heritage",
  wellness: "wellness",
  wildlife: "wildlife",
  gastronomy: "gastronomy",
  island: "island",
  bhutan: "himalaya",
  desert: "heritage",
  golden: "heritage",
  lake: "heritage",
  tea: "wellness",
  mist: "wellness",
  ocean: "island",
  lagoon: "island",
  dusk: "island",
  night: "hero",
};

// The images an editor can choose from in the admin.
export const imageOptions = [
  { key: "hero", label: "Moonlit ridge" },
  { key: "himalaya", label: "Himalaya" },
  { key: "heritage", label: "Heritage sunset" },
  { key: "wellness", label: "Green hills" },
  { key: "wildlife", label: "Misty forest" },
  { key: "gastronomy", label: "Golden valley" },
  { key: "island", label: "Island lagoon" },
];

export function imageFor(scene) {
  return sceneImages[scene] || "hero";
}

export function imageSrc(scene) {
  return `/images/ai/${imageFor(scene)}.webp`;
}

export function normalizeScene(scene) {
  return sceneImages[scene] ? imageFor(scene) : "hero";
}
