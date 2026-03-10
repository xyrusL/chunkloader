<p align="center">
  <img src="./docs/chunkloader-readme-banner.svg" alt="ChunkLoader banner" width="100%" />
</p>

<h1 align="center">ChunkLoader</h1>

<p align="center">
  Browser-based Minecraft seed map explorer for Java and Bedrock.
  <br />
  Open a seed, inspect biomes, preview structures, and share the same map state with one link.
</p>

<p align="center">
  <a href="https://chunkloader.deze.me">Live site</a>
  ·
  <a href="#what-it-does">What it does</a>
  ·
  <a href="#how-to-use">How to use</a>
</p>

## What It Does

ChunkLoader turns a Minecraft seed into an interactive browser map. It is built for quick scouting: open a seed, switch edition and dimension, move around the map, and inspect biome context without installing a desktop viewer.

- 🗺️ Generate interactive biome maps from Minecraft seeds
- 🎮 Switch between Java and Bedrock behavior presets
- 🌍 Explore Overworld, Nether, and End views
- 🌿 Highlight selected biomes directly on the map
- 📍 Show spawn, slime chunks, and structure markers
- #️⃣ Read coordinates while moving through the map
- 🔗 Share the exact map state through the URL

## Main Features

### For Players

- ⚡ Fast pan-and-zoom map workspace
- 🌿 Biome overlays with selectable highlight filters
- 🏔️ Terrain-style shading for easier visual reading
- 📌 Marker tools for structures, spawn, and slime chunks
- 📱 Mobile-friendly layout without hiding core map tools
- 🎲 Fast seed scouting directly in the browser

### Quick Highlights

- Java and Bedrock version-aware controls
- Overworld, Nether, and End support
- Shareable URLs that preserve the current view
- Landing page and social preview assets for sharing

## How To Use

1. Open [chunkloader.deze.me](https://chunkloader.deze.me).
2. Click `Start Exploring`.
3. Enter a seed or generate a random one. 🎲
4. Pick the edition, version, and dimension. 🎮
5. Move around the map and adjust overlays, markers, and biome filters. 🗺️
6. Copy the URL if you want someone else to see the same view. 🔗

## Behind The Map Engine

If you only want the short version: ChunkLoader does not stream real Minecraft chunks from the game. It builds a deterministic map preview in TypeScript from the seed, then renders that result in the browser.

### Short Explanation

- The seed is hashed into a deterministic 32-bit value in [`src/lib/noise.ts`](./src/lib/noise.ts).
- The biome engine samples several seeded noise fields for temperature, humidity, continentalness, erosion, and weirdness in [`src/lib/biome-generator.ts`](./src/lib/biome-generator.ts).
- Those climate values are classified into a biome palette, then cached in 32x32 terrain tiles so panning stays fast.
- Terrain shading is estimated from generated height, slope, and light values. It is meant to improve readability, not to fully simulate Minecraft chunk generation.
- Structure markers and slime chunk helpers are lightweight deterministic overlays in [`src/lib/map-overlays.ts`](./src/lib/map-overlays.ts).

### Example

```ts
import { BiomeGenerator } from "./src/lib/biome-generator";

const generator = new BiomeGenerator("8675309", "java", "overworld");

const biome = generator.getBiomeAt(128, -64);
const terrain = generator.getTerrainSampleFromTile(128, -64, 4);

console.log(biome, terrain);
```

### References

- Noise and seed hashing: [`src/lib/noise.ts`](./src/lib/noise.ts)
- Biome classification and tile cache: [`src/lib/biome-generator.ts`](./src/lib/biome-generator.ts)
- Marker and slime chunk overlays: [`src/lib/map-overlays.ts`](./src/lib/map-overlays.ts)
- Biome palette and labels: [`src/lib/biome-colors.ts`](./src/lib/biome-colors.ts)

## About Accuracy

ChunkLoader is built for fast exploration and visual scouting. It follows a deterministic seed-based model, but it does not aim to be a full one-to-one reimplementation of every Minecraft worldgen rule or every datapack variant.

## Self-Hosting

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](./LICENSE).

Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
