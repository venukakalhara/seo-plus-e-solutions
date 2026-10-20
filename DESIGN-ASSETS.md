# Reference design update

The homepage uses live text, bilingual controls, links, count-up statistics and a three-scene introduction dialog over raster artwork. The reference screenshot itself is not used as the page. The store, admin, enquiries and separate routes remain connected.

Generated using the built-in imagegen tool, copied into the project:

- `public/hero-reference-v2.png`
- `public/services-office-v2.png`

Implementation: `src/components/reference-home.tsx` and `src/app/reference-design.css`.

Poppins fonts are bundled locally in `public/fonts/` with their OFL license, sourced from Google Fonts. No external font request is required at runtime.

## Hero prompt

Edit the supplied SEO PLUS website reference into a clean reusable website HERO BACKGROUND ASSET. Preserve the original photorealistic globe, glowing golden continental lights and orbital trails, large angled laptop with EXACT SEO PLUS logo on its screen, dark rocky terrain and gold illumination. Match their placement and appearance as closely as possible. Output a wide 1536x660 scene corresponding to the header+hero area only. Remove ALL website UI: remove header logo/navigation, headings, paragraphs, buttons, counters, floating service label cards and their icons. Remove the entire lower services section. Seamlessly inpaint removed UI into dark almost-black navy background. Keep left 45 percent mostly empty near-black for live HTML text. Keep globe/laptop artwork in the right half, laptop base near bottom, subtle rugged rocky terrain along bottom edge. No text anywhere except original SEO PLUS branding on laptop screen. This is an image asset for a functioning website, NOT a website screenshot. Crisp premium cinematic realistic 3D, gold highlights, match reference composition tightly.

## Service-card prompt

Create a photorealistic ultra-wide cinematic website service-card background image, 1536x512. A premium modern digital agency office at night, four softly connected areas from left to right: multiple monitors showing abstract website layouts, a marketing strategist woman working at a desk, a sophisticated dark workstation with automation dashboards, a large search analytics monitor. No readable text, no typography, no UI overlay cards or icons. Very dark black/navy palette with cool blue window reflections, subtle warm gold accent lights, professional realistic photography, moody but crisp details. Upper half contains visible screens and office silhouettes; bottom half falls into near black shadow for live HTML text overlay. No borders, no watermark. Restrained low contrast background artwork matching black-and-gold futuristic corporate website.
