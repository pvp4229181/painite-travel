# Location-correct content images

Both reported issues are corrected through a shared location selector:

- Journey days use a named place in the day title, then the stay location, then the description. The journey’s country is the fallback when no specific place is named.
- Journal cards and article headers use the city or landmark in their title. “The Taj at first light” resolves to the Taj Mahal image, independently of its old generic heritage tag.

The selector is applied when reading public content from MongoDB or the bundled fallback data. Saved content does not need a database migration. Explicitly uploaded custom media is retained.

20 additional city and landmark images were created with the built-in ImageGen tool to cover missing locations. Installed files are in `public/images/themed-2k/cities/`; their registry is `src/data/city-images.json`. They are 2K exports with a 2048-pixel long edge, resized from the generated native files. Native dimensions and resizing are recorded per file in `results/`.

Prompts: `output/city-images/jobs.json`. Native images: `output/city-images/natives/`. Visual reviews: `review-1.png` and `review-2.png`.

`node scripts/check-content-images.mjs` checks 49 day entries across eight journeys, the Taj article, distinct Delhi/Agra/Jaipur/Udaipur sources, title-versus-stay priority, custom uploads, and all 20 city image files. `itinerary-audit.json` records every day’s image selection. `live-audit.json` verifies the published MongoDB-backed journeys against the checked locations.

The existing 39-image themed collection and hero videos remain available. The journal and itinerary corrections use both the new city images and existing accurate landmark or region images.
