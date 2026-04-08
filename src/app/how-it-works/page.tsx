import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  CompassRoseIcon,
  GlobeIcon,
  InfoIcon,
  LayersIcon,
  LeafIcon,
  MapIcon,
  MountainIcon,
  PinIcon,
  SearchIcon,
  SeedIcon,
  WarningIcon,
} from "@/components/ui/icons";
import { createPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = createPageMetadata({
  title: "How ChunkLoader Works",
  description:
    "A friendly guide to how ChunkLoader builds Minecraft seed maps. Learn how seeds become biomes, how terrain is estimated, and what accuracy to expect.",
  canonicalPath: "/how-it-works",
  imagePath: "/opengraph-image",
  imageAlt: "ChunkLoader guide page explaining how the Minecraft seed map engine works.",
});

export default function HowItWorksPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--theme-bg-app)] text-[var(--theme-text-primary)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_14%,rgba(52,211,153,0.14),transparent_18%),radial-gradient(circle_at_84%_10%,rgba(56,189,248,0.10),transparent_22%),radial-gradient(circle_at_50%_74%,rgba(249,115,22,0.08),transparent_20%),linear-gradient(180deg,rgba(5,10,18,0.92),rgba(5,10,18,0.98))]" />
      <div className="pointer-events-none absolute left-[-7rem] top-[9rem] h-[20rem] w-[20rem] rounded-full bg-emerald-400/8 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8rem] top-[20rem] h-[24rem] w-[24rem] rounded-full bg-sky-500/8 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[112rem] px-4 py-6 sm:px-6 lg:px-10 xl:px-12">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--theme-accent)] shadow-[var(--theme-shadow-accent)]">
              <CompassRoseIcon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.35em] text-[var(--theme-accent)]">ChunkLoader</p>
              <p className="text-sm text-[var(--theme-text-muted)]">How the map engine works</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/20 hover:bg-white/[0.08]"
            >
              Back Home
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-5 py-2.5 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
            >
              Open Seed Map
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="pb-10 pt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-center">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-none border-2 border-[var(--theme-accent)] bg-[var(--theme-accent-soft)] px-4 py-2 text-[0.72rem] font-bold uppercase tracking-[0.28em] text-[var(--theme-accent)] mc-badge">
                <InfoIcon className="h-4 w-4" />
                Friendly Guide
              </div>
              <h1 className="mt-5 max-w-5xl text-[2.6rem] font-semibold leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-[5.6rem]">
                How ChunkLoader turns a seed into a{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  readable map.
                </span>
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--theme-text-secondary)] sm:text-lg">
                This page walks you through everything — from the moment you type a seed to the final map
                you see on screen. No programming knowledge needed. Every section explains one idea in plain
                language, with a quick visual summary so you can follow along at your own pace.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <AnchorChip href="#the-journey">The full journey</AnchorChip>
                <AnchorChip href="#biome-picking">How biomes are picked</AnchorChip>
                <AnchorChip href="#terrain-shading">Terrain shading</AnchorChip>
                <AnchorChip href="#accuracy">Accuracy and limits</AnchorChip>
              </div>
            </div>

            {/* Quick glossary sidebar */}
            <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,24,44,0.88),rgba(10,16,32,0.76))] p-5 shadow-[0_26px_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
              <div className="rounded-[1.5rem] border border-white/8 bg-[#0b1322]/90 p-5">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Quick Glossary</p>
                <p className="mt-3 text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  Not sure about a word? Here are the key terms you will see on this page.
                </p>
                <div className="mt-4 space-y-3">
                  <GlossaryPill
                    icon={<SeedIcon className="h-4 w-4" />}
                    label="Seed"
                    body="A number or text you type in. It is the starting point that decides how the entire world looks."
                    tone="emerald"
                  />
                  <GlossaryPill
                    icon={<GlobeIcon className="h-4 w-4" />}
                    label="Noise"
                    body="A math pattern that creates smooth, natural-looking randomness — like rolling hills instead of random spikes."
                    tone="sky"
                  />
                  <GlossaryPill
                    icon={<LeafIcon className="h-4 w-4" />}
                    label="Biome"
                    body="A region type like Forest, Desert, or Ocean. The world is made up of many biomes side by side."
                    tone="teal"
                  />
                  <GlossaryPill
                    icon={<MapIcon className="h-4 w-4" />}
                    label="Tile"
                    body="A small square piece of the map. The app draws the map one tile at a time so it stays fast."
                    tone="violet"
                  />
                  <GlossaryPill
                    icon={<PinIcon className="h-4 w-4" />}
                    label="Overlay"
                    body="Extra information drawn on top of the map, like markers, coordinate labels, and grid lines."
                    tone="pink"
                  />
                </div>
                <div className="mt-4 rounded-[1.3rem] border border-emerald-400/20 bg-emerald-400/8 p-4 text-sm leading-7 text-emerald-100">
                  The key idea: the same seed always produces the exact same map, every single time.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Journey — Full step-by-step */}
        <section id="the-journey" className="pb-8 pt-4">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">The Journey</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[3.55rem]">
              From seed to screen, step by step
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
              Every map starts with a seed and ends with the colorful, interactive view you see in the explorer.
              Here is exactly what happens in between — explained so anyone can follow along.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-5xl space-y-5">
            <StepCard
              number={1}
              icon={SeedIcon}
              accent="emerald"
              eyebrow="Starting Point"
              title="You type in a seed"
              paragraphs={[
                "A seed is the starting value that decides how a Minecraft world looks. It can be a number like \"-799836692\" or a word like \"hello\". Minecraft uses this seed to build every mountain, river, and desert in your world.",
                "When you type a seed into ChunkLoader, the app converts it into a single consistent number. If you typed text, the app hashes it (turns it into a number using a formula). If you typed a number, it uses that directly.",
                "This is important because it means the same seed will always produce the same world. Your friend across the world can type the same seed and see exactly the same map. That is the whole point of seeds — they are repeatable."
              ]}
              analogy="Think of a seed like a recipe card number in a massive cookbook. The number itself does not look like food, but if you follow the recipe, you always get the same dish."
              flow={["Your seed text or number", "Convert to a single value", "Ready to build the world"]}
            />

            <StepCard
              number={2}
              icon={GlobeIcon}
              accent="sky"
              eyebrow="Building The Foundation"
              title="The app creates invisible climate maps"
              paragraphs={[
                "From that single seed number, ChunkLoader creates several \"noise\" maps. Noise is a math technique that generates smooth, natural-looking patterns. Instead of random static (like a broken TV), noise creates gentle waves — like rolling hills on a height map.",
                "These noise maps act like invisible climate layers spread across the entire world. One layer controls temperature (hot areas vs. cold areas). Another controls humidity (wet vs. dry). Another controls how far from the ocean a spot is (continentalness). And another controls how rough the terrain should be (erosion).",
                "Each of these layers changes slowly and smoothly across the world. That is why you get large biome regions that feel natural — a big forest gradually transitions into plains, which transitions into desert — instead of random dots of biome everywhere.",
                "The math behind noise works by mixing together waves of different sizes. Big slow waves create the large-scale continent shapes. Medium waves add regional variety. Small waves add local detail. When all the waves are added together, you get a rich, organic-feeling landscape."
              ]}
              analogy="Imagine laying four transparent weather maps on top of each other — one for temperature, one for rainfall, one for altitude, and one for roughness. Together, they describe the character of every spot in the world."
              flow={["Seed number", "Generate noise layers", "Temperature, humidity, land shape, roughness"]}
            />

            <StepCard
              number={3}
              icon={LeafIcon}
              accent="teal"
              eyebrow="The Selection Process"
              title="Climate values are turned into biomes"
              paragraphs={[
                "Now the app has invisible climate values at every position in the world. The next step is to figure out which biome belongs at each spot. ChunkLoader does this by checking those climate values against a set of biome rules.",
                "The rules work like a sorting system. For example: if a spot is very cold and somewhat wet, it becomes a Snowy Taiga. If a spot is very hot and very dry, it becomes a Desert. If a spot has very low continentalness (meaning it's far from land), it becomes an Ocean.",
                "Minecraft Java Edition organizes these rules using five climate parameters: temperature, humidity, continentalness, erosion, and weirdness. Each biome has specific ranges it fits into. ChunkLoader follows the same logic so its map matches what you would actually see in the game.",
                "Because the climate values change smoothly (thanks to the noise maps), biome boundaries also look natural. You will not usually see a Desert right next to a Snowy Plains — the temperature gradient prevents it, just like in real Minecraft."
              ]}
              analogy="Think of it like a sorting hat that reads five scores about each spot — temperature, wetness, how far inland it is, how eroded it is, and a weirdness factor — then places each spot into the right biome category."
              flow={["Climate values at a spot", "Check against biome rules", "Biome decided (e.g. Forest, Desert, Ocean)"]}
            />

            <StepCard
              number={4}
              icon={MountainIcon}
              accent="amber"
              eyebrow="Adding Depth"
              title="The app estimates hills, valleys, and terrain shape"
              paragraphs={[
                "A flat colored map would work, but it would be hard to read. Where are the mountains? Where are the valleys? To make the map more useful, ChunkLoader adds terrain estimation.",
                "Using extra noise layers, the app estimates a rough height and slope for each point. It figures out which areas are uphill, which are flat, and which are low valleys or riverbeds. This is not a perfect 1:1 copy of Minecraft's actual block heights — it is an approximation that gives you a quick visual understanding.",
                "With these height estimates, the app applies shading. Higher areas get slightly brighter colors. Slopes facing away from the \"light source\" get darker shadows. Steep rocky areas get a stone-like tint. This combination of light and shadow is what makes mountains and ridges pop out visually.",
                "ChunkLoader also uses terrain data to draw contour lines (if you enable them). Contour lines are the thin lines that follow the shape of the land — just like on a real topographic map. They help you see elevation changes at a glance."
              ]}
              analogy="Think of shining a lamp across a clay model of the world. The light hits the high parts and creates shadows in the valleys. That light-and-shadow effect is essentially what terrain estimation does to the flat biome colors."
              flow={["Biome color at each point", "Estimate height and slope from noise", "Apply lighting, shadows, and contour lines"]}
            />

            <StepCard
              number={5}
              icon={LayersIcon}
              accent="violet"
              eyebrow="Rendering Smart"
              title="The map only draws what you can see"
              paragraphs={[
                "A Minecraft world is enormous — billions of blocks. Drawing the entire world at once would be impossibly slow. So ChunkLoader uses a tile-based rendering system.",
                "The visible area of your screen is divided into small squares called tiles. Each tile covers a small portion of the world. When the map loads, the app figures out which tiles you can currently see and only renders those tiles.",
                "When you drag the map to explore a new area, the app keeps all the tiles it already rendered and only creates new tiles for the freshly visible edges. This is why panning feels smooth — most of the map is already done, and only a thin strip of new tiles needs to be generated.",
                "When you zoom in or out, the level of detail changes. At low zoom (seeing a large area), each pixel covers many blocks — so the app samples every 4th or 8th block. When you zoom in close, each pixel covers fewer blocks and the detail increases. The app manages this by using different tile sets for different zoom levels.",
                "Old tiles are kept in a cache (a temporary memory) so if you scroll back to a previously visited area, the tiles load instantly instead of being recalculated."
              ]}
              analogy="Imagine looking at a huge mural through a window. You can only see the part directly in front of you. As you walk along the wall, the mural scrolls into view. You do not need to repaint the whole mural every time you move — you just uncover the next section."
              flow={["Your visible screen area", "Render only the visible tiles", "Cache and reuse when you pan or zoom"]}
            />

            <StepCard
              number={6}
              icon={PinIcon}
              accent="pink"
              eyebrow="The Finishing Touches"
              title="Markers, labels, and tool overlays are added on top"
              paragraphs={[
                "After the base terrain map is rendered, ChunkLoader draws extra helper layers on top. These overlays give you the practical scouting tools you need.",
                "Structure markers (like Village, Spawn Point) are calculated from the seed using deterministic placement rules. The app uses the seed to figure out roughly where structures would generate, then places labeled markers at those positions. This is not loading your save file — it is predicting locations from the seed math.",
                "The coordinate grid draws lines at chunk boundaries (every 16 blocks) with labeled axis chips showing world coordinates. You can switch to binary coordinates or enable chunk coordinate labels on the edges.",
                "Biome highlighting lets you select specific biomes and see them glow on the map with labeled markers. Slime chunk overlays show which chunks are slime chunks based on the seed.",
                "The floating tooltip follows your mouse cursor and shows the biome name and exact world coordinates at any point — useful for quickly scanning an area without clicking."
              ]}
              analogy="Think of the base map as a photograph, and the overlays as transparent stickers you place on top — pins for structures, grid lines for coordinates, and colored highlights for specific biomes."
              flow={["Finished terrain map", "Add markers, grid, labels, and highlights", "Interactive scouting layer ready"]}
            />
          </div>
        </section>

        {/* Biome Picking — Deeper explanation */}
        <section id="biome-picking" className="grid gap-6 pb-8 pt-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(19rem,0.92fr)]">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--theme-accent-soft)] text-[var(--theme-accent)]">
                <SearchIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Deep Dive</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  How the app decides which biome belongs at each spot
                </h2>
              </div>
            </div>
            <div className="mt-5 max-w-4xl space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                Biome selection is not random — it follows a structured process. At each world position, ChunkLoader
                reads the five climate parameters generated by the noise maps. These five values together form a unique
                &quot;climate fingerprint&quot; for that position.
              </p>
              <p>
                The app then matches that fingerprint against a lookup table of biome rules. Minecraft defines specific
                ranges for each parameter that correspond to each biome. For example, a position with very high temperature,
                very low humidity, and medium continentalness fits the Desert biome. A position with low temperature and
                high humidity fits Snowy Taiga.
              </p>
              <p>
                Because the noise maps create gradients (smooth transitions between values), the biome boundaries also transition
                naturally. You will see large connected biome regions rather than scattered patches, and neighboring biomes
                tend to make climatic sense — warm biomes next to warm biomes, cold next to cold.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Ocean detection",
                  body: "Very low continentalness values almost always mean ocean biomes. The further from land, the deeper the ocean variant becomes."
                },
                {
                  title: "Mountain detection",
                  body: "High continentalness combined with low erosion typically produces peaks and mountain biomes with steep terrain."
                },
                {
                  title: "Cold biomes",
                  body: "Low temperature values lead to snowy and frozen variants — Snowy Plains, Frozen River, Ice Spikes, and similar cold biomes."
                },
                {
                  title: "Dry biomes",
                  body: "High temperature with low humidity creates deserts, badlands, and savanna — the hot, dry side of the climate spectrum."
                },
              ].map((rule) => (
                <div
                  key={rule.title}
                  className="rounded-[1.2rem] border border-white/8 bg-white/[0.03] px-4 py-4"
                >
                  <p className="text-sm font-semibold text-white">{rule.title}</p>
                  <p className="mt-2 text-sm leading-7 text-[var(--theme-text-secondary)]">{rule.body}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-sky-300">The Math, Simply</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How Noise Works (no math degree needed)
            </h2>
            <p className="mt-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              Imagine dropping a stone into still water. The ripples spread out in smooth waves. Noise generation
              is similar — it creates wave-like patterns, but in 2D across the whole map.
            </p>
            <p className="mt-3 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              The trick is mixing several wave sizes together. Big waves create the overall continent shape (thousands of blocks wide).
              Medium waves create regional variety (hundreds of blocks). Small waves add fine detail (tens of blocks). When combined:
            </p>
            <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-[#0b1322]/90 p-4">
              <code className="block text-sm leading-7 text-emerald-100">
                final value = big wave + medium wave + small wave + tiny wave
              </code>
              <p className="mt-2 text-xs leading-6 text-[var(--theme-text-faint)]">
                Each smaller wave has less influence, so the big shapes are always dominant.
              </p>
            </div>
            <p className="mt-5 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              The app also compares the height values of nearby points to calculate slope. Steep differences mean cliffs
              and ridges. Gentle differences mean flat plains. This slope information is what drives the shadow and
              highlight effects that make the terrain look three-dimensional.
            </p>
            <div className="mt-5 rounded-[1.3rem] border border-emerald-400/20 bg-emerald-400/8 p-4 text-sm leading-7 text-emerald-100">
              The result feels organic because nature works the same way — large landmasses, medium hills, and small
              bumps all layered together.
            </div>
          </article>
        </section>

        {/* Terrain and Speed sections */}
        <section id="terrain-shading" className="grid gap-6 pb-8 pt-8 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-amber-300">Visual Depth</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why the map has light and shadow
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                Without terrain shading, the map would just be flat colored patches — functional but hard to read.
                The shading layer is what gives the map a sense of geography. You can immediately tell where mountains
                are, where valleys dip, and where the land is flat.
              </p>
              <p>
                The app simulates a light source hitting the terrain from one direction. Surfaces facing the light get
                brighter. Surfaces facing away get darker. Steep slopes get especially dark shadows. Very high areas
                get a subtle rocky or snowy tint depending on the biome climate.
              </p>
              <p>
                Water biomes get the opposite treatment — deeper water becomes darker blue, and shallow water gets a
                slightly lighter, more cyan tone. This makes rivers and coastlines easy to distinguish from deep ocean.
              </p>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-pink-300">Overlays Explained</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              How markers and tools are placed
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
              <p>
                Structure markers (Villages, Spawn Point, etc.) are overlays calculated from the seed. The app uses
                deterministic rules — given the same seed, the same structures appear at the same positions every time.
                This is not reading a save file; it is using the same math Minecraft uses to predict placement.
              </p>
              <p>
                The coordinate grid is drawn on a separate transparent canvas layered on top of the map.
                When you toggle it, the grid canvas is cleared or redrawn instantly without touching the map tiles underneath.
              </p>
              <p>
                Slime chunk detection works by hashing each chunk&apos;s coordinates with the seed, then checking if the result
                meets a specific condition. Matching chunks get a green overlay rectangle. This matches the same formula
                Minecraft Java Edition uses.
              </p>
            </div>
          </article>
        </section>

        {/* Credits section */}
        <section className="pb-8 pt-8">
          <article className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06] text-white">
                <InfoIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Credit And Inspiration</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Where the idea comes from
                </h2>
              </div>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
                  ChunkLoader is inspired by the wider Minecraft seed-tool community and the idea of fast,
                  browser-based seed scouting. A key inspiration is
                  <span className="font-medium text-white"> Cubiomes Viewer</span>, which is well-known for
                  fast biome rendering and seed searching. That tool helped shape the vision that seed maps
                  should be quick to explore and useful for planning before loading a world.
                </p>
              </div>
              <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-5">
                <p className="text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">
                  The
                  <span className="font-medium text-white"> product concept and exploration flow</span> —
                  seeded world preview, biome scouting, structure helpers, and fast map reading — draws from that
                  inspiration. However, the map engine on this site is a
                  <span className="font-medium text-white"> custom TypeScript implementation</span>{" "}
                  built from scratch in files like{" "}
                  <span className="font-mono text-white">noise.ts</span>,{" "}
                  <span className="font-mono text-white">biome-generator.ts</span>, and{" "}
                  <span className="font-mono text-white">map-overlays.ts</span>.
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-[1.4rem] border border-emerald-400/15 bg-emerald-400/8 p-5 text-sm leading-8 text-emerald-100 sm:text-base">
              The inspiration comes from the Minecraft seed-tool ecosystem, but the rendering engine on this
              site is a custom browser-side approximation — not a direct copy of any external generator.
            </div>
          </article>
        </section>

        {/* Accuracy and Limits */}
        <section id="accuracy" className="pb-8 pt-8">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Expectations</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              What to expect from the map
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
              ChunkLoader is a scouting tool, not a full Minecraft simulator. Here is what it does
              well and where it has limits.
            </p>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-6 lg:grid-cols-2">
            <CompareCard
              title="What ChunkLoader is great for"
              eyebrow="Strengths"
              accent="emerald"
              icon={<CompassRoseIcon className="h-5 w-5" />}
              intro="Use it as a fast scouting and planning tool. It excels at giving you a high-level understanding of any seed."
              items={[
                "Quick scouting — see biome layout in seconds without opening Minecraft",
                "Comparing different areas of the same seed before committing to a base location",
                "Reading the broad biome layout and understanding the terrain shape at a glance",
                "Sharing the exact same map view with another player via a URL link",
                "Locating approximate structure positions and spawn point for planning",
              ]}
            />
            <CompareCard
              title="What still has limits"
              eyebrow="Honest Limits"
              accent="red"
              icon={<WarningIcon className="h-5 w-5" />}
              intro="It is not trying to perfectly recreate every single Minecraft world rule. Here is where it may differ from in-game results."
              items={[
                "Not a block-for-block rebuild — it is an approximation, not a full simulation",
                "Terrain heights are estimated, not actual Y-level values from the game",
                "Structure placement is deterministic but may not match every edge case",
                "Custom datapacks or modded world generators will not be reflected",
                "For important exact locations, always double-check in the actual game",
              ]}
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="pb-12 pt-8">
          <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(135deg,rgba(9,20,30,0.96),rgba(14,33,50,0.9)_48%,rgba(12,17,35,0.96))] px-5 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.42)] sm:px-8 sm:py-12">
            <div className="pointer-events-none absolute -right-12 top-[-4rem] h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-5rem] left-[28%] h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-accent)]">Try It Live</p>
                <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Now that you know how it works, explore a seed yourself.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--theme-text-secondary)] sm:text-base">
                  Open the seed map generator, type any seed, and watch the engine do everything
                  this page just described — in real time, right in your browser.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/explore"
                  className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--theme-accent-strong),var(--theme-accent))] px-6 py-3.5 text-sm font-semibold text-[#04110b] shadow-[var(--theme-shadow-accent)] transition-transform hover:scale-[1.01]"
                >
                  Open Seed Map Generator
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/20 px-5 py-3.5 text-sm text-[var(--theme-text-muted)] transition-colors duration-200 hover:border-white/20"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ───────────────────── Subcomponents ───────────────────── */

function AnchorChip({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-[var(--theme-text-secondary)] transition-colors hover:border-[var(--theme-border-strong)] hover:bg-white/[0.08] hover:text-white"
    >
      {children}
    </a>
  );
}

function GlossaryPill({
  icon,
  label,
  body,
  tone,
}: {
  icon: ReactNode;
  label: string;
  body: string;
  tone: "emerald" | "sky" | "teal" | "violet" | "pink";
}) {
  const toneStyles = {
    emerald: "bg-emerald-500/8 border-emerald-400/14",
    sky: "bg-sky-500/8 border-sky-400/14",
    teal: "bg-teal-500/8 border-teal-400/14",
    violet: "bg-violet-500/8 border-violet-400/14",
    pink: "bg-pink-500/8 border-pink-400/14",
  }[tone];

  return (
    <div className={`grid gap-3 rounded-[1.1rem] border px-4 py-3 ${toneStyles} md:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] md:items-center`}>
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[var(--theme-accent)]">
          {icon}
        </span>
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
      <span className="text-sm leading-7 text-[var(--theme-text-secondary)] md:text-left">{body}</span>
    </div>
  );
}

function StepCard({
  number,
  icon: Icon,
  accent,
  eyebrow,
  title,
  paragraphs,
  analogy,
  flow,
}: {
  number: number;
  icon: (props: { className?: string }) => ReactNode;
  accent: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  analogy: string;
  flow: [string, string, string];
}) {
  const accentStyles: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-300",
    sky: "bg-sky-500/10 text-sky-300",
    teal: "bg-teal-500/10 text-teal-300",
    amber: "bg-amber-500/10 text-amber-300",
    violet: "bg-violet-500/10 text-violet-200",
    pink: "bg-pink-500/10 text-pink-300",
  };

  const analogyAccent: Record<string, string> = {
    emerald: "border-emerald-400/20 bg-emerald-400/8 text-emerald-100",
    sky: "border-sky-400/20 bg-sky-400/8 text-sky-100",
    teal: "border-teal-400/20 bg-teal-400/8 text-teal-100",
    amber: "border-amber-400/20 bg-amber-400/8 text-amber-100",
    violet: "border-violet-400/22 bg-violet-400/8 text-violet-100",
    pink: "border-pink-400/20 bg-pink-400/8 text-pink-100",
  };

  return (
    <article className="card-hover rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))] p-6 shadow-[var(--theme-shadow-panel)]">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-lg font-semibold text-white">
          {number}
        </span>
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentStyles[accent] ?? ""}`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="text-[0.72rem] uppercase tracking-[0.24em] text-[var(--theme-text-faint)]">{eyebrow}</p>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h3>
          <div className="mt-4 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">{p}</p>
            ))}
          </div>
        </div>

        {/* Analogy callout */}
        <div className={`rounded-[1.3rem] border p-4 text-sm leading-7 ${analogyAccent[accent] ?? "border-white/10 bg-white/5 text-white/80"}`}>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] opacity-70">Think of it like…</span>
          <p className="mt-1.5">{analogy}</p>
        </div>

        {/* Flow diagram */}
        <div className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] px-4 py-4 sm:px-5">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-[var(--theme-text-faint)]">How it flows</p>
          <div className="mt-3 grid justify-items-start gap-2.5 text-xs text-[var(--theme-text-secondary)] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center sm:justify-items-stretch sm:gap-x-2 sm:gap-y-2">
            <FlowChip label={flow[0]} />
            <FlowArrow />
            <FlowChip label={flow[1]} />
            <FlowArrow />
            <FlowChip label={flow[2]} />
          </div>
        </div>
      </div>
    </article>
  );
}

function FlowChip({ label }: { label: string }) {
  return (
    <div className="w-full rounded-[999px] border border-white/8 bg-black/20 px-4 py-2 text-xs leading-6 text-white/90 sm:min-h-[3.25rem] sm:w-auto sm:content-center">
      {label}
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      aria-hidden="true"
      className="flex w-full items-center justify-center self-center text-white/35 sm:w-auto"
    >
      <span className="text-base leading-none sm:hidden">↓</span>
      <span className="hidden text-base leading-none sm:inline">→</span>
    </div>
  );
}

function CompareCard({
  eyebrow,
  title,
  intro,
  items,
  icon,
  accent,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  items: string[];
  icon: ReactNode;
  accent: "emerald" | "red";
}) {
  const accentStyles = accent === "emerald"
    ? "bg-emerald-500/10 text-emerald-300"
    : "bg-red-500/10 text-red-300";
  const eyebrowStyles = accent === "emerald"
    ? "text-emerald-300"
    : "text-red-300";
  const bgStyles = accent === "emerald"
    ? "bg-[linear-gradient(180deg,rgba(17,25,43,0.82),rgba(10,14,28,0.86))]"
    : "bg-[linear-gradient(180deg,rgba(33,18,18,0.82),rgba(21,12,12,0.9))]";

  return (
    <article className={`rounded-[2rem] border border-white/10 ${bgStyles} p-6 shadow-[var(--theme-shadow-panel)]`}>
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accentStyles}`}>
          {icon}
        </span>
        <div>
          <p className={`text-[0.72rem] uppercase tracking-[0.24em] ${eyebrowStyles}`}>{eyebrow}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        </div>
      </div>
      <p className="mt-5 text-sm leading-8 text-[var(--theme-text-secondary)] sm:text-base">{intro}</p>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[1.1rem] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-[var(--theme-text-secondary)]"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  );
}
