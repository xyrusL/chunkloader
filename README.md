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

The engine starts by hashing the input seed into a deterministic 32-bit number in [`src/lib/noise.ts`](./src/lib/noise.ts). That value becomes the base for several separate noise generators in [`src/lib/biome-generator.ts`](./src/lib/biome-generator.ts), each one responsible for a different climate signal such as temperature, humidity, continentalness, erosion, weirdness, ridges, terrain shape, and fine detail. Because each field uses its own seeded offset, the same seed always produces the same map, but each layer still behaves differently.

For any world coordinate `(x, z)`, the generator samples those fields with multi-octave fractal noise. In simple terms, it combines several larger and smaller waves into one value:

`value(x, z) = Σ noise(x * frequency_i, z * frequency_i) * amplitude_i / Σ amplitude_i`

That produces a climate tuple that roughly looks like `climate(x, z) = { temp, humid, cont, erosion, weird }`. The biome classifier then turns that tuple into a biome by applying threshold rules. Very negative continentalness pushes the result toward ocean biomes, high continentalness with low erosion pushes it toward peaks and mountains, very low temperature pushes it toward snowy biomes, and hot dry ranges push it toward desert, savanna, or badlands. It is still rule-based, but the input to those rules comes from smooth noise fields, which is why transitions look more natural than a random biome picker.

Height is estimated separately from the biome label. Instead of reading Minecraft chunk files, the engine blends continentalness, broad terrain noise, ridge noise, detail noise, and erosion masks into a normalized `0..1` terrain value. From that sampled height field, it derives slope and light using neighboring values, which lets the renderer draw terrain shading and contour-like structure without trying to fully simulate vanilla chunk generation.

To keep panning fast, generated biome and terrain data is cached in `32x32` terrain tiles inside the biome generator, and the renderer groups visible output into `64x64` render tiles. That means the app only has to compute and paint the current view plus a small overscan area instead of rebuilding the whole map every frame. Structure markers and slime chunks are also deterministic overlays from [`src/lib/map-overlays.ts`](./src/lib/map-overlays.ts), so they are calculated from the seed and viewport rather than loaded from saved world data.

### How The Math Fits Together

At a high level, the Overworld pipeline is:

`(x, z) -> climate noise -> biome rules -> height estimate -> slope/light -> final map color`

The slope step is based on neighboring height differences, roughly:

`slope ~= sqrt(dx^2 + dz^2)`

That is the main reason the map feels structured and terrain-aware even though it is not streaming real game chunks. The result is a deterministic preview that stays close to Minecraft-style worldgen logic while remaining fast enough to update only the visible part of the map during pan and zoom.

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

ChunkLoader is built for fast exploration and visual scouting. It uses a deterministic seed-based algorithm, so the same seed, edition, and dimension will always produce the same preview inside the app. In practice, that makes it useful for reading biome layout, spotting broad terrain patterns, checking coordinate context, and quickly scouting likely areas before opening the world in Minecraft.

What it does not try to do is perfectly reproduce every part of vanilla world generation or every datapack rule. The biome map, terrain shading, structure markers, and slime chunk helpers are all generated from the app's own deterministic model, not from live chunk data. That means the large-scale layout and exploration flow should feel consistent and useful, but exact terrain shape, structure placement edge cases, and version-specific generation quirks may differ from the real game.

The practical expectation for normal use is: treat ChunkLoader as a fast planning and scouting tool, not as a final source of truth for every block. It is reliable for previewing the world at a high level, comparing regions, and sharing a map view with someone else, but you should still verify anything critical in-game if you need exact one-to-one accuracy.

## Self-Hosting

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## License

This project is licensed under the **GNU General Public License v3.0**. See [LICENSE](./LICENSE).

Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
