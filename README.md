# ⛏️ ChunkLoader — Minecraft Seed Map Generator

Generate and explore Minecraft biome maps from any seed, right in your browser.

![ChunkLoader Screenshot](https://raw.githubusercontent.com/your-username/chunkloader/main/docs/screenshot.png)

## Features

- 🌱 **Seed-based map generation** — Enter any seed (number or text) to generate a biome map
- ☕ **Java & Bedrock** — Toggle between Java and Bedrock editions
- 📋 **Version support** — Java 1.12–1.21, Bedrock 1.18–1.21
- 🗺️ **Interactive map** — Pan (drag) and zoom (scroll) to explore
- ⚡ **Progressive renderer** — Cached biome tiles and chunked redraws keep navigation responsive
- 🎨 **50+ biomes** — Accurate Minecraft biome colors (Plains, Ocean, Desert, Jungle, Taiga, and many more)
- 📍 **Biome info on hover** — Shows biome name and world coordinates (x, z)
- 🧭 **Marker overlays** — Toggle spawn, slime chunks, and structure previews directly from the UI
- 🏷️ **Map labels and teleport copy** — Click spawn, structure, and biome labels to copy a ready-to-use `/tp` command
- 🧱 **Minecraft-style icons** — Structure pickers and map badges use pixel-inspired Minecraft art instead of generic outline icons
- 🎲 **Random seed** — One-click random seed generation
- 🌙 **Dark theme** — Easy on the eyes

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **Language**: TypeScript
- **Rendering**: HTML Canvas
- **Biome Generation**: Custom seeded Perlin noise engine (no external dependencies)
- **Deployment**: [Vercel](https://vercel.com/) ready

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/your-username/chunkloader.git
cd chunkloader

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deploy to Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/):

```bash
npx vercel
```

Or connect your GitHub repository directly in the Vercel dashboard — it works out of the box.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout + SEO
│   └── globals.css           # Dark theme styles
├── components/
│   ├── map-canvas.tsx        # Canvas biome map renderer
│   ├── seed-input-panel.tsx  # Seed, version, edition inputs
│   ├── top-bar.tsx           # Header bar
│   ├── map-info-bar.tsx      # Biome/coordinate hover info
│   └── bottom-tabs.tsx       # Navigation tabs
└── lib/
    ├── noise.ts              # Seeded Perlin noise engine
    ├── biome-generator.ts    # Multi-layer biome classifier
    ├── biome-colors.ts       # Biome color definitions
    └── minecraft-versions.ts # Version data
```

## How It Works

ChunkLoader uses a **seeded Perlin noise** approach to generate biome maps:

1. The seed is hashed into a deterministic number
2. Multiple noise layers are generated (temperature, humidity, continentalness, erosion)
3. Each point is classified into a Minecraft biome based on its noise values
4. Biomes are rendered on an HTML Canvas with their corresponding colors

> **Note**: This generates *procedural biome maps* that look like Minecraft maps but are not 1:1 identical to Minecraft's actual world generation. For exact seed accuracy, a WASM-compiled cubiomes library would be needed.

## Performance Notes

The renderer is optimized around a few low-cost primitives:

- **Sample tile caching** — biome samples are cached in reusable 32×32 tiles keyed by scale and world position
- **Progressive redraws** — large renders are split across animation frames instead of blocking the main thread
- **Interaction quality scaling** — drag/zoom uses a lighter sampling profile first, then refines after input settles
- **Compact palette writes** — the canvas path writes indexed biome colors into a small offscreen buffer and scales it up without smoothing

This keeps map regeneration smoother on lower-end devices and mobile browsers, where long main-thread tasks are the main source of visible lag.

## Overlay Notes

- Structure and spawn labels are rendered from deterministic preview data so the map stays interactive without a heavy backend dependency.
- Selected biome overlays brighten matching terrain and can surface biome labels directly on the map.
- Teleport popups copy commands in `/tp @s X ~ Z` format for fast in-game testing.

## Open-Source References

Useful repositories if you want to keep pushing this engine further:

- **cubiomes** — exact Java biome/structure generation in C, MIT licensed. Best candidate for a future WASM path when you want correctness and speed over the current approximation. [GitHub](https://github.com/Cubitect/cubiomes)
- **cubiomes-viewer** — mature GPL-3.0 Minecraft map viewer and seed finder. Good reference for viewport management, analysis tools, and feature scope. [GitHub](https://github.com/Cubitect/cubiomes-viewer)
- **Comlink** — Apache-2.0 helper for moving heavy generation into a Web Worker without hand-writing a lot of `postMessage` plumbing. [GitHub](https://github.com/GoogleChromeLabs/comlink)
- **FastNoise Lite** — MIT licensed high-performance noise library with a JavaScript port. Useful if you want to benchmark a faster noise backend than the current custom implementation. [GitHub](https://github.com/Auburn/FastNoiseLite)
- **MapLibre GL JS** — BSD-3-Clause map renderer with strong tiling and viewport ideas worth studying if this project grows into a larger world explorer. [GitHub](https://github.com/maplibre/maplibre-gl-js)

If you vendor code from any of these, keep the original license text and attribution with the imported files.

## Roadmap

- [x] Map Settings panel
- [x] Seed Finder
- [x] Markers / Points of Interest
- [x] Biome list panel
- [x] Structure generation previews and map labels
- [ ] Exact structure placement via cubiomes WASM
- [ ] Nether and End dimension support

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

*Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.*
