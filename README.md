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
- 🧭 Grid, contour, chunk-coordinate, and binary-coordinate map modes
- 📌 Marker tools for structures, spawn, and slime chunks
- 💾 Saved tab, dimension, marker, biome, and map display preferences
- 📱 Mobile-friendly layout without hiding core map tools
- 🎲 Fast seed scouting directly in the browser

### Quick Highlights

- Java and Bedrock version-aware controls
- Overworld, Nether, and End support
- Shareable URLs that preserve the current view
- Seed sidebar tools with random seed, copy seed, and numeric/hex seed readouts
- Landing page and social preview assets for sharing

## How To Use

1. Open [chunkloader.deze.me](https://chunkloader.deze.me).
2. Click `Start Exploring`.
3. Enter a seed or generate a random one. 🎲
4. Pick the edition, version, and dimension. 🎮
5. Move around the map and adjust overlays, markers, biome filters, and map display settings. 🗺️
6. Copy the URL if you want someone else to see the same view. 🔗

## Behind The Map Engine

If you only want the short version: ChunkLoader does not stream real Minecraft chunks from the game. It builds a deterministic map preview in TypeScript from the seed, then renders that result in the browser.

### Short Explanation

- The seed string is first hashed into a deterministic 32-bit integer in [`src/lib/noise.ts`](./src/lib/noise.ts).
- That base value is reused with offsets (`seed + 1000`, `seed + 2000`, and so on) to create separate noise fields for temperature, humidity, continentalness, erosion, weirdness, ridges, terrain, and detail in [`src/lib/biome-generator.ts`](./src/lib/biome-generator.ts).
- Each field is sampled with multi-octave Perlin-style fractal noise:

  `value(x, z) = Σ noise(x * frequency_i, z * frequency_i) * amplitude_i / Σ amplitude_i`

- The resulting climate vector at each world position is roughly:

  `climate(x, z) = { temp, humid, cont, erosion, weird }`

- The biome classifier then uses threshold rules on those values. A simplified way to read it is:

  `continentalness < -0.45 -> ocean family`

  `continentalness > 0.55 && erosion < -0.2 -> peaks / mountains`

  `temperature < -0.5 -> snowy biomes`

  `high temperature + low humidity -> desert / savanna / badlands`

- Height is not loaded from Minecraft chunks. It is estimated from a blend of continentalness, macro terrain noise, ridge noise, detail noise, and erosion masks, then normalized into a `0..1` range for visual shading.
- Slope and light are derived from neighboring height samples, so the app can draw contour-style shading and directional lighting without simulating full chunk generation.
- Generated results are cached in `32x32` terrain tiles in the biome generator, and the visible map renderer groups those further into `64x64` render tiles, so only the current view and a small overscan area need to be drawn while panning.
- Structure markers and slime chunk helpers are deterministic overlays from [`src/lib/map-overlays.ts`](./src/lib/map-overlays.ts), not scanned from saved world data.

### How The Math Fits Together

At a high level, the Overworld pipeline looks like this:

1. Convert `(x, z)` world coordinates into several low-frequency and high-frequency noise samples.
2. Use those samples as climate axes:
   `temperature`, `humidity`, `continentalness`, `erosion`, and `weirdness`.
3. Feed that climate tuple into rule-based biome selection.
4. Build an approximate terrain height from macro terrain, ridges, detail, and erosion.
5. Compute slope from neighboring height differences:
   `slope ~= sqrt(dx^2 + dz^2)`
6. Convert biome + height + slope + light into the final map color for that pixel.

This is why the map feels close to Minecraft worldgen patterns without needing to stream or decode actual chunk files. The engine is deterministic, seed-based, and fast enough to keep re-rendering only the visible area as the user pans or zooms.

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
