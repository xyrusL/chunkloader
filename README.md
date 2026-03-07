# ⛏️ ChunkLoader — Minecraft Seed Map Generator

Generate and explore Minecraft biome maps from any seed, right in your browser.

![ChunkLoader Screenshot](https://raw.githubusercontent.com/your-username/chunkloader/main/docs/screenshot.png)

## Features

- 🌱 **Seed-based map generation** — Enter any seed (number or text) to generate a biome map
- ☕ **Java & Bedrock** — Toggle between Java and Bedrock editions
- 📋 **Version support** — Java 1.12–1.21, Bedrock 1.18–1.21
- 🗺️ **Interactive map** — Pan (drag) and zoom (scroll) to explore
- 🎨 **50+ biomes** — Accurate Minecraft biome colors (Plains, Ocean, Desert, Jungle, Taiga, and many more)
- 📍 **Biome info on hover** — Shows biome name and world coordinates (x, z)
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

## Roadmap

- [ ] Map Settings panel
- [ ] Seed Finder
- [ ] Markers / Points of Interest
- [ ] Biome list panel
- [ ] Structure generation (Villages, Temples, etc.)
- [ ] cubiomes WASM integration for exact seed accuracy
- [ ] Nether and End dimension support

## License

This project is licensed under the **GNU General Public License v3.0** — see the [LICENSE](LICENSE) file for details.

---

*Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.*
