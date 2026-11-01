// Maps scene keys to the locally hosted, owner-supplied 2K travel artwork.
// Older keys (desert, lagoon, ...) are kept as aliases so existing content keeps working.
// A scene can also be the URL of an image uploaded through the admin, used as is.
import { isUploadedMedia } from "./media.js";
import { placeImages } from "./content-images.js";

export const sceneImages = {
  hero: "hero",
  himalaya: "himalaya",
  heritage: "heritage",
  wellness: "wellness",
  wildlife: "wildlife",
  gastronomy: "gastronomy",
  island: "island",
  india: "india",
  nepal: "nepal",
  bhutan: "bhutan",
  "sri-lanka": "sri-lanka",
  maldives: "maldives",
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
  { key: "hero", label: "Lake Pichola sunset" },
  { key: "himalaya", label: "Himalaya" },
  { key: "heritage", label: "Heritage sunset" },
  { key: "wellness", label: "Kerala backwaters" },
  { key: "wildlife", label: "Bengal tiger" },
  { key: "gastronomy", label: "Indian cuisine" },
  { key: "island", label: "Island lagoon" },
  { key: "india", label: "Taj Mahal" },
  { key: "nepal", label: "Nepal Himalayas" },
  { key: "bhutan", label: "Bhutan monastery" },
  { key: "sri-lanka", label: "Sri Lanka tea country" },
  { key: "maldives", label: "Maldives island" },
  ...Object.entries(placeImages).map(([key, image]) => ({ key, label: image.label })),
];

export function imageFor(scene) {
  if (isUploadedMedia(scene)) return scene;
  if (placeImages[scene]) return scene;
  return sceneImages[scene] || "hero";
}

export function imageSrc(scene) {
  if (isUploadedMedia(scene)) return scene;
  const key = imageFor(scene);
  if (placeImages[key]) return placeImages[key].src;
  if (["india", "nepal", "bhutan", "sri-lanka", "maldives"].includes(key)) {
    return `/images/cleaned/destinations/${key}.webp`;
  }
  return `/images/cleaned/scenes/${key}.webp`;
}

export function normalizeScene(scene) {
  if (isUploadedMedia(scene)) return scene;
  return sceneImages[scene] || placeImages[scene] ? imageFor(scene) : "hero";
}
