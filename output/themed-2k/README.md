# Painite themed 2K collection

39 new travel images were created with the built-in ImageGen tool, using the website’s licensed photographs as visual references. The collection uses warm natural light, sandstone and ivory architecture, forest greens, calm water, restrained colors, and photographic textures. Compositions were recreated to suit the website’s theme rather than duplicate the source photographs.

Every final WebP has a **2048-pixel long edge**. These are resized 2K exports: all 39 native generations were smaller than the final output and were upscaled with the user’s approval. The actual native and export dimensions are recorded in `installed.json` and `asset-checks.json`. They should not be described as native 2K generations.

- Installed website images: `public/images/themed-2k/`
- Generated PNG originals: `output/themed-2k/natives/`
- Full prompt set and source references: `output/themed-2k/jobs.json`
- Per-image generation and export records: `output/themed-2k/results/`
- Final website metadata: `src/data/photography.json`
- Reference photo metadata backup: `output/themed-2k/reference-photography.json`
- Visual review: `review-1.png`, `review-2.png`, and `review-3.png`
- Credits and applicable reference licenses: `/photo-credits` and `public/images/themed-2k/CREDITS.md`

The website identifies these as AI-created images and credits the photographers who supplied the visual references. Existing source photographs remain available in `public/images/photos/`.

Hero videos and the travel film keep their existing source files and playback. `video-checks.json` compares SHA-256 hashes before and after the image replacement. The journey hero’s “Watch the film” button remains removed, as requested.

Validation: `node scripts/check-photos.mjs` verifies all 39 installed files, dimensions, reference credits, and accurate upscaling metadata. Lint, public route checks, and browser checks are recorded alongside this file.
